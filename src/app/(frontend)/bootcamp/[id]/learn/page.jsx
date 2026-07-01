"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBootcampDetails } from "@/hooks/useBootcampHooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Play,
  BookOpen,
  Target,
  ArrowLeft,
  Award,
  GraduationCap,
  Video,
  FileText,
  Download,
  MessageCircle,
  Briefcase,
  User,
  Star,
  Globe,
  BarChart3,
  Shield,
  Zap,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

// Helper function to check if URL is YouTube and convert to embed format
const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    let videoId = null;
    
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  } catch (error) {
    return url;
  }
};

// Helper function to check if URL is YouTube
const isYouTubeUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes("youtube.com") || urlObj.hostname === "youtu.be";
  } catch {
    return false;
  }
};

export default function BootcampLearningPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootcampId = params?.id || searchParams.get("id");

  const { bootcamp, loading, error } = useBootcampDetails(bootcampId);
  const [activeTab, setActiveTab] = useState("overview");
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  
  // Exam state
  const [examQuestions, setExamQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [examLoading, setExamLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (bootcampId) {
      fetchEnrollmentData();
      checkExamStatus();
    }
  }, [bootcampId]);

  const fetchEnrollmentData = async () => {
    if (!bootcampId) return;
    try {
      setEnrollmentLoading(true);
      const response = await fetch(`/api/bootcamp/enroll?bootcampId=${bootcampId}`);
      const data = await response.json();
      if (data.status === 200 && data.data) {
        setEnrollmentData(data.data);
      } else {
        setEnrollmentData(null);
      }
    } catch (error) {
      console.error("Error fetching enrollment data:", error);
      setEnrollmentData(null);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const checkExamStatus = async () => {
    if (!bootcampId) return;
    try {
      const response = await fetch(`/api/bootcamp/exam/results?bootcampId=${bootcampId}`);
      const data = await response.json();
      if (data.status === 200 && data.data && data.data.length > 0) {
        setExamResult(data.data[0]);
        setExamSubmitted(true);
      }
    } catch (error) {
      console.error("Error checking exam status:", error);
    }
  };

  const fetchExamQuestions = async () => {
    if (!bootcampId || examLoading) return;
    
    setExamLoading(true);
    try {
      const response = await fetch(`/api/bootcamp/exam/take?bootcampId=${bootcampId}`);
      const data = await response.json();
      if (data.status === 200) {
        setExamQuestions(data.data || []);
      } else {
        toast.error(data.message || "Failed to load exam questions");
      }
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      toast.error("Failed to load exam questions");
    } finally {
      setExamLoading(false);
    }
  };

  const startExam = () => {
    setExamStarted(true);
    setStartTime(new Date());
    fetchExamQuestions();
  };

  const handleAnswerChange = (questionId, optionIndex) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const submitExam = async () => {
    if (!examAnswers || Object.keys(examAnswers).length === 0) {
      toast.error("Please answer at least one question");
      return;
    }

    const answers = examQuestions.map((q) => ({
      question: q._id,
      selectedOption: examAnswers[q._id] ?? -1,
    }));

    try {
      const response = await fetch("/api/bootcamp/exam/take", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bootcampId,
          answers,
          startedAt: startTime,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Exam submitted successfully!");
        setExamSubmitted(true);
        setExamResult(data.data.result);
        checkExamStatus();
      } else {
        toast.error(data.message || "Failed to submit exam");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return time;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "En attente" },
      approved: { color: "bg-green-100 text-green-800", text: "Approuvé" },
      accepted: { color: "bg-green-100 text-green-800", text: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejeté" },
      waitlisted: { color: "bg-blue-100 text-blue-800", text: "Waitlisted" },
      completed: { color: "bg-purple-100 text-purple-800", text: "Terminé" },
      dropped: { color: "bg-gray-100 text-gray-800", text: "Dropped" },
      applied: { color: "bg-yellow-100 text-yellow-800", text: "Applied" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.text}
      </Badge>
    );
  };

  const getPhaseProgress = (phaseNumber) => {
    if (!enrollmentData?.progress?.phases_progress) return 0;
    const phaseProgress = enrollmentData.progress.phases_progress.find(
      p => p.phase_number === phaseNumber
    );
    return phaseProgress?.completion_percentage || 0;
  };

  const isPhaseCompleted = (phaseNumber) => {
    if (!enrollmentData?.progress?.phases_progress) return false;
    const phaseProgress = enrollmentData.progress.phases_progress.find(
      p => p.phase_number === phaseNumber
    );
    return !!phaseProgress?.completed_date;
  };

  if (loading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bootcamp Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The bootcamp you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/bootcamp")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bootcamps
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is enrolled
  const isEnrolled = enrollmentData && (enrollmentData.enrollment_status === "approved" || enrollmentData.enrollment_status === "accepted");
  const overallProgress = enrollmentData?.progress?.overall_progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{bootcamp.title}</h1>
              <p className="text-gray-600 mt-1">Learning Dashboard</p>
            </div>
            {enrollmentData && (
              <div className="flex items-center gap-3">
                {getStatusBadge(enrollmentData.enrollment_status)}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {enrollmentData && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!isEnrolled ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Not Enrolled
              </h2>
              <p className="text-gray-600 mb-6">
                You need to be enrolled in this bootcamp to access the learning materials.
              </p>
              <Button asChild>
                <Link href={`/bootcamp/${bootcampId}`}>
                  View Bootcamp Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phases">Phases & Curriculum</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="career">Career Support</TabsTrigger>
              <TabsTrigger value="exam">Exam</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bootcamp Overview Video */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Bootcamp Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {bootcamp.overview_video ? (
                          isYouTubeUrl(bootcamp.overview_video) ? (
                            <iframe
                              src={getVideoEmbedUrl(bootcamp.overview_video)}
                              className="w-full h-full rounded-lg"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Bootcamp Overview Video"
                            />
                          ) : (
                            <video
                              controls
                              className="w-full h-full rounded-lg"
                              poster={bootcamp.thumbnail}
                              preload="metadata"
                            >
                              <source src={bootcamp.overview_video} type="video/mp4" />
                              <source src={bootcamp.overview_video} type="video/webm" />
                              Your browser does not support the video tag.
                            </video>
                          )
                        ) : (
                          <div className="text-center text-gray-500">
                            <Video className="w-12 h-12 mx-auto mb-2" />
                            <p>Overview video coming soon</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bootcamp Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Bootcamp</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {bootcamp.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {bootcamp.short_description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Learning Outcomes */}
                  {bootcamp.outcomes && bootcamp.outcomes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          What You&apos;ll Learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {bootcamp.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Requirements */}
                  {bootcamp.requirements && bootcamp.requirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Prerequisites
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {bootcamp.requirements.map((requirement, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-gray-700">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Progress Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Progress Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {overallProgress}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Overall Progress
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Current Phase</span>
                          <span>Phase {enrollmentData?.progress?.current_phase || 1}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Phases Completed</span>
                          <span>
                            {enrollmentData?.progress?.phases_progress?.filter(p => p.completed_date).length || 0} / {bootcamp.phases?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Attendance</span>
                          <span>{enrollmentData?.progress?.attendance?.attendance_percentage || 0}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bootcamp Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Bootcamp Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Start: {formatDate(bootcamp.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>End: {formatDate(bootcamp.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{bootcamp.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{bootcamp.max_students} max students</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="capitalize">{bootcamp.bootcamp_type || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-gray-500" />
                        <span className="capitalize">{bootcamp.level || "N/A"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instructor */}
                  {bootcamp.instructor && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Instructor
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            {bootcamp.instructor.image && (
                              <Image
                                src={bootcamp.instructor.image}
                                alt={bootcamp.instructor.name || "Formateur"}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{bootcamp.instructor.name || "Formateur"}</h4>
                            <p className="text-xs text-gray-600">{bootcamp.instructor.profession || "Bootcamp Instructor"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Phases & Curriculum Tab */}
            <TabsContent value="phases" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Bootcamp Phases
                      </CardTitle>
                      <CardDescription>
                        Complete all phases to finish the bootcamp
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {bootcamp.phases && bootcamp.phases.length > 0 ? (
                          bootcamp.phases.map((phase, index) => {
                            const phaseProgress = getPhaseProgress(phase.phase_number);
                            const isCompleted = isPhaseCompleted(phase.phase_number);
                            
                            return (
                              <div key={index} className="border rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                      {phase.phase_number}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg">{phase.title}</h3>
                                      {phase.duration_weeks && (
                                        <p className="text-sm text-gray-600">{phase.duration_weeks} weeks</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isCompleted ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Completed
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">
                                        {phaseProgress}% Complete
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                {phase.description && (
                                  <p className="text-gray-700 mb-4">{phase.description}</p>
                                )}
                                
                                {phase.learning_objectives && phase.learning_objectives.length > 0 && (
                                  <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Learning Objectives</h4>
                                    <ul className="space-y-2">
                                      {phase.learning_objectives.map((objective, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <Target className="w-4 h-4 text-blue-600" />
                                          <span className="text-sm">{objective}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                <div className="mt-4">
                                  <Progress value={phaseProgress} className="h-2" />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No phases available for this bootcamp.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  {/* Phase Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Phase Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {bootcamp.phases && bootcamp.phases.length > 0 ? (
                        bootcamp.phases.map((phase, index) => {
                          const phaseProgress = getPhaseProgress(phase.phase_number);
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Phase {phase.phase_number}</span>
                                <span>{phaseProgress}%</span>
                              </div>
                              <Progress value={phaseProgress} className="h-2" />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500">No phases available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Class Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bootcamp.schedule?.class_times && bootcamp.schedule.class_times.length > 0 ? (
                      <div className="space-y-4">
                        {bootcamp.schedule.class_times.map((classTime, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <div>
                                <h4 className="font-medium capitalize">{classTime.day || "N/A"}</h4>
                                <p className="text-sm text-gray-600">
                                  {formatTime(classTime.start_time)} - {formatTime(classTime.end_time)}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">Live Session</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No schedule available for this bootcamp.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Schedule Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Days per Week</span>
                        <span className="text-sm font-medium">{bootcamp.schedule?.days_per_week || bootcamp.days_per_week || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Hours per Day</span>
                        <span className="text-sm font-medium">{bootcamp.schedule?.hours_per_day || bootcamp.hours_per_day || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bootcamp Type</span>
                        <span className="text-sm font-medium capitalize">{bootcamp.bootcamp_type || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Bootcamp Projects
                  </CardTitle>
                  <CardDescription>
                    Complete projects to demonstrate your skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bootcamp.phases && bootcamp.phases.length > 0 ? (
                    <div className="space-y-6">
                      {bootcamp.phases.map((phase, phaseIndex) => {
                        if (!phase.projects || phase.projects.length === 0) return null;
                        
                        return (
                          <div key={phaseIndex} className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-4">Phase {phase.phase_number}: {phase.title}</h3>
                            <div className="grid gap-4">
                              {phase.projects.map((project, projectIndex) => {
                                const isCompleted = enrollmentData?.progress?.phases_progress?.[phaseIndex]?.projects_completed?.some(
                                  p => p.project_title === project.title
                                );
                                
                                return (
                                  <div key={projectIndex} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium">{project.title}</h4>
                                        {isCompleted && (
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                      </div>
                                      {project.description && (
                                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                      )}
                                      {project.due_date && (
                                        <p className="text-xs text-gray-500 mt-2">
                                          Due: {formatDate(project.due_date)}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No projects available for this bootcamp.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Career Support Tab */}
            <TabsContent value="career" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Career Support Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bootcamp.career_support ? (
                      <div className="space-y-4">
                        {bootcamp.career_support.job_placement_assistance && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">Job Placement Assistance</h4>
                              <p className="text-sm text-gray-600">Help finding job opportunities</p>
                            </div>
                          </div>
                        )}
                        {bootcamp.career_support.resume_review && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">Resume Review</h4>
                              <p className="text-sm text-gray-600">Professional resume feedback</p>
                            </div>
                          </div>
                        )}
                        {bootcamp.career_support.interview_preparation && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">Interview Preparation</h4>
                              <p className="text-sm text-gray-600">Mock interviews and tips</p>
                            </div>
                          </div>
                        )}
                        {bootcamp.career_support.portfolio_building && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <h4 className="font-medium">Portfolio Building</h4>
                              <p className="text-sm text-gray-600">Create impressive portfolios</p>
                            </div>
                          </div>
                        )}
                        {(!bootcamp.career_support.job_placement_assistance && 
                          !bootcamp.career_support.resume_review && 
                          !bootcamp.career_support.interview_preparation && 
                          !bootcamp.career_support.portfolio_building) && (
                          <div className="text-center py-8 text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No career support services available.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No career support information available.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Bootcamp Includes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bootcamp.bootcamp_includes && bootcamp.bootcamp_includes.length > 0 ? (
                      bootcamp.bootcamp_includes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No information available</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Exam Tab */}
            <TabsContent value="exam" className="space-y-6">
              {!examStarted && !examSubmitted && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Ready to take the exam?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Click the button below to start the MCQ exam for this bootcamp.
                    </p>
                    <Button onClick={startExam}>
                      Start Exam
                    </Button>
                  </CardContent>
                </Card>
              )}

              {examStarted && !examSubmitted && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">MCQ Exam</h2>
                    <Button onClick={submitExam}>
                      Submit Exam
                    </Button>
                  </div>

                  {examLoading ? (
                    <div className="text-center py-8">Loading questions...</div>
                  ) : examQuestions.length > 0 ? (
                    <div className="space-y-6">
                      {examQuestions.map((question, qIndex) => (
                        <Card key={question._id}>
                          <CardHeader>
                            <CardTitle className="text-base">
                              Question {qIndex + 1} ({question.points || 1} point{question.points > 1 ? 's' : ''})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 font-medium">{question.question}</p>
                            <RadioGroup
                              value={examAnswers[question._id]?.toString()}
                              onValueChange={(value) =>
                                handleAnswerChange(question._id, parseInt(value))
                              }
                            >
                              {question.options && question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center space-x-2 py-2">
                                  <RadioGroupItem
                                    value={oIndex.toString()}
                                    id={`${question._id}-${oIndex}`}
                                  />
                                  <Label
                                    htmlFor={`${question._id}-${oIndex}`}
                                    className="flex-1 cursor-pointer"
                                  >
                                    {String.fromCharCode(65 + oIndex)}. {option.text || option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-gray-500">
                        No exam questions available for this bootcamp.
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {examSubmitted && examResult && (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Exam Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Score</p>
                          <p className="text-2xl font-bold">
                            {examResult.obtainedPoints || 0}/{examResult.totalPoints || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Percentage</p>
                          <p className="text-2xl font-bold">
                            {examResult.percentage ? examResult.percentage.toFixed(1) : 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Correct Answers</p>
                          <p className="text-2xl font-bold">
                            {examResult.correctAnswers || 0}/{examResult.totalQuestions || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time Spent</p>
                          <p className="text-lg font-semibold">
                            {examResult.timeSpent ? (
                              <>
                                {Math.floor(examResult.timeSpent / 60)}m {examResult.timeSpent % 60}s
                              </>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {examResult.answers && examResult.answers.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Review Your Answers</h4>
                      {examResult.answers.map((answer, index) => {
                        const questionId = answer.question?._id || answer.question;
                        const question = answer.question?.question 
                          ? answer.question 
                          : examQuestions.find(
                              (q) => q._id === questionId || q._id?.toString() === questionId?.toString()
                            );
                        if (!question) return null;

                        const questionText = question.question || "";
                        const questionOptions = question.options || [];
                        const questionPoints = question.points || 1;

                        return (
                          <Card
                            key={questionId || index}
                            className={
                              answer.isCorrect
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }
                          >
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                Question {index + 1}
                                {answer.isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="mb-2 font-medium">{questionText}</p>
                              <div className="space-y-1">
                                {questionOptions.map((option, oIndex) => {
                                  const isSelected = answer.selectedOption === oIndex;
                                  const isCorrect = option.isCorrect || (typeof option === 'object' && option.isCorrect);
                                  return (
                                    <div
                                      key={oIndex}
                                      className={`p-2 rounded ${
                                        isCorrect
                                          ? "bg-green-100 border border-green-300"
                                          : isSelected
                                          ? "bg-red-100 border border-red-300"
                                          : "bg-gray-50"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + oIndex)}. {typeof option === 'object' ? option.text : option}
                                      {isCorrect && " ✓ Correct"}
                                      {isSelected && !isCorrect && " ✗ Your Answer"}
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Points: {answer.points || 0}/{questionPoints}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
