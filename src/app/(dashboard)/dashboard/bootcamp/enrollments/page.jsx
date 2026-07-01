"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  Edit,
  Save,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Target,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampEnrollmentsPage() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
    completed: 0,
    dropped: 0,
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.set("pagination", "100");
      
      const res = await fetch("/api/bootcamp", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.status === 200) {
        setBootcamps(data.data);
      } else {
        toast.error("Failed to fetch bootcamps");
      }
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      toast.error("Failed to fetch bootcamps");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async (bootcampId, page = 1, status = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        bootcampId: bootcampId,
        page: page.toString(),
        limit: "10",
      });
      
      if (status) {
        params.append("status", status);
      }

      const res = await fetch(`/api/bootcamp/enrollments?${params}`);
      const data = await res.json();
      
      if (data.status === 200) {
        setEnrollments(data.data || []);
        setCurrentPage(data.pagination?.page || 1);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        toast.error("Failed to fetch enrollments");
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentStats = async (bootcampId) => {
    try {
      const formData = new FormData();
      formData.set("bootcampId", bootcampId);

      const res = await fetch("/api/bootcamp/enrollments", {
        method: "PUT",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.status === 200) {
        setEnrollmentStats(data.data.stats);
      } else {
        toast.error("Failed to fetch enrollment statistics");
      }
    } catch (error) {
      console.error("Error fetching enrollment statistics:", error);
      toast.error("Failed to fetch enrollment statistics");
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedEnrollment || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("enrollmentId", selectedEnrollment._id);
      formData.set("status", newStatus);
      formData.set("notes", statusNotes);

      const res = await fetch("/api/bootcamp/enrollments", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Enrollment status updated successfully");
        setShowStatusDialog(false);
        setSelectedEnrollment(null);
        setNewStatus("");
        setStatusNotes("");
        
        // Refresh enrollments and stats
        if (selectedBootcamp) {
          fetchEnrollments(selectedBootcamp.bootcampId, currentPage, statusFilter);
          fetchEnrollmentStats(selectedBootcamp.bootcampId);
        }
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "En attente", icon: Clock },
      approved: { color: "bg-green-500", text: "Approuvé", icon: CheckCircle },
      rejected: { color: "bg-red-500", text: "Rejeté", icon: XCircle },
      waitlisted: { color: "bg-blue-500", text: "Waitlisted", icon: AlertCircle },
      completed: { color: "bg-purple-500", text: "Terminé", icon: GraduationCap },
      dropped: { color: "bg-gray-500", text: "Dropped", icon: UserX },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Tracking</h1>
            <p className="text-gray-600 mt-1">Manage student applications and track enrollment progress</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bootcamp Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select Bootcamp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedBootcamp?.bootcampId || ""}
                  onValueChange={(value) => {
                    const bootcamp = bootcamps.find(b => b._id === value);
                    if (bootcamp) {
                      setSelectedBootcamp(bootcamp);
                      fetchEnrollments(bootcamp._id);
                      fetchEnrollmentStats(bootcamp._id);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bootcamp" />
                  </SelectTrigger>
                  <SelectContent>
                    {bootcamps.map((bootcamp) => (
                      <SelectItem key={bootcamp._id} value={bootcamp._id}>
                        {bootcamp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBootcamp && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">{selectedBootcamp.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {enrollmentStats.total} total applications
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Management */}
        <div className="lg:col-span-3 space-y-6">
          {selectedBootcamp ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">{enrollmentStats.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-xl font-bold text-gray-900">{enrollmentStats.pending}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-xl font-bold text-gray-900">{enrollmentStats.approved}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Rejected</p>
                        <p className="text-xl font-bold text-gray-900">{enrollmentStats.rejected}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filter Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value);
                        fetchEnrollments(selectedBootcamp.bootcampId, 1, value);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="waitlisted">Waitlisted</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Enrollments Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollments.length > 0 ? (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Application Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Experience Level</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollments.map((enrollment) => (
                            <TableRow key={enrollment._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={enrollment.userId?.image || "/assets/default-avatar.png"}
                                    alt={enrollment.userId?.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{enrollment.userId?.name}</p>
                                    <p className="text-sm text-gray-600">{enrollment.userId?.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(enrollment.application_date)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(enrollment.enrollment_status)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {enrollment.application_data?.experience_level || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${enrollment.progress?.overall_progress || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{enrollment.progress?.overall_progress || 0}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedEnrollment(enrollment);
                                      setNewStatus(enrollment.enrollment_status);
                                      setShowStatusDialog(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/bootcamp/enrollments/${enrollment._id}`}>
                                      <Eye className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => fetchEnrollments(selectedBootcamp.bootcampId, currentPage - 1, statusFilter)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          {[...Array(totalPages)].map((_, i) => (
                            <Button
                              key={i + 1}
                              variant={currentPage === i + 1 ? "default" : "outline"}
                              onClick={() => fetchEnrollments(selectedBootcamp.bootcampId, i + 1, statusFilter)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => fetchEnrollments(selectedBootcamp.bootcampId, currentPage + 1, statusFilter)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Enrollments Found
                      </h3>
                      <p className="text-gray-600">
                        No students have enrolled in this bootcamp yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a Bootcamp
                </h3>
                <p className="text-gray-600">
                  Choose a bootcamp from the list to view and manage its enrollments
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Enrollment Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedEnrollment?.userId?.name}&apos;s application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              <Save className="w-4 h-4 mr-2" />
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
