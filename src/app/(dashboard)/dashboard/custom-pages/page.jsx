"use client";
import React, { useEffect, useState } from "react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
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
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";
import { useToast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

const CustomPages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, [currentPage]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/custom-pages/list?page=${currentPage}&limit=10`, {
        method: "GET",
      });
      const data = await res.json();

      if (data.status === 200) {
        setPages(data.data);
        setTotalPages(data.totalPages);
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Failed to fetch pages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Erreur",
        description: "Failed to fetch pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/custom-pages/delete?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.status === 200) {
          Swal.fire("Deleted!", "Page has been deleted.", "success");
          fetchPages();
        } else {
          toast({
            title: "Erreur",
            description: data.message || "Failed to delete page",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting page:", error);
        toast({
          title: "Erreur",
          description: "Failed to delete page",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 mt-3 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All Pages</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/dashboard/custom-pages/create">
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Page
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Custom Pages</CardTitle>
                <CardDescription>
                  Manage your custom pages that appear in the footer.
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
                ) : pages?.length === 0 ? (
                  <div className="text-center py-10">No pages found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Show in Footer
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
                      {pages.map((page) => (
                        <TableRow key={page._id}>
                          <TableCell className="font-medium">
                            {page.title}
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {page.slug}
                            </code>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={page.showInFooter ? "default" : "secondary"}>
                              {page.showInFooter ? "Oui" : "Non"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="capitalize"
                              variant={page.isActive ? "default" : "outline"}
                            >
                              {page.isActive ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(page.createdAt).toLocaleDateString()}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/custom-pages/edit?id=${page._id}`}>
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/page/${page.slug}`} target="_blank">
                                    View Page
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => handleDelete(page._id)}
                                  className="text-red-600"
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
                  Showing <strong>{(currentPage - 1) * 10 + 1}</strong> to{" "}
                  <strong>
                    {Math.min(currentPage * 10, pages.length + (currentPage - 1) * 10)}
                  </strong>{" "}
                  pages
                </div>
                {totalPages > 1 && (
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
                            isActive={currentPage === page + 1}
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
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Active Pages Tab */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Pages</CardTitle>
                <CardDescription>
                  Pages that are currently visible to users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <GlobalSkeletonLoader count={5} width="100%" height="80px" />
                ) : pages?.filter((p) => p.isActive).length === 0 ? (
                  <div className="text-center py-10">No active pages found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Show in Footer</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages
                        .filter((p) => p.isActive)
                        .map((page) => (
                          <TableRow key={page._id}>
                            <TableCell className="font-medium">
                              {page.title}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {page.slug}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge variant={page.showInFooter ? "default" : "secondary"}>
                                {page.showInFooter ? "Oui" : "Non"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(page.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/custom-pages/edit?id=${page._id}`}>
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/page/${page.slug}`} target="_blank">
                                      View Page
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => handleDelete(page._id)}
                                    className="text-red-600"
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
            </Card>
          </TabsContent>

          {/* Inactive Pages Tab */}
          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Pages</CardTitle>
                <CardDescription>
                  Pages that are currently hidden from users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <GlobalSkeletonLoader count={5} width="100%" height="80px" />
                ) : pages?.filter((p) => !p.isActive).length === 0 ? (
                  <div className="text-center py-10">No inactive pages found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Show in Footer</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages
                        .filter((p) => !p.isActive)
                        .map((page) => (
                          <TableRow key={page._id}>
                            <TableCell className="font-medium">
                              {page.title}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {page.slug}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge variant={page.showInFooter ? "default" : "secondary"}>
                                {page.showInFooter ? "Oui" : "Non"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(page.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/custom-pages/edit?id=${page._id}`}>
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => handleDelete(page._id)}
                                    className="text-red-600"
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
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CustomPages;

