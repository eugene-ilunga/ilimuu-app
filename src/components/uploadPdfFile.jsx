"use client";
import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const UploadPdfWidget = ({ onUpload }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10000000) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Upload file
    setUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading("Uploading PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status && data.url) {
        const uploadData = {
          secure_url: data.url,
          public_id: data.public_id,
        };

        setPdfUrl(data.url);
        if (onUpload) {
          onUpload(uploadData);
        }
        toast.success("PDF uploaded successfully", { id: toastId });
        setUploadProgress(100);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload PDF", { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onUpload) {
      onUpload(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Lecture PDF</CardTitle>
        <CardDescription>
          Upload your lecture PDF file here. Supported format: PDF. Maximum file size is 10MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {pdfUrl ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">PDF uploaded successfully</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-green-600 hover:underline"
              >
                <FileText className="h-4 w-4" />
                View PDF
              </a>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No PDF file uploaded yet
              </p>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading... {uploadProgress}%</span>
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="flex items-center justify-center gap-2 w-full"
            variant={pdfUrl ? "outline" : "default"}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {pdfUrl ? "Replace PDF" : "Upload PDF"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPdfWidget;
