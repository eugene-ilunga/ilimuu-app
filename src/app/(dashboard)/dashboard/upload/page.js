"use client";

import { useState } from "react";

export default function UploadPage() {
  const [resource, setResource] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data?.status) {
        throw new Error(data?.error || "Upload failed");
      }

      setResource(data);
    } catch (error) {
      console.error("Upload failed:", error);
      setResource(null);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4 p-6">
      <input type="file" onChange={handleChange} />
      {uploading && <p>Uploading...</p>}
      {resource && (
        <div className="space-y-2">
          <p>URL: {resource.url}</p>
          <p>Identifier: {resource.public_id}</p>
        </div>
      )}
    </div>
  );
}
