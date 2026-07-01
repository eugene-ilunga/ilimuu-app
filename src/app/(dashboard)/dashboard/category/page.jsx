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
import AddCategory from "./add-form";
import EditCategory from "./edit-form";
import { useCategoryData, useUpdateCategoryStatus } from "@/hooks/useCategoryHooks";
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";


const Category = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  const { categoryData, totalPages, fetchCategories,loading } = useCategoryData(currentPage);

  const { updateCategoryStatus } = useUpdateCategoryStatus(fetchCategories);

  const handleEditClick = (category) => {
    setSelectedCategory(category); // Set the selected category
    setIsEditOpen(true); // Open the edit sheet
  };


  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 mt-3 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
          
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
            
              
              <AddCategory onCategoryAdded={fetchCategories} />
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>All Category</CardTitle>
                <CardDescription>
                  Manage your category and view their course.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {loading ? (
               <GlobalSkeletonLoader
                    count={5}
                    width="100%"
                    height="80px"
                    textLineCount={2}
                    textWidths={["80%", "60%"]}
                  />
                ) :
                  
                (categoryData?.length === 0 ? (
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
                          Description
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
                      {categoryData.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={category.image ? category.image : "/assets/placeholder.jpg"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {category.categoryName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {category.description}
                          </TableCell>
                          <TableCell>
                            <Badge className="capitalize" variant="outline">{category.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(category.createdAt).toLocaleDateString()}
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
                                  onSelect={() => handleEditClick(category)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() =>
                                    updateCategoryStatus(category)
                                  }
                                >
                                  {category.status === "active"
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
                ))}

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
          <TabsContent value="inactive">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Inacitve Category</CardTitle>
                <CardDescription>
                  Manage your category and view their course.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData?.filter((category) => category.status === "inactive").length === 0 ? (
                  <div className="text-center py-10">No data Found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Created at</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryData
                        .filter((category) => category.status === "inactive")
                        .map((category) => (
                          <TableRow key={category._id}>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={category.image}
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {category.categoryName}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {category.description}
                            </TableCell>
                            <TableCell>
                              <Badge className="capitalize" variant="outline">
                                {category.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(category.createdAt).toLocaleDateString()}
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
                                    onSelect={() => handleEditClick(category)}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => updateCategoryStatus(category)}
                                  >
                                    {category.status === "active"
                                      ? "Inactif"
                                      : "Actif"}
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
          <EditCategory
            onCategoryAdded={fetchCategories}
            isEditOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            categoryData={selectedCategory} // Pass the selected category data
          />
        )}
      </main>
    </div>
  );
};

export default Category;
