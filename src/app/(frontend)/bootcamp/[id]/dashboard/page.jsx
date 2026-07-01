"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Play,
  BookOpen,
  Target,
  Award,
  GraduationCap,
  ArrowLeft,
  Download,
  MessageCircle,
  Video,
  FileText,
  Code,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampStudentDashboard({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootcampId = params?.id || searchParams.get("id");
  
  const [bootcamp, setBootcamp] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    if (bootcampId) {
      fetchBootcampData();
    }
  }, [bootcampId]);

  const fetchBootcampData = async () => {
    try {
      setLoading(true);
      
      // Fetch bootcamp details
      const bootcampFormData = new FormData();
      bootcampFormData.set("bootcampId", bootcampId);
      
      const bootcampRes = await fetch("/api/bootcamp/details", {
        method: "POST",
        body: bootcampFormData,
      });
      
      const bootcampData = await bootcampRes.json();
      
      if (bootcampData.status === 200) {
        setBootcamp(bootcampData.data);
      }

      // Fetch enrollment status
      const enrollmentRes = await fetch(`/api/bootcamp/enroll?bootcampId=${bootcampId}`);
      const enrollmentData = await enrollmentRes.json();
      
      if (enrollmentData.status === 200 && enrollmentData.is_enrolled) {
        setEnrollment(enrollmentData.data);
      }
      
    } catch (error) {
      console.error("Error fetching bootcamp data:", error);
      toast.error("Failed to load bootcamp data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Application Pending" },
      approved: { color: "bg-green-500", text: "Approuvé" },
      rejected: { color: "bg-red-500", text: "Rejeté" },
      waitlisted: { color: "bg-blue-500", text: "Waitlisted" },
      completed: { color: "bg-purple-500", text: "Terminé" },
      dropped: { color: "bg-gray-500", text: "Dropped" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = () => {
    if (!enrollment || !bootcamp) return 0;
    return Math.round((enrollment.progress || 0));
  };

  const getPhaseProgress = (phaseNumber) => {
    if (!enrollment?.phasesProgress) return 0;
    const phase = enrollment.phasesProgress.find(p => p.phase_number === phaseNumber);
    return phase?.completion_percentage || 0;
  };

  const isBootcampStarted = () => {
    if (!bootcamp) return false;
    return new Date() >= new Date(bootcamp.start_date);
  };

  const isBootcampCompleted = () => {
    if (!bootcamp) return false;
    return new Date() > new Date(bootcamp.end_date);
  };

  const getDaysRemaining = () => {
    if (!bootcamp) return 0;
    const endDate = new Date(bootcamp.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bootcamp Not Found</h1>
        <p className="text-gray-600 mb-6">The bootcamp you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/bootcamp">Browse Bootcamps</Link>
        </Button>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Enrolled</h1>
        <p className="text-gray-600 mb-6">You are not enrolled in this bootcamp.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href={`/bootcamp/${bootcampId}/enroll`}>Enroll Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bootcamp">Browse Other Bootcamps</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/bootcamp">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bootcamps
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bootcamp.title}</h1>
            <p className="text-gray-600 mt-1">Student Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(enrollment.applicationStatus)}
          {enrollment.certificateUrl && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{calculateProgress()}%</p>
              </div>
            </div>
            <Progress value={calculateProgress()} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Days Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{getDaysRemaining()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Phase</p>
                <p className="text-2xl font-bold text-gray-900">
                  Phase {enrollment.progress?.current_phase || 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bootcamp Info */}
            <Card>
              <CardHeader>
                <CardTitle>Bootcamp Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={bootcamp.thumbnail}
                    alt={bootcamp.title}
                    width={80}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{bootcamp.title}</h3>
                    <p className="text-sm text-gray-600">{bootcamp.short_description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Start Date:</strong> {formatDate(bootcamp.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>End Date:</strong> {formatDate(bootcamp.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Duration:</strong> {bootcamp.duration_weeks} weeks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Students:</strong> {bootcamp.enrolled_students?.length || 0}/{bootcamp.max_students}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Image
                    src={bootcamp.instructor?.image || "/assets/default-avatar.png"}
                    alt={bootcamp.instructor?.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{bootcamp.instructor?.name}</h3>
                    <p className="text-sm text-gray-600">{bootcamp.instructor?.profession}</p>
                    <p className="text-sm text-gray-500 mt-1">{bootcamp.instructor?.about}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Application Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Applied:</strong> {formatDate(enrollment.applicationDate)}</p>
                    <p><strong>Status:</strong> {enrollment.applicationStatus}</p>
                    <p><strong>Experience Level:</strong> {enrollment.applicationData?.experience_level}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Goals & Availability</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Goals:</strong> {enrollment.applicationData?.goals}</p>
                    <p><strong>Availability:</strong> {enrollment.applicationData?.availability}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bootcamp Phases</CardTitle>
              <p className="text-gray-600">
                Track your progress through each phase of the bootcamp
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bootcamp.phases?.map((phase, index) => (
                  <div key={phase.phase_number} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Phase {phase.phase_number}: {phase.title}
                        </h3>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                      <Badge variant={index <= currentPhase ? "default" : "secondary"}>
                        {index < currentPhase ? "Terminé" : 
                         index === currentPhase ? "Current" : "Upcoming"}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{getPhaseProgress(phase.phase_number)}%</span>
                      </div>
                      <Progress value={getPhaseProgress(phase.phase_number)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Learning Objectives</h4>
                        <ul className="text-sm space-y-1">
                          {phase.learning_objectives?.map((objective, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Duration</h4>
                        <p className="text-sm">{phase.duration_weeks} weeks</p>
                      </div>
                    </div>

                    {phase.projects?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Projects</h4>
                        <div className="space-y-2">
                          {phase.projects.map((project, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-sm text-gray-600">{project.description}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Schedule Coming Soon
                </h3>
                <p className="text-gray-600">
                  Detailed class schedules will be available here once the bootcamp starts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects & Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Projects Coming Soon
                </h3>
                <p className="text-gray-600">
                  Project assignments and submissions will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Career Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Job Placement Assistance</h4>
                      <p className="text-sm text-gray-600">Get help finding your dream job</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium">Resume Review</h4>
                      <p className="text-sm text-gray-600">Professional resume feedback</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Interview Prep</h4>
                      <p className="text-sm text-gray-600">Mock interviews and tips</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Access Career Support
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Student Community</h4>
                      <p className="text-sm text-gray-600">Connect with fellow students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-medium">Study Groups</h4>
                      <p className="text-sm text-gray-600">Join study groups and discussions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Technical Support</h4>
                      <p className="text-sm text-gray-600">Get help with technical issues</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
