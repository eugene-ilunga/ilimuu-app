import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/utils/local-file-storage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileType = file.type || "";
    const fileName = file.name?.toLowerCase() || "";
    let prefix = "file";

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      prefix = "pdf";
    } else if (
      fileType.startsWith("video/") ||
      /\.(mp4|avi|mov|quicktime|webm|mkv)$/i.test(fileName)
    ) {
      prefix = "video";
    } else if (fileType.startsWith("image/")) {
      prefix = "image";
    }

    const storedFile = await saveUploadedFile(file, { prefix });

    return NextResponse.json({
      status: true,
      url: storedFile.url,
      public_id: storedFile.public_id,
      thumbnail_url: fileType.startsWith("image/") ? storedFile.url : null,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return NextResponse.json({
        status: false,
        error: "File upload failed" }, { status: 500 });
  }
}
