import { saveUploadedFile } from "@/utils/local-file-storage";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file") || formData.get("image");
  
  if (!file || typeof file.arrayBuffer !== "function") {
    return Response.json({ error: "No valid file uploaded" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ progress: 25 })}\n\n`)
        );
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ progress: 75 })}\n\n`)
        );

        const result = await saveUploadedFile(file);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ success: true, progress: 100, url: result.url, public_id: result.public_id })}\n\n`
          )
        );
        controller.close();
      } catch (error) {
        console.error("File upload failed:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "File upload failed" })}\n\n`
          )
        );
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
