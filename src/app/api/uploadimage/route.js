import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/utils/local-file-storage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const storedFile = await saveUploadedFile(file, { prefix: "image" });

    return NextResponse.json({
      status: true,
      url: storedFile.url,
      public_id: storedFile.public_id,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
