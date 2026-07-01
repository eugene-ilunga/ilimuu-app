"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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

import {
  CourseTypeAddDialog,
  CourseTypeUpdateDialog,
} from "./operation-dialog";
import Course from "@/app/(frontend)/course/[id]/page";
const Category = () => {
  const [courseTypeData, setcourseTypeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null); // State for selected category
  const [loading, setloading] = useState(true)

  const fetchCourseType = async () => {
    try {
      setloading(true)
      const formdata = new FormData();
      formdata.set("page", currentPage);
      formdata.set("pagination", 5);
      const res = await fetch("/api/course-type/all", {
        cache: "no-store",
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setcourseTypeData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error("Error fetching category data:", error);
    }
  };

  useEffect(() => {
    fetchCourseType();
  }, [currentPage]);

  const handleEditClick = (value) => {
    setSelectedType(value); // Set the selected category
    setIsEditOpen(true); // Open the edit sheet
  };

  const updateCategoryStatus = async (courseType) => {
    const formdata = new FormData();
    formdata.set("id", courseType._id);
    formdata.set(
      "status",
      courseType.status === "active" ? "inactive" : "active"
    );

    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch("/api/course-type/update-status", {
        method: "POST",
        body: formdata,
      });
      if (!res.ok) {
        throw new Error(res.status);
      } else {
        toast.dismiss(toastId); // Dismiss loading toast
        toast.success("Type status updated successfully");
        fetchCourseType();
      }
    } catch (error) {
      console.error("Error updating  status:", error);
      toast.dismiss(toastId); // Dismiss loading toast
    }
  };

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 mt-3 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <CourseTypeAddDialog onTypeAdded={fetchCourseType} />
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Course Type</CardTitle>
                <CardDescription>Manage your course type here.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
               <GlobalSkeletonLoader
                    count={3}
                    width="100%"
                    height="100px"
                    textLineCount={2}
                    textWidths={["80%", "60%"]}
                  />
                ) : (
                courseTypeData.length === 0 ? (
                  <div className="text-center py-10">No data Found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>

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
                      {courseTypeData.map((type) => (
                        <TableRow key={type._id}>
                          <TableCell className="font-medium">
                            {type.name}
                          </TableCell>

                          <TableCell>
                            {type.status === "active" ? (
                              <Badge className="capitalize" variant="outline">
                                {type.status}
                              </Badge>
                            ) : (
                              <Badge className="capitalize" variant="secondary">
                                {type.status}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(type.createdAt).toLocaleDateString()}
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
                                  onSelect={() => handleEditClick(type)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => updateCategoryStatus(type)}
                                >
                                  {type.status === "active"
                                    ? "Inacive"
                                    : "Actif"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
                )}
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
                  <strong>{(currentPage - 1) * 5 + 5}</strong> Categories
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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {isEditOpen && (
          <CourseTypeUpdateDialog
            onTypeupdate={fetchCourseType}
            isEditOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            courseType={selectedType} // Pass the selected category data
          />
        )}
      </main>
    </div>
  );
};

export default Category;
