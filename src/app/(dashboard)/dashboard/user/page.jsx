"use client";

import { use, useState } from "react";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  MoreHorizontal,
  Check,
  Ban,
  UserX,
  RefreshCw,
  Filter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUserHooks } from "@/hooks/useUserHooks";
import toast from "react-hot-toast";
import UserDetailsModal from "./user-details-modal";
import Link from "next/link";
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";
import { useRouter } from "next/navigation";

export default function UserManagementDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userType, setUserType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [reloadFlag, setReloadFlag] = useState(0);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [seletedStatus, setseletedStatus] = useState("");
  const router = useRouter();


  // Get user data from your custom hook
  const { userData, totalPages, loading } = useUserHooks(
    currentPage,
    userType,
    searchQuery,
    reloadFlag,
    seletedStatus
  );

  const handleStatusChange = async () => {
    if (!selectedUser || !newStatus) return;

    const toastId = toast.loading("Updating user status...");

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/user/${selectedUser._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Show success toast

      toast.success("User status updated successfully", {
        id: toastId,
      });

      // Close dialog and refresh data
      setIsStatusDialogOpen(false);
      setReloadFlag((prev) => prev + 1); // Triggers useEffect again
    } catch (error) {
      console.error("Error updating user status:", error);

      // Show error toast
      toast.error("Failed to update user status", {
        id: toastId,
      });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "blocked":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  const handleViewUserDetails = (user) => {
    setSelectedUserForDetails(user._id);
    setIsUserDetailsModalOpen(true);
  };
  const handleViewUserProfile = (user) => {
    router.push(`/mentor?id=${user._id}`);
  };

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 mt-3 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="" onValueChange={setUserType}>
          <div className="flex items-center flex-wrap gap-2">
            <TabsList>
              <TabsTrigger value="">All Users</TabsTrigger>
              <TabsTrigger value="instructor">Mentors</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="user">Regular Users</TabsTrigger>
            </TabsList>

            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setseletedStatus("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setseletedStatus("inactive")}
                  >
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setseletedStatus("blocked")}>
                    Blocked
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setseletedStatus("")}>
                    Clear Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-1.5 border rounded-md focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Link href="/dashboard/user/add-new">
                <Button size="sm" className="h-8 gap-1 text-white">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add User
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <TabsContent value={userType} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system. Change user status or
                  perform other actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                     (
                                   // Show loading skeletons
                                   <GlobalSkeletonLoader
                                     count={5}
                                     width="100%"
                                     height="50px"
                                     textLineCount={2}
                                     textWidths={["80%", "60%"]}
                                   />
                                 )
                ) : userData.length === 0 ? (
                  <div className="text-center py-10">No users found</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[80px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="hidden sm:table-cell">
                            {user.image ? (
                              <Image
                                alt={`${user.name}'s profile picture`}
                                className="aspect-square rounded-md object-cover"
                                height="48"
                                src={user.image || "/placeholder.svg"}
                                width="48"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                                <span className="text-xl font-medium">
                                  {user.name?.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(user.status)}
                              className="capitalize"
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(user.createdAt)}
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
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setNewStatus(user.status);
                                    setIsStatusDialogOpen(true);
                                  }}
                                >
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleViewUserDetails(user)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewUserProfile(user)}>
                                  Profile
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
                    {userData.length ? (currentPage - 1) * 10 + 1 : 0}
                  </strong>{" "}
                  to <strong>{(currentPage - 1) * 10 + userData.length}</strong>{" "}
                  of <strong>{totalPages * 10}</strong> users
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

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Status</DialogTitle>
            <DialogDescription>
              Update the status for user {selectedUser?.name}. This will affect
              their ability to access the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Current Status</h4>
              <Badge
                variant={getStatusBadgeVariant(selectedUser?.status)}
                className="capitalize"
              >
                {selectedUser?.status || "Unknown"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">New Status</h4>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center">
                      <Ban className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Inactive</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blocked">
                    <div className="flex items-center">
                      <UserX className="mr-2 h-4 w-4 text-red-500" />
                      <span>Blocked</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserForDetails}
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
      />
    </div>
  );
}
