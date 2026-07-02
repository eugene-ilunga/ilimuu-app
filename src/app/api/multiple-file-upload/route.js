import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/utils/local-file-storage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") || formData.getAll("image");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map((file) => saveUploadedFile(file));
    const results = await Promise.all(uploadPromises);

    const uploadedFiles = results.map((result) => ({
      url: result.url,
      public_id: result.public_id,
    }));

    return NextResponse.json({
      status: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return NextResponse.json(
      {
        status: false,
        error: "File upload failed",
      },
      { status: 500 }
    );
  }
}
