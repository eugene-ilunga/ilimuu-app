"use client";
import { Button } from "@/components/ui/button";
import {
  Car,
  File,
  ListFilter,
  Upload,
  MoreHorizontal,
  ChevronLeft,
  PlusCircle,
} from "lucide-react";

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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import toast from "react-hot-toast";

function Lecture() {
  const [submitting, setSubmitting] = useState(false);

  const [lectureData, setLectureData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [videoType, setvideoType] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const courseID = searchParams.get("id");
  const course = searchParams.get("course");
  const session = searchParams.get("session")
  const [isChecked, setIsChecked] = useState(false);

  // const storedCourseID = localStorage.getItem('data');

  const [Lecture, setLecture] = useState();

  const createLecture = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    formData.append("videoType", videoType);
    formData.append("videoUrl", Lecture.videoUrl);
    formData.append("video_public_id", Lecture.thumbnail ?? null);
    formData.append("thumbnail", Lecture.thumbnail ?? null);
    formData.append("course", courseID);
    formData.append("status", isChecked ? "free" : "paid");

    setSubmitting(true);
    const toastId = toast.loading("Creating lecture...");
    try {
      const res = await fetch("/api/lecture/add-new", {
        method: "POST",
        body: formData,
      });

      setSubmitting(false);

      if (!res.ok) {
        toast.dismiss(toastId);
        toast.error("Failed to create lecture");
        throw new Error(res.status);
      }

      const { id } = await res.json();
      toast.success("Lecture created successfully", { id: toastId });

      event.target.reset();
      setLecture(null);
      fetchLecture();
    } catch (error) {
      console.error("Failed to create lecture: ", error);
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

  const handleSelect = (value) => {
    setvideoType(value);
  };

  const handleCheckboxChange = (value) => {
    setIsChecked(value);
  };

  return (
    <Tabs defaultValue="lectureList" className="p-5">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="lectureList">Lecture List</TabsTrigger>

        <TabsTrigger value="addLecture">Add Lecture</TabsTrigger>
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
                            lecture.thumbnail === null || lecture.thumbnail === "null"
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
                              onSelect={() => handleSelect("edit")}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleSelect("delete")}
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
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
              <strong>{(currentPage - 1) * 5 + 5}</strong> Lecture
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages).keys()].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="addLecture">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8  md:hidden">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Video Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Type</Label>
                        <Select onValueChange={handleSelect}>
                          <SelectTrigger
                            id="videoType"
                            aria-label="Select Video Type"
                          >
                            <SelectValue placeholder="Select video type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Video File (.mp4)">
                              Video File (.mp4)
                            </SelectItem>
                            <SelectItem value="Youtube URL">
                              Youtube URL
                            </SelectItem>
                            <SelectItem value="Google Drive Video">
                              Google Drive Video
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {videoType === "Youtube URL" ? (
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>Lecture Video URL</CardTitle>
                      <CardDescription>
                        Copy and paste the URL of your video from Youtube here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 pt-5">
                        <Label htmlFor="videoUrl">Enter Youtube URL</Label>
                        <Input
                          id="videoUrl"
                          onChange={(e) =>
                            setLecture({ ...Lecture, videoUrl: e.target.value })
                          }
                          placeholder="https://www.youtube.com"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : videoType === "Google Drive Video" ? (
                  <Card x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                      <CardTitle>Lecture Video URL</CardTitle>
                      <CardDescription>
                        Copy and paste the URL of your video from Google Drive
                        here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 pt-5">
                        <div className="grid gap-2">
                          {" "}
                          <Label htmlFor="videoUrl">
                            Google Drive Video
                          </Label>{" "}
                          <Input
                            id="videoUrl"
                            onChange={(e) =>
                              setLecture({
                                ...Lecture,
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="https://drive.google.com"
                          />{" "}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <UploadWidget
                    className="p-5"
                    onUpload={handleUploadSuccess}
                  />
                )}
              </div>
              <form
                className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8"
                onSubmit={createLecture}
              >
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>{course}</CardTitle>
                      <CardDescription>
                        Add your Lecture Video here. Click save when youre done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            name="title"
                            type="text"
                            className="w-full"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="duration">Lecture Duration (hour:minutes)</Label>
                          <Input
                            name="duration"
                            type="text"
                            className="w-full"
                            pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
                            placeholder="00:00"
                            title="Enter the duration in Hours:Minutes format. Ex: 01:30 for 1 hour 30 minutes"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="summary">Summary</Label>
                          <Textarea name="summary" className="min-h-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card x-chunk="dashboard-07-chunk-2">
                    <CardHeader>
                      <CardTitle>Lecture Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="items-top flex space-x-2">
                        <Checkbox
                          id="terms1"
                          onCheckedChange={handleCheckboxChange}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Mark as free video
                          </label>
                          <p className="text-sm text-muted-foreground">
                            By default, all videos are paid. Mark this video as
                            free.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-center gap-2 ">
                    <Button variant="outline">Discard</Button>
                    <Button type="submit">Save changes</Button>
                  </div>
                </div>
              </form>

              <div className="md:grid auto-rows-max items-start gap-4 lg:gap-8 hidden">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Video Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Type</Label>
                        <Select onValueChange={handleSelect}>
                          <SelectTrigger
                            id="videoType"
                            aria-label="Select Video Type"
                          >
                            <SelectValue placeholder="Select video type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Video File (.mp4)">
                              Video File (.mp4)
                            </SelectItem>
                            <SelectItem value="Youtube URL">
                              Youtube URL
                            </SelectItem>
                            <SelectItem value="Google Drive Video">
                              Google Drive Video
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {videoType === "Youtube URL" ? (
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>Lecture Video URL</CardTitle>
                      <CardDescription>
                        Copy and paste the URL of your video from Youtube here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 pt-5">
                        <Label htmlFor="videoUrl">Enter Youtube URL</Label>
                        <Input
                          id="videoUrl"
                          onChange={(e) =>
                            setLecture({ ...Lecture, videoUrl: e.target.value })
                          }
                          placeholder="https://www.youtube.com"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : videoType === "Google Drive Video" ? (
                  <Card x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                      <CardTitle>Lecture Video URL</CardTitle>
                      <CardDescription>
                        Copy and paste the URL of your video from Google Drive
                        here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 pt-5">
                        <div className="grid gap-2">
                          {" "}
                          <Label htmlFor="videoUrl">
                            Google Drive Video
                          </Label>{" "}
                          <Input
                            id="videoUrl"
                            onChange={(e) =>
                              setLecture({
                                ...Lecture,
                                videoUrl: e.target.value,
                              })
                            }
                            placeholder="https://drive.google.com"
                          />{" "}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <UploadWidget
                    className="p-5"
                    onUpload={handleUploadSuccess}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </TabsContent>
    </Tabs>
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
