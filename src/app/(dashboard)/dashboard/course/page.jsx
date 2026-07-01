"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";

const Course = () => {
  const [courseData, setCourseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [selectedFilter, setSelectedFilter] = useState("");
  const filters = ["all", "bestseller", "new", "toprated", "trending"];
  const [selectStatus, setSelectStatus] = useState("all");
  const [pendingCourses, setPendingCourses] = useState(0);
  const [loading, setloading] = useState(false);

  const handleTabChange = (value) => {
    setSelectStatus(value);
  };
  const fetchCourses = async () => {
    setloading(true);
    try {
      const formdata = new FormData();
      formdata.set("page", currentPage);
      formdata.set("pagination", 5);
      formdata.set("search", searchQuery); // Pass search query to API
      formdata.set(
        "courseBadge",
        selectedFilter === "all" ? "" : selectedFilter
      );
      formdata.set("status", selectStatus === "all" ? "" : selectStatus);

      const res = await fetch("/api/course", {
        cache: "no-store",
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setCourseData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
      setloading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };
  const pendingCoursesCount = async () => {
    try {
      const res = await fetch("/api/course", {
        method: "GET",
      });
      const data = await res.json();
      setPendingCourses(data.data);
    } catch (error) {
      console.error("Error fetching pending courses count:", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchCourses();
    pendingCoursesCount();
  }, [currentPage, searchQuery, selectedFilter, selectStatus]); // Fetch courses whenever currentPage, searchQuery, or selectedFilter changes

  const createQueryString = (name, value) => {
    const params = new URLSearchParams();
    params.set(name, JSON.stringify(value));
    return params.toString();
  };

  const updateCourseStatus = async (id, status) => {
    const toastId = toast.loading("Updating course status...");
    try {
      const formdata = new FormData();
      formdata.set("id", id);
      formdata.set("status", status);
      const res = await fetch("/api/course/update-status", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      if (data.status === 200) {
        toast.success("Course status updated successfully", {
          id: toastId,
        });
        fetchCourses();
        pendingCoursesCount();
      }
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  const handleSelect = (action, id, course, session) => {
    switch (action) {
      case "view":
        router.push(`/course/details?id=${id}`); // Replace '/view-page' with the actual view page route
        break;

      case "add-lecture":
        // localStorage.setItem('data', id);

        router.push(`/dashboard/course/add-lecture?course=${course}&&id=${id}&&session=${session} `); // Replace '/dashboard/add-lecture' with the actual add lecture route
        break;
      case "edit":
        router.push(
          "/dashboard/course/update-course" +
            "?" +
            createQueryString("key", course)
        ); // Replace '/edit-page' with the actual edit page route
        break;
      case "delete":
        // Add your delete logic here
        break;
      case "pending":
        updateCourseStatus(id, "pending");
        break;
      case "reject":
        updateCourseStatus(id, "reject");
        break;
      case "inactive":
        updateCourseStatus(id, "inactive");
        break;
      case "active":
        updateCourseStatus(id, "active");
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 mt-3 sm:px-6 sm:py-0 md:gap-8">
        <Tabs
          defaultValue="all"
          value={selectStatus}
          onValueChange={handleTabChange}
        >
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive" className="hidden sm:flex">
                In Active
              </TabsTrigger>
              <TabsTrigger value="reject" className="hidden sm:flex">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="pending" className="hidden sm:flex relative">
                <span>Pending</span>
                {pendingCourses > 0 && (
                  <span className="absolute -top-1 -right-2 rounded-full bg-red-500 text-white text-xs px-1.5 h-5 min-w-[20px] flex items-center justify-center">
                    {pendingCourses}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses"
                  className="pl-10 pr-4 py-1.5 border rounded-md focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {filters.map((filter) => (
                    <DropdownMenuCheckboxItem
                      className="capitalize"
                      key={filter}
                      checked={selectedFilter === filter}
                      onCheckedChange={() => setSelectedFilter(filter)}
                    >
                      {filter}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/dashboard/course/add-new">
                <Button size="sm" className="h-8 gap-1 text-white">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Course
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <TabsContent value={selectStatus}>
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Course</CardTitle>
                <CardDescription>
                  Manage your course and view their course.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  // Show loading skeletons
                  <GlobalSkeletonLoader
                    count={5}
                    width="100%"
                    height="150px"
                    textLineCount={2}
                    textWidths={["80%", "60%"]}
                  />
                ) : courseData.length === 0 ? (
                  <div className="text-center py-10">No data Found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Instructor</TableHead>

                        <TableHead className="hidden md:table-cell">
                          Level
                        </TableHead>

                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Discount%
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
                      {courseData.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="100"
                              src={course.thumbnail}
                              width="100"
                            />
                          </TableCell>

                          <TableCell className="font-medium hover:text-orange-400 hover:underline">
                            <Link href={`/dashboard/course/add-lecture?course=${course.title}&&id=${course._id}&&session=${ course.session_type} `}>

                              {course.title}
                            </Link>
                          </TableCell>
                          <TableCell className="font-medium">
                            {course.instructor?.name}
                          </TableCell>

                          <TableCell className="capitalize font-medium">
                            {course.level}
                          </TableCell>
                          <TableCell>${course.price}</TableCell>
                          <TableCell className="font-medium">
                            {course.discount ?? 0}%
                          </TableCell>
                          <TableCell>
                            {course.status === "reject" ? (
                              <Badge
                                variant="destructive"
                                className="capitalize"
                              >
                                {course.status}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="capitalize">
                                {course.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(course.createdAt).toLocaleDateString()}
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
                              <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() =>
                                    handleSelect("view", course._id, course)
                                  }
                                >
                                  View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onSelect={() =>
                                    handleSelect("edit", course._id, course)
                                  }
                                >
                                  Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                  onSelect={() => handleSelect("delete")}
                                >
                                  Delete
                                </DropdownMenuItem> */}

                                <DropdownMenuLabel>
                                  Lecture session{" "}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() =>
                                    handleSelect(
                                      "add-lecture",
                                      course._id,
                                      course.title,
                                      course.session_type
                                    )
                                  }
                                >
                                  Add Lecture
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onSelect={() =>
                                    handleSelect(
                                      "add-lecture",
                                      course._id,
                                      course.title,
                                      course.session_type
                                    )
                                  }
                                >
                                  View Lecture
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                      Course Status
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                      <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleSelect(
                                              "pending",
                                              course._id,
                                              course
                                            )
                                          }
                                        >
                                          Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleSelect(
                                              "reject",
                                              course._id,
                                              course
                                            )
                                          }
                                        >
                                          Reject
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleSelect(
                                              "inactive",
                                              course._id,
                                              course
                                            )
                                          }
                                        >
                                          Inactive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleSelect(
                                              "active",
                                              course._id,
                                              course
                                            )
                                          }
                                        >
                                          Active
                                        </DropdownMenuItem>
                                      </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                  </DropdownMenuSub>
                                </DropdownMenuGroup>
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
                    {courseData.length ? (currentPage - 1) * 5 + 1 : 0}
                  </strong>{" "}
                  to <strong>{(currentPage - 1) * 5 + courseData.length}</strong>{" "}
                  of <strong>{totalPages * 5}</strong> courses
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
        </Tabs>
      </main>
    </div>
  );
};

export default Course;
