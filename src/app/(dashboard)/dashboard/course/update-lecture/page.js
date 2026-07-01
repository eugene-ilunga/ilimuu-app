"use client";
import { Button } from "@/components/ui/button";
import {
  Car,
  File,
  ListFilter,
  MoreHorizontal,
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

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import UploadWidget from "@/components/uploadFile";

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
    try {
      const res = await fetch("/api/lecture/add-new", {
        method: "POST",
        body: formData,
      });

      setSubmitting(false);

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { id } = await res.json();

      router.refresh;
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
      formdata.set("courseID", courseID);
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
                            lecture.thumbnail
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
                        <Badge variant="outline">{lecture.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        2023-07-12 10:42 AM
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
        <Card>
          <CardHeader>
            <div className="grid grid-cols-6 items-center space-x-2">
              <div className="col-span-5">
                <CardTitle>{course}</CardTitle>
                <CardDescription>
                  Add your Lecture Video here. Click save when youre done.
                </CardDescription>
              </div>

              <div className="col-span-1">
                {Lecture?.thumbnail_url ? (
                  <Image
                    src={Lectures?.thumbnail_url}
                    alt="Lecture"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-span-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="videoType">Video Type</Label>
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
                      <SelectItem value="Youtube URL">Youtube URL</SelectItem>
                      <SelectItem value="Google Drive Video">
                        Google Drive Video
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {videoType === "Youtube URL" ? (
                <div className="grid gap-2">
                  <Label htmlFor="videoUrl">Youtube URL</Label>
                  <Input
                    id="videoUrl"
                    onChange={(e) =>
                      setLecture({ ...Lecture, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com"
                  />
                </div>
              ) : videoType === "Google Drive Video" ? (
                <div className="grid gap-2">
                  {" "}
                  <Label htmlFor="videoUrl">Google Drive Video</Label>{" "}
                  <Input
                    id="videoUrl"
                    onChange={(e) =>
                      setLecture({ ...Lecture, videoUrl: e.target.value })
                    }
                    placeholder="https://drive.google.com"
                  />{" "}
                </div>
              ) : (
                <UploadWidget className="p-5" onUpload={handleUploadSuccess} />
              )}
            </div>
          </CardContent>

          <form onSubmit={createLecture}>
            <CardContent className="space-y-5 ">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input name="title" placeholder="Video title" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input name="duration" placeholder="3:00" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="summary">Summary</Label>
                <Textarea name="summary" required className="min-h-32" />
              </div>

              <div className="items-top flex space-x-2">
                <Checkbox id="terms1" onCheckedChange={handleCheckboxChange} />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as free video
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By default, all videos are paid. Mark this video as free.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="text-white" type="submit">Save changes</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function LectureSuspense()
{
  return (
    <Suspense>
      <Lecture />
    </Suspense>
  );
}

export default LectureSuspense;


