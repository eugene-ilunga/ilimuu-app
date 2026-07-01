"use client";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Video, Upload, Link2, Clock, FileText, CheckCircle2, XCircle, Loader2, File } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import UploadWidget from "@/components/uploadFile";
import UploadPdfWidget from "@/components/uploadPdfFile";

import toast from "react-hot-toast";

function Lecture() {
  const [submitting, setSubmitting] = useState(false);

  const [lectureData, setLectureData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoType, setvideoType] = useState("");
  const [contentType, setContentType] = useState("video"); // "video", "pdf", or "both"

  const router = useRouter();
  const searchParams = useSearchParams();
  const courseID = searchParams.get("id");
  const course = searchParams.get("course");
  const session = searchParams.get("session");
  console.log(session);
  const isLiveSession = session === "Live";
  const [isChecked, setIsChecked] = useState(false);

  // const storedCourseID = localStorage.getItem('data');

  const [Lecture, setLecture] = useState();
  const [PdfFile, setPdfFile] = useState();
  const [editingLecture, setEditingLecture] = useState(null);
  const [activeTab, setActiveTab] = useState("lectureList");

  const createLecture = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (!isLiveSession) {
      formData.append("contentType", contentType);
      
      // Add video data if content type is "video" or "both"
      if (contentType === "video" || contentType === "both") {
        formData.append("videoType", videoType);
        formData.append("videoUrl", Lecture?.videoUrl || "");
        formData.append("video_public_id", Lecture?.video_public_id || "");
        formData.append("thumbnail", Lecture?.thumbnail || "");
      }
      
      // Add PDF data if content type is "pdf" or "both"
      if (contentType === "pdf" || contentType === "both") {
        formData.append("pdfUrl", PdfFile?.secure_url || "");
        formData.append("pdf_public_id", PdfFile?.public_id || "");
      }
    }

    formData.append("course", courseID);
    formData.append("status", isChecked ? "free" : "paid");

    if (isLiveSession) {
      formData.append("classTime", formData.get("classTime"));
      formData.append("classroomLink", formData.get("classroomLink"));
    }

    setSubmitting(true);
    const toastId = toast.loading(editingLecture ? "Updating lecture..." : "Creating lecture...");
    
    try {
      let res;
      if (editingLecture) {
        // Update existing lecture
        formData.append("id", editingLecture._id);
        res = await fetch("/api/lecture/update", {
          method: "PUT",
          body: formData,
        });
      } else {
        // Create new lecture
        res = await fetch("/api/lecture/add-new", {
          method: "POST",
          body: formData,
        });
      }

      setSubmitting(false);

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error(editingLecture ? "Failed to update lecture" : "Failed to create lecture");
        throw new Error(res.status);
      }

      const data = await res.json();
      toast.success(editingLecture ? "Lecture updated successfully" : "Lecture created successfully", { id: toastId });

      // Reset form
      event.target.reset();
      setLecture(null);
      setPdfFile(null);
      setvideoType("");
      setContentType("video");
      setIsChecked(false);
      setEditingLecture(null);
      setActiveTab("lectureList");
      fetchLecture();
    } catch (error) {
      console.error("Failed to save lecture: ", error);
      setSubmitting(false);
    }
  };

  const fetchLecture = async () => {
    try {
      const formdata = new FormData();
      formdata.set("page", currentPage);
      formdata.set("pagination", 5);
      formdata.set("courseid", courseID);
      const res = await fetch("/api/lecture", {
        cache: "no-store",
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setLectureData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    fetchLecture();
  }, [currentPage]);

  const handleUploadSuccess = (info) => {
    setLecture({
      ...Lecture,
      videoUrl: info.secure_url,
      video_public_id: info.public_id,
      thumbnail: info.thumbnail_url,
    });
  };

  const handlePdfUploadSuccess = (info) => {
    setPdfFile({
      secure_url: info.secure_url,
      public_id: info.public_id,
    });
  };

  const handleSelect = (value) => {
    setvideoType(value);
  };

  // Handle edit lecture
  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);
    setActiveTab("addLecture");
    
    // Populate form fields
    if (lecture.contentType) {
      setContentType(lecture.contentType);
    } else {
      // Determine content type from available data
      if (lecture.videoUrl && lecture.pdfUrl) {
        setContentType("both");
      } else if (lecture.pdfUrl) {
        setContentType("pdf");
      } else {
        setContentType("video");
      }
    }
    
    // Set video type if video exists
    if (lecture.videoUrl) {
      if (lecture.videoUrl.includes("youtube.com") || lecture.videoUrl.includes("youtu.be")) {
        setvideoType("Youtube URL");
      } else if (lecture.videoUrl.includes("drive.google.com")) {
        setvideoType("Google Drive Video");
      } else {
        setvideoType("Video File (.mp4)");
      }
      
      // Set video data
      setLecture({
        videoUrl: lecture.videoUrl,
        video_public_id: lecture.video_public_id,
        thumbnail: lecture.thumbnail,
      });
    }
    
    // Set PDF data if exists
    if (lecture.pdfUrl) {
      setPdfFile({
        secure_url: lecture.pdfUrl,
        public_id: lecture.pdf_public_id,
      });
    }
    
    // Set status
    setIsChecked(lecture.status === "free");
    
    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle delete lecture
  const handleDeleteLecture = async (lectureId) => {
    if (!confirm("Are you sure you want to delete this lecture?")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/lecture/delete?id=${lectureId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        toast.success("Lecture deleted successfully");
        fetchLecture();
      } else {
        toast.error("Failed to delete lecture");
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error("Failed to delete lecture");
    }
  };

  const handleContentTypeChange = (value) => {
    setContentType(value);
    // Reset video and PDF when changing content type
    if (value === "pdf") {
      setLecture(null);
      setvideoType("");
    } else if (value === "video") {
      setPdfFile(null);
    }
  };

  const handleCheckboxChange = (value) => {
    setIsChecked(value);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{course}</h1>
        <p className="text-muted-foreground mt-2">
          Manage lectures for this course
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="lectureList" className="gap-2">
            <FileText className="h-4 w-4" />
            Lecture List
          </TabsTrigger>
          <TabsTrigger value="addLecture" className="gap-2">
            <Plus className="h-4 w-4" />
            {editingLecture ? "Edit Lecture" : "Add Lecture"}
          </TabsTrigger>
        </TabsList>

      <TabsContent value="lectureList">
        <Card>
          <CardHeader>
            <CardTitle> {course}</CardTitle>
            <CardDescription>
              Here all lecture list of this Course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lectureData.length === 0 ? (
              <div className="text-center py-10">No data Found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Duration
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectureData.map((lecture) => (
                    <TableRow key={lecture._id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Video image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={
                            lecture.thumbnail === null ||
                            lecture.thumbnail === "null"
                              ? "/assets/placeholder.jpg"
                              : lecture.thumbnail
                          }
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {lecture.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {lecture.duration}
                      </TableCell>
                      <TableCell>
                        <Badge className="capitalize" variant="outline">
                          {lecture.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(lecture.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onSelect={() => handleEditLecture(lecture)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDeleteLecture(lecture._id)}
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {lectureData.length ? (currentPage - 1) * 5 + 1 : 0}
              </strong>{" "}
              to <strong>{(currentPage - 1) * 5 + lectureData.length}</strong>{" "}
              of <strong>{totalPages * 5}</strong> lectures
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                        isActive={currentPage === totalPages}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="addLecture" className="mt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={createLecture} className="space-y-6">
              {/* Basic Information Card */}
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {editingLecture 
                      ? (isLiveSession ? "Edit Live Session" : "Edit Lecture")
                      : (isLiveSession ? "Live Session Details" : "Lecture Information")
                    }
                  </CardTitle>
                  <CardDescription>
                    {isLiveSession 
                      ? "Add details for your live session" 
                      : "Enter the basic information for your lecture"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      className="w-full h-11"
                      placeholder="Enter lecture title..."
                      defaultValue={editingLecture?.title || ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {isLiveSession
                        ? "Session Duration (HH:MM)"
                        : "Lecture Duration (HH:MM)"}
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="text"
                      className="w-full h-11"
                      pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
                      placeholder="01:30"
                      defaultValue={editingLecture?.duration || ""}
                      title="Enter the duration in Hours:Minutes format. Ex: 01:30 for 1 hour 30 minutes"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: HH:MM (e.g., 01:30 for 1 hour 30 minutes)
                    </p>
                  </div>

                  {isLiveSession && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="classTime" className="text-base font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Class Time <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="classTime"
                          name="classTime"
                          type="datetime-local"
                          className="w-full h-11"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="classroomLink" className="text-base font-semibold flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            Classroom Link <span className="text-destructive">*</span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={() => {
                              const jitsiUrl = `/meeting/${course}?session=${encodeURIComponent(
                                session
                              )}&isModerator=${true}`;
                              window.open(
                                jitsiUrl,
                                "_blank",
                                "width=800,height=600"
                              );
                            }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Generate Link
                          </Button>
                        </div>
                        <Input
                          id="classroomLink"
                          name="classroomLink"
                          type="url"
                          className="w-full h-11"
                          placeholder="https://classmeet.us/online-class/..."
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-base font-semibold">
                      Summary
                    </Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      className="min-h-32 resize-none"
                      placeholder="Enter a brief summary of the lecture..."
                      defaultValue={editingLecture?.summary || ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Provide a brief description of what students will learn in this lecture
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Content Type Selection - Only for non-live sessions */}
              {!isLiveSession && (
                <Card>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Lecture Content
                    </CardTitle>
                    <CardDescription>
                      Choose the type of content for this lecture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="contentType" className="text-base font-semibold">
                        Content Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={contentType} onValueChange={handleContentTypeChange}>
                        <SelectTrigger id="contentType" className="h-11">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              Video Content Only
                            </div>
                          </SelectItem>
                          <SelectItem value="pdf">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              PDF Content Only
                            </div>
                          </SelectItem>
                          <SelectItem value="both">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Both Video and PDF
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Select whether this lecture contains video, PDF, or both types of content
                      </p>
                    </div>

                    {/* Video Content Section */}
                    {(contentType === "video" || contentType === "both") && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                          <Video className="h-5 w-5 text-primary" />
                          <Label className="text-base font-semibold">
                            Video Content
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="videoType" className="text-sm font-semibold">
                            Video Source <span className="text-destructive">*</span>
                          </Label>
                          <Select onValueChange={handleSelect}>
                            <SelectTrigger id="videoType" className="h-11">
                              <SelectValue placeholder="Select video source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Video File (.mp4)">
                                <div className="flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Video File (.mp4)
                                </div>
                              </SelectItem>
                              <SelectItem value="Youtube URL">
                                <div className="flex items-center gap-2">
                                  <Link2 className="h-4 w-4" />
                                  YouTube URL
                                </div>
                              </SelectItem>
                              <SelectItem value="Google Drive Video">
                                <div className="flex items-center gap-2">
                                  <Link2 className="h-4 w-4" />
                                  Google Drive Video
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {videoType === "Youtube URL" && (
                          <div className="space-y-2">
                            <Label htmlFor="videoUrl" className="text-sm font-medium flex items-center gap-2">
                              <Link2 className="h-4 w-4" />
                              YouTube Video URL
                            </Label>
                            <Input
                              id="videoUrl"
                              onChange={(e) =>
                                setLecture({
                                  ...Lecture,
                                  videoUrl: e.target.value,
                                })
                              }
                              defaultValue={editingLecture?.videoUrl || Lecture?.videoUrl || ""}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="h-11"
                            />
                            <p className="text-xs text-muted-foreground">
                              Paste the full YouTube video URL here
                            </p>
                          </div>
                        )}

                        {videoType === "Google Drive Video" && (
                          <div className="space-y-2">
                            <Label htmlFor="videoUrl" className="text-sm font-medium flex items-center gap-2">
                              <Link2 className="h-4 w-4" />
                              Google Drive Video URL
                            </Label>
                            <Input
                              id="videoUrl"
                              onChange={(e) =>
                                setLecture({
                                  ...Lecture,
                                  videoUrl: e.target.value,
                                })
                              }
                              defaultValue={editingLecture?.videoUrl || Lecture?.videoUrl || ""}
                              placeholder="https://drive.google.com/file/d/..."
                              className="h-11"
                            />
                            <p className="text-xs text-muted-foreground">
                              Paste the Google Drive video sharing URL here
                            </p>
                          </div>
                        )}

                        {videoType === "Video File (.mp4)" && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Upload Video File
                            </Label>
                            <UploadWidget onUpload={handleUploadSuccess} />
                          </div>
                        )}

                        {!videoType && (
                          <div className="p-8 border-2 border-dashed rounded-lg text-center bg-muted/30">
                            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">
                              Please select a video source above
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PDF Content Section */}
                    {(contentType === "pdf" || contentType === "both") && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                          <File className="h-5 w-5 text-primary" />
                          <Label className="text-base font-semibold">
                            PDF Content {contentType === "both" && <span className="text-destructive">*</span>}
                          </Label>
                        </div>
                        <UploadPdfWidget onUpload={handlePdfUploadSuccess} />
                        {PdfFile?.secure_url && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="text-sm font-medium">PDF uploaded successfully</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Status Card */}
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {isLiveSession ? "Session Status" : "Statut de la leçon"}
                  </CardTitle>
                  <CardDescription>
                    Set the pricing status for this {isLiveSession ? "session" : "lecture"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id="terms1"
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-1"
                    />
                    <div className="grid gap-2 flex-1">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Mark as free {isLiveSession ? "session" : "lecture"}
                      </label>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        By default, all {isLiveSession ? "sessions" : "lectures"} are paid. 
                        Check this box to make this {isLiveSession ? "session" : "lecture"} available for free.
                      </p>
                      <div className="mt-2">
                        <Badge variant={isChecked ? "default" : "secondary"} className="text-xs">
                          {isChecked ? "Gratuit" : "Paid"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.target.closest('form');
                    if (form) {
                      form.reset();
                    }
                    setLecture(null);
                    setPdfFile(null);
                    setvideoType("");
                    setContentType("video");
                    setIsChecked(false);
                    setEditingLecture(null);
                    setActiveTab("lectureList");
                  }}
                  className="min-w-[120px]"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="min-w-[140px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingLecture ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {editingLecture ? "Update Lecture" : "Create Lecture"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar - Quick Guide for Desktop (Non-Live) */}
          {!isLiveSession && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Quick Guide
                  </CardTitle>
                  <CardDescription>
                    Content type selection guide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Content Type</Label>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-xs font-medium">Selected:</p>
                      <Badge variant="outline" className="w-full justify-center">
                        {contentType === "video" && "Video Only"}
                        {contentType === "pdf" && "PDF Only"}
                        {contentType === "both" && "Video + PDF"}
                      </Badge>
                    </div>
                  </div>

                  {contentType === "video" || contentType === "both" ? (
                    videoType && (
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-xs font-medium">Video Source:</p>
                        <Badge variant="outline" className="w-full justify-center">
                          {videoType}
                        </Badge>
                      </div>
                    )
                  ) : null}

                  <div className="pt-4 border-t space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Tips
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {contentType === "video" || contentType === "both" ? (
                        <>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Video files should be in MP4 format</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>YouTube URLs must be public or unlisted</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Google Drive videos must be shareable</span>
                          </li>
                        </>
                      ) : null}
                      {contentType === "pdf" || contentType === "both" ? (
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>PDF files maximum size is 10MB</span>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
    </div>
  );
}

function LectureSuspense() {
  return (
    <Suspense>
      <Lecture />
    </Suspense>
  );
}

export default LectureSuspense;
