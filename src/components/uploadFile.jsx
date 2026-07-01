"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Video,
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

const UploadWidget = ({ onUpload }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const videoTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime", "video/x-msvideo"];
    if (!videoTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov)$/i)) {
      toast.error("Please select a valid video file (MP4, AVI, MOV)");
      return;
    }

    // Validate file size (30MB)
    if (file.size > 30000000) {
      toast.error("File size must be less than 30MB");
      return;
    }

    // Upload file
    setUploading(true);
    const toastId = toast.loading("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status && data.url) {
        // For video, we'll use the video URL as thumbnail for now
        // Cloudinary generates thumbnail automatically for videos
        const uploadData = {
          secure_url: data.url,
          public_id: data.public_id,
          thumbnail_url: data.thumbnail_url || data.url, // Fallback to video URL
          videoUrl: data.url,
        };

        setVideoUrl(data.url);
        setThumbnail(data.thumbnail_url || data.url);
        if (onUpload) {
          onUpload(uploadData);
        }
        toast.success("Video uploaded successfully", { id: toastId });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload video", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setThumbnail(null);
    setVideoUrl(null);
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
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/avi,video/mov,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
      />

      {thumbnail ? (
        <div className="space-y-2">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-slate-100">
            <Image
              alt="Video thumbnail"
              src={thumbnail}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Video className="h-8 w-8 text-white" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Video uploaded successfully</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className="relative w-full aspect-video rounded-md border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-center"
        >
          <div className="text-center">
            <Video className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs text-slate-600">Click to upload video</p>
            <p className="text-xs text-slate-400 mt-1">MP4, AVI, MOV (Max 30MB)</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading video...</span>
        </div>
      )}

      {!thumbnail && !uploading && (
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      )}
    </div>
  );
};

export default UploadWidget;
