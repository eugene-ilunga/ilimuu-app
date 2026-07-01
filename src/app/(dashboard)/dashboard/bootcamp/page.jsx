"use client";

import { useState, useEffect, useMemo } from "react";
import { useBootcampHooks, useBootcampManagement } from "@/hooks/useBootcampHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import GlobalPagination from "@/components/GlobalPagination";

export default function BootcampManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Memoize the filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    ...filters,
    pagination: 10
  }), [filters]);

  const { bootcamps, loading, totalPages, total, error } = useBootcampHooks(
    currentPage,
    searchQuery,
    memoizedFilters
  );

  const { updateBootcamp, loading: updating } = useBootcampManagement();

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (bootcampId, newStatus) => {
    try {
      const result = await updateBootcamp(bootcampId, { status: newStatus });
      if (result.success) {
        toast.success(`Bootcamp status updated to ${newStatus}`);
        // Trigger a refetch instead of page reload
        window.location.reload(); // Keep this for now to ensure data refresh
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating bootcamp status:", error);
      toast.error("Failed to update bootcamp status");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'bestseller': 'bg-orange-100 text-orange-800',
      'toprated': 'bg-green-100 text-green-800',
      'new': 'bg-blue-100 text-blue-800',
      'trending': 'bg-purple-100 text-purple-800',
      'intensive': 'bg-red-100 text-red-800',
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  const getStats = () => {
    if (!bootcamps.length) return { total: 0, active: 0, pending: 0, revenue: 0 };
    
    const stats = {
      total: bootcamps.length,
      active: bootcamps.filter(b => b.status === 'active').length,
      pending: bootcamps.filter(b => b.status === 'pending').length,
      revenue: bootcamps.reduce((sum, b) => sum + (b.price * (b.enrolled_count || 0)), 0),
    };
    
    return stats;
  };

  const stats = getStats();

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Bootcamps
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bootcamp Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all bootcamp programs
          </p>
        </div>
        <Link href="/dashboard/bootcamp/add-new">
          <Button className="flex items-center gap-2 text-white">
            <Plus className="w-4 h-4" />
            Add New Bootcamp
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bootcamps</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All bootcamp programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bootcamps</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all bootcamps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter Bootcamps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bootcamps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select
              value={filters.bootcampType || "all"}
              onValueChange={(value) => handleFilterChange("bootcampType", value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="weekend">Weekend</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Button className="text-white" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bootcamps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bootcamps ({total})</CardTitle>
          <CardDescription>
            Manage all bootcamp programs and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : bootcamps.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bootcamp</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bootcamps.map((bootcamp) => (
                    <TableRow key={bootcamp._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={bootcamp.thumbnail || "/assets/placeholder.jpg"}
                              alt={bootcamp.title}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-sm line-clamp-1">
                              {bootcamp.title}
                            </div>
                            <div className="flex gap-1 mt-1">
                              <Badge className={getBadgeColor(bootcamp.bootcamp_badge)} size="sm">
                                {bootcamp.bootcamp_badge}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={bootcamp.instructor?.image || "/assets/default-avatar.png"}
                              alt={bootcamp.instructor?.name || "Formateur"}
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm">
                            {bootcamp.instructor?.name || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">
                          {bootcamp.bootcamp_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {bootcamp.duration_weeks} weeks
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(bootcamp.start_date)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{bootcamp.enrolled_count || 0}/{bootcamp.max_students}</div>
                          <div className="text-xs text-gray-500">
                            {bootcamp.enrollment_percentage || 0}% full
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {bootcamp.discount > 0 ? (
                            <>
                              <div className="font-semibold text-green-600">
                                ${(bootcamp.price - (bootcamp.price * bootcamp.discount / 100)).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500 line-through">
                                ${bootcamp.price.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div className="font-semibold">
                              ${bootcamp.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bootcamp.status)}>
                          {bootcamp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/bootcamp/${bootcamp._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/bootcamp/edit/${bootcamp._id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            {/* Status Actions */}
                            {bootcamp.status === 'pending' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(bootcamp._id, 'approved')}
                                >
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(bootcamp._id, 'cancelled')}
                                >
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {bootcamp.status === 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(bootcamp._id, 'active')}
                              >
                                Activate
                              </DropdownMenuItem>
                            )}
                            
                            {bootcamp.status === 'active' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(bootcamp._id, 'completed')}
                              >
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedBootcamp(bootcamp);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <GlobalPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bootcamps found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first bootcamp program.
              </p>
              <Link href="/dashboard/bootcamp/add-new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Bootcamp
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bootcamp</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedBootcamp?.title}&quot;? 
              This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Handle delete logic here
                toast.success("Bootcamp deleted successfully");
                setShowDeleteDialog(false);
                setSelectedBootcamp(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
