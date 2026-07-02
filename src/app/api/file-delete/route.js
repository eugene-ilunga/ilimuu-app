import { NextResponse } from "next/server";
import { deleteStoredFile } from "@/utils/local-file-storage";

export  async function POST(req, res) {
    let payload;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = {
        fileUrl: formData.get("fileUrl"),
        public_id: formData.get("public_id"),
      };
    }

    const fileReference = payload?.public_id || payload?.fileUrl;

    if (!fileReference) {
      return NextResponse.json({status: 400, error: "File reference is required" });
    }

    try {
      const result = await deleteStoredFile(fileReference);
      if (!result.deleted && result.reason !== "not_found") {
        return NextResponse.json({status:500, error: "Failed to delete file" });
      }

      return NextResponse.json({ status:200, message: "File deleted successfully" });
    } catch (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json({ status:500, error: "Server error " + error.message });
    }
  } 
