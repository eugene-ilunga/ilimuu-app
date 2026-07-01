"use client";

import { useState, useEffect, useMemo } from "react";
import { useBootcampHooks, useBootcampManagement } from "@/hooks/useBootcampHooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreHorizontal,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Settings,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPhaseDialog, setShowPhaseDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  const { deleteBootcamp } = useBootcampManagement();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleDeleteBootcamp = async (bootcampId) => {
    try {
      await deleteBootcamp(bootcampId);
      toast.success("Bootcamp deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete bootcamp");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", text: "Brouillon" },
      pending: { color: "bg-yellow-500", text: "En attente" },
      approved: { color: "bg-green-500", text: "Approuvé" },
      active: { color: "bg-blue-500", text: "Actif" },
      completed: { color: "bg-purple-500", text: "Terminé" },
      cancelled: { color: "bg-red-500", text: "Annulé" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateEnrollmentPercentage = (enrolled, max) => {
    return Math.round((enrolled / max) * 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bootcamp Management</h1>
          <p className="text-gray-600 mt-2">
            Manage bootcamps, phases, schedules, and enrollments
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/bootcamp/add-new">
              <Plus className="w-4 h-4 mr-2" />
              Add New Bootcamp
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/bootcamp/analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bootcamps</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bootcamps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bootcamps.filter(b => b.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bootcamps.filter(b => b.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bootcamps.filter(b => b.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search bootcamps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
          </div>
        </CardContent>
      </Card>

      {/* Bootcamp Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phases">Phases & Curriculum</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Support</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Bootcamp Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bootcamps.map((bootcamp) => (
              <Card key={bootcamp._id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={bootcamp.thumbnail}
                    alt={bootcamp.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(bootcamp.status)}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {bootcamp.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {bootcamp.short_description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(bootcamp.start_date)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {bootcamp.duration_weeks} weeks
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {bootcamp.enrolled_students?.length || 0}/{bootcamp.max_students}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${bootcamp.price}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${calculateEnrollmentPercentage(
                          bootcamp.enrolled_students?.length || 0,
                          bootcamp.max_students
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/bootcamp/${bootcamp._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/bootcamp/edit/${bootcamp._id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBootcamp(bootcamp);
                            setShowPhaseDialog(true);
                          }}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Manage Phases
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBootcamp(bootcamp);
                            setShowScheduleDialog(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBootcamp(bootcamp);
                            setShowEnrollmentDialog(true);
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Enrollments
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBootcamp(bootcamp);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phase & Curriculum Management</CardTitle>
              <p className="text-gray-600">
                Set up and manage bootcamp phases, curriculum, and learning objectives
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Phase Management Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  This feature will allow you to create and manage bootcamp phases,
                  set learning objectives, and organize curriculum content.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Phase
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Career Support</CardTitle>
              <p className="text-gray-600">
                Configure bootcamp schedule, delivery method, and career support services
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Schedule Configuration Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  This feature will allow you to set up class schedules,
                  delivery methods, and career support services.
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment & Application Tracking</CardTitle>
              <p className="text-gray-600">
                Track enrollments, applications, and student progress
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Enrollment Tracking Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  This feature will allow you to track student applications,
                  manage enrollments, and monitor progress.
                </p>
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Enrollments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bootcamp</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedBootcamp?.title}&quot;? This action cannot be undone.
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
              onClick={() => handleDeleteBootcamp(selectedBootcamp?._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
