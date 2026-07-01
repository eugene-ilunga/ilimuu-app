"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBootcampDetails } from "@/hooks/useBootcampHooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Award,
  CheckCircle,
  Star,
  ArrowLeft,
  Play,
  Download,
  Share2,
  Heart,
  BookOpen,
  Target,
  Briefcase,
  GraduationCap,
  Video,
  FileText,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  User,
  MessageCircle,
  Bell,
  HelpCircle,
  ExternalLink,
  BarChart3,
  ThumbsUp,
  Eye,
  Code,
  Layers,
  Lightbulb,
  Rocket,
  Building,
  DollarSign,
  Timer,
  Bookmark,
  AlertCircle,
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
    
    // If not YouTube, return original URL for direct video files
    return url;
  } catch (error) {
    // If URL parsing fails, assume it's a direct video file URL
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

export default function BootcampDetailsPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootcampId = params?.id || searchParams.get("id");
  const bootcampName = searchParams.get("name");

  const { bootcamp, loading, error } = useBootcampDetails(bootcampId);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState(new Set());

  useEffect(() => {
    if (bootcamp) {
      // Check if user is enrolled
      // This would typically come from an API call
      setIsEnrolled(false);
    }
  }, [bootcamp]);

  const handleEnroll = () => {
    if (!bootcamp) return;
    
    // Check if bootcamp is completed
    if (bootcamp.status === 'completed') {
      toast.error("This bootcamp has already been completed and is no longer accepting new enrollments.");
      return;
    }
    
    if (isEnrolled) {
      router.push(`/bootcamp/${bootcamp._id}/learn`);
    } else {
      router.push(`/bootcamp/${bootcamp._id}/enroll`);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bootcamp?.title,
        text: bootcamp?.short_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const togglePhase = (phaseIndex) => {
    const newExpandedPhases = new Set(expandedPhases);
    if (newExpandedPhases.has(phaseIndex)) {
      newExpandedPhases.delete(phaseIndex);
    } else {
      newExpandedPhases.add(phaseIndex);
    }
    setExpandedPhases(newExpandedPhases);
  };

  const expandAllPhases = () => {
    const allPhaseIndices = new Set(bootcamp.phases?.map((_, index) => index) || []);
    setExpandedPhases(allPhaseIndices);
  };

  const collapseAllPhases = () => {
    setExpandedPhases(new Set());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bootcamp Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The bootcamp you&apos;re looking for doesn&apos;t exist or has been removed.
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

  // Calculate enrollment progress
  const enrollmentProgress = bootcamp.enrolled_students?.length || 0;
  const enrollmentPercentage = Math.round((enrollmentProgress / bootcamp.max_students) * 100);
  
  // Calculate days until application deadline
  const daysUntilDeadline = Math.ceil((new Date(bootcamp.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
  
  // Calculate days until start
  const daysUntilStart = Math.ceil((new Date(bootcamp.start_date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-50 to-blue-50 text-gray-900 relative overflow-hidden border-b border-gray-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="container mx-auto px-4 py-12 relative">
        

          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className={`${getBadgeColor(bootcamp.bootcamp_badge)} border-0 text-xs px-2 py-1`}>
                  {bootcamp.bootcamp_badge?.toUpperCase()}
                </Badge>
                <Badge className={`${getStatusColor(bootcamp.status)} border-0 text-xs px-2 py-1`}>
                  {bootcamp.status?.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 text-xs px-2 py-1">
                  Cohort #{bootcamp.cohort_number || 1}
                </Badge>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {bootcamp.level?.toUpperCase()} • {bootcamp.language}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{bootcamp.title}</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">{bootcamp.short_description}</p>
              
              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {bootcamp.category && (
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 text-xs">
                    {bootcamp.category.categoryName}
                  </Badge>
                )}
                {bootcamp.subCategory && (
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 text-xs">
                    {bootcamp.subCategory}
                  </Badge>
                )}
                {bootcamp.bootcamp_tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                className={`bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 ${isFavorite ? "text-red-500" : ""}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShare}
                className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {/* Duration */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 p-2 mb-2">
                <Clock className="w-6 h-6 text-white" />
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{bootcamp.duration_weeks}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Weeks</div>
            </div>
            {/* Max Students */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-green-400 to-green-600 p-2 mb-2">
                <Users className="w-6 h-6 text-white" />
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{bootcamp.max_students}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Max Students</div>
            </div>
            {/* Days per Week */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 p-2 mb-2">
                <Calendar className="w-6 h-6 text-white" />
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{bootcamp.schedule?.days_per_week || 0}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Days/Week</div>
            </div>
            {/* Format */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-400 to-purple-600 p-2 mb-2">
                <Globe className="w-6 h-6 text-white" />
              </span>
              <div className="text-lg font-extrabold text-gray-900 capitalize">{bootcamp.bootcamp_type}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Format</div>
            </div>
            {/* Enrolled */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-pink-600 p-2 mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{enrollmentProgress}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Enrolled</div>
            </div>
            {/* Days Left */}
            <div className="bg-white shadow-sm rounded-xl p-4 text-center flex flex-col items-center transition hover:scale-105 hover:shadow-md">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-red-400 to-red-600 p-2 mb-2">
                <Timer className="w-6 h-6 text-white" />
              </span>
              <div className="text-2xl font-extrabold text-gray-900">{daysUntilDeadline > 0 ? daysUntilDeadline : 0}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">Days Left</div>
            </div>
          </div>

          {/* Enrollment Progress Bar */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                <span className="text-base font-semibold text-gray-900 tracking-tight">
                  Enrollment Progress
                </span>
              </div>
              <span className="inline-flex items-center text-xs md:text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                <span className="font-bold text-gray-900">{enrollmentProgress}</span>
                <span className="mx-1 text-gray-500">/</span>
                <span className="font-semibold text-gray-600">{bootcamp.max_students}</span>
                <span className="ml-2 text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full font-mono text-[0.85em]">
                  {enrollmentPercentage}%
                </span>
              </span>
            </div>
            <div className="relative w-full">
              <div
                className="h-3 md:h-4 bg-gradient-to-r from-pink-200 to-blue-200 rounded-full overflow-hidden relative shadow-sm"
                style={{ boxShadow: "0 1px 3px 0 rgba(236,72,153,0.1)" }}
              >
                <div
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-3 md:h-4 transition-all duration-700"
                  style={{
                    width: `${Math.min(Math.max(enrollmentPercentage, 0), 100)}%`,
                  }}
                />
                {/* Progress dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 z-10"
                  style={{
                    left: `calc(${Math.min(Math.max(enrollmentPercentage, 0), 100)}% - 0.9rem)`,
                    transition: "left 0.7s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-white border-2 border-pink-500 shadow-lg rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium tracking-wide">
              <span className="opacity-80">0%</span>
              <span className="opacity-80">100%</span>
            </div>
            {enrollmentPercentage >= 100 && (
              <div className="mt-3 text-center text-sm text-green-700 bg-green-100/80 rounded-lg py-2 font-semibold border border-green-300 shadow-sm animate-pulse">
                Enrollment Full! Join the waitlist or check back soon.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Video */}
            <Card className="overflow-hidden shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100">
                  {bootcamp.overview_video ? (
                    isYouTubeUrl(bootcamp.overview_video) ? (
                      <iframe
                        src={getVideoEmbedUrl(bootcamp.overview_video)}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Bootcamp Overview Video"
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-full"
                        poster={bootcamp.thumbnail}
                        preload="metadata"
                      >
                        <source src={bootcamp.overview_video} type="video/mp4" />
                        <source src={bootcamp.overview_video} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Overview video coming soon</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-pink-500" />
                  About This Bootcamp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {showFullDescription ? bootcamp.description : `${bootcamp.description?.substring(0, 300)}...`}
                  </p>
                  {bootcamp.description?.length > 300 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "Show Less" : "Lire la suite"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Curriculum Phases */}
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Layers className="w-5 h-5 text-blue-500" />
                      Curriculum & Phases
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {bootcamp.phases?.length || 0} phases • {bootcamp.duration_weeks} weeks • {bootcamp.schedule?.hours_per_day || 0} hours/day
                    </CardDescription>
                  </div>
                  {bootcamp.phases?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={expandAllPhases}
                        className="text-xs"
                      >
                        <ArrowLeft className="w-3 h-3 mr-1 rotate-90" />
                        <span className="hidden sm:inline">Expand All</span>
                        <span className="sm:hidden">All</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={collapseAllPhases}
                        className="text-xs"
                      >
                        <ArrowLeft className="w-3 h-3 mr-1 -rotate-90" />
                        <span className="hidden sm:inline">Collapse All</span>
                        <span className="sm:hidden">Close</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {bootcamp.phases?.length > 0 ? (
                  <div className="space-y-4">
                    {/* Phase Progress Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 to-blue-300"></div>
                      {bootcamp.phases.map((phase, index) => {
                        const isExpanded = expandedPhases.has(index);
                        return (
                          <div key={index} className="relative flex items-start gap-4 md:gap-6 pb-6">
                            <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-lg shadow-sm">
                              {phase.phase_number}
                            </div>
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                              {/* Phase Header - Always Visible */}
                              <div className="p-4 md:p-6 pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1">{phase.title}</h4>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                        {phase.duration_weeks} weeks
                                      </span>
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                        Phase {phase.phase_number}
                                      </Badge>
                                      {phase.learning_objectives?.length > 0 && (
                                        <span className="flex items-center gap-1 text-green-600">
                                          <Target className="w-3 h-3 md:w-4 md:h-4" />
                                          {phase.learning_objectives.length} objectives
                                        </span>
                                      )}
                                      {phase.projects?.length > 0 && (
                                        <span className="flex items-center gap-1 text-purple-600">
                                          <Rocket className="w-3 h-3 md:w-4 md:h-4" />
                                          {phase.projects.length} projects
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => togglePhase(index)}
                                    className="self-start sm:self-center hover:bg-gray-100"
                                  >
                                    {isExpanded ? (
                                      <ArrowLeft className="w-4 h-4 rotate-90" />
                                    ) : (
                                      <ArrowLeft className="w-4 h-4 -rotate-90" />
                                    )}
                                  </Button>
                                </div>
                                
                                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{phase.description}</p>
                              </div>

                              {/* Expandable Content */}
                              {isExpanded && (
                                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 pt-4">
                                  {phase.learning_objectives?.length > 0 && (
                                    <div className="mb-4 md:mb-6">
                                      <h5 className="font-semibold mb-3 md:mb-4 flex items-center gap-2 text-gray-900">
                                        <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                        Learning Objectives
                                      </h5>
                                      <div className="grid grid-cols-1 gap-2 md:gap-3">
                                        {phase.learning_objectives.map((objective, idx) => (
                                          <div key={idx} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-xs md:text-sm text-gray-700">{objective}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {phase.projects?.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold mb-3 md:mb-4 flex items-center gap-2 text-gray-900">
                                        <Rocket className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                        Hands-on Projects ({phase.projects.length})
                                      </h5>
                                      <div className="grid gap-3 md:gap-4">
                                        {phase.projects.map((project, idx) => (
                                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3 md:gap-4">
                                              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Code className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                                              </div>
                                              <div className="flex-1">
                                                <h6 className="font-semibold text-sm md:text-base text-gray-900">{project.title}</h6>
                                                <p className="text-xs md:text-sm text-gray-600 mt-1">{project.description}</p>
                                                {project.due_date && (
                                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Due: {formatDate(project.due_date)}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 self-start sm:self-center">
                                              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                              <span className="text-xs md:text-sm">View Details</span>
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Curriculum Coming Soon</h3>
                    <p className="text-gray-500">Detailed curriculum phases will be available soon.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule & Timing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Schedule Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{bootcamp.schedule?.days_per_week || 0} days per week</div>
                          <div className="text-sm text-gray-600">Class frequency</div>
                        </div>

                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">{bootcamp.schedule?.hours_per_day || 0} hours per day</div>
                          <div className="text-sm text-gray-600">Daily commitment</div>
                        </div>

                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Max {bootcamp.max_students} students</div>
                          <div className="text-sm text-gray-600">Class size limit</div>
                        </div>

                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <Globe className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium capitalize">{bootcamp.bootcamp_type}</div>
                          <div className="text-sm text-gray-600">Delivery method</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {bootcamp.schedule?.class_times?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Class Times</h4>
                      <div className="space-y-2">
                        {bootcamp.schedule.class_times.map((time, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="font-medium capitalize">{time.day}</div>
                                <div className="text-sm text-gray-600">
                                  {formatTime(time.start_time)} - {formatTime(time.end_time)}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">Live Session</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bootcamp.schedule?.break_times?.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-lg mb-4">Break Times</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bootcamp.schedule.break_times.map((breakTime, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-medium">
                                {formatTime(breakTime.start_time)} - {formatTime(breakTime.end_time)}
                              </div>
                              <div className="text-sm text-gray-600">{breakTime.description || "Break Time"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Tools & Technologies */}
            {bootcamp.tools_and_technologies?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Tools & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {bootcamp.tools_and_technologies.map((tool, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Support Services */}
            {bootcamp.career_support && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Career Support & Job Placement
                  </CardTitle>
                  <CardDescription>
                    Comprehensive career support to accelerate your professional growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bootcamp.career_support.job_placement_assistance && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Job Placement Assistance</h4>
                          <p className="text-sm text-gray-600 mb-2">Direct connections to hiring partners</p>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                            Guaranteed Support
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.resume_review && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Resume Review</h4>
                          <p className="text-sm text-gray-600 mb-2">Professional resume optimization</p>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            Expert Feedback
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.interview_preparation && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Interview Preparation</h4>
                          <p className="text-sm text-gray-600 mb-2">Mock interviews & coaching</p>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 text-xs">
                            Practice Sessions
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.portfolio_building && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Portfolio Building</h4>
                          <p className="text-sm text-gray-600 mb-2">Create impressive portfolios</p>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs">
                            Showcase Work
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.networking_events && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Networking Events</h4>
                          <p className="text-sm text-gray-600 mb-2">Connect with industry leaders</p>
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs">
                            Industry Access
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.mentorship_program && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Mentorship Program</h4>
                          <p className="text-sm text-gray-600 mb-2">One-on-one career guidance</p>
                          <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300 text-xs">
                            Personal Mentor
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.career_counseling && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Career Counseling</h4>
                          <p className="text-sm text-gray-600 mb-2">Personalized career strategy</p>
                          <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-300 text-xs">
                            Strategic Planning
                          </Badge>
                        </div>
                      </div>
                    )}
                    {bootcamp.career_support.industry_connections && (
                      <div className="group flex items-start gap-4 p-5 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl border border-cyan-200 hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Building className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Industry Connections</h4>
                          <p className="text-sm text-gray-600 mb-2">Access to industry networks</p>
                          <Badge variant="outline" className="bg-cyan-100 text-cyan-700 border-cyan-300 text-xs">
                            Network Access
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Career Support Summary */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Career Success Rate</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Our comprehensive career support program has helped 95% of graduates secure positions within 6 months of completion.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bootcamp Includes */}
            {bootcamp.bootcamp_includes?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    What&apos;s Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bootcamp.bootcamp_includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Enhanced Enrollment Card */}
            <Card className="sticky top-4 md:top-6 shadow-xl border-2 border-blue-200 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
                <div className="absolute inset-0 opacity-50" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <CardTitle className="flex items-center gap-2 relative z-10">
                  <Rocket className="w-5 h-5" />
                  Enroll Now
                </CardTitle>
                <CardDescription className="text-blue-100 relative z-10">
                  Join {enrollmentProgress} other students • Cohort #{bootcamp.cohort_number || 1}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                {/* Pricing Section */}
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    ${bootcamp.discount > 0 
                      ? (bootcamp.price - (bootcamp.price * bootcamp.discount / 100)).toFixed(2)
                      : bootcamp.price.toFixed(2)
                    }
                  </div>
                  {bootcamp.discount > 0 && (
                    <div className="text-base md:text-lg text-gray-500 line-through mb-2">
                      ${bootcamp.price.toFixed(2)}
                    </div>
                  )}
                  {bootcamp.discount > 0 && (
                    <Badge className="bg-green-100 text-green-800 mb-3 px-2 md:px-3 py-1 text-xs md:text-sm">
                      {bootcamp.discount}% OFF - Limited Time!
                    </Badge>
                  )}
                  <div className="text-xs md:text-sm text-gray-600 mb-4">
                    {bootcamp.duration_weeks} weeks • {bootcamp.bootcamp_type} • {bootcamp.schedule?.hours_per_day || 0}h/day
                  </div>
                  
                  {/* Enrollment Progress */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs md:text-sm mb-2">
                      <span className="text-gray-600">Enrollment Progress</span>
                      <span className="font-semibold text-gray-900">{enrollmentProgress}/{bootcamp.max_students}</span>
                    </div>
                    <Progress value={enrollmentPercentage} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {bootcamp.max_students - enrollmentProgress} spots remaining
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Important Dates */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-gray-900">Starts: {formatDate(bootcamp.start_date)}</div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {daysUntilStart > 0 ? `${daysUntilStart} days from now` : 'Started'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-gray-900">Ends: {formatDate(bootcamp.end_date)}</div>
                      <div className="text-xs md:text-sm text-gray-600">Program completion</div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border ${
                    daysUntilDeadline <= 7 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' 
                      : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
                  }`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                      daysUntilDeadline <= 7 ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      <Timer className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-gray-900">Deadline: {formatDate(bootcamp.application_deadline)}</div>
                      <div className="text-xs md:text-sm text-gray-600">
                        {daysUntilDeadline > 0 
                          ? `${daysUntilDeadline} days left${daysUntilDeadline <= 7 ? ' - Hurry!' : ''}` 
                          : 'Deadline passed'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Button */}
                <Button 
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 md:py-3 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  disabled={daysUntilDeadline <= 0 || bootcamp.status === 'completed'}
                >
                  {isEnrolled ? "Continue Learning" : "Enroll Now"}
                </Button>

                {daysUntilDeadline <= 0 && (
                  <div className="text-center text-xs md:text-sm text-red-600 bg-red-50 p-2 md:p-3 rounded-lg border border-red-200">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                    Application deadline has passed
                  </div>
                )}

                {bootcamp.status === 'completed' && (
                  <div className="text-center text-xs md:text-sm text-orange-600 bg-orange-50 p-2 md:p-3 rounded-lg border border-orange-200">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                    This bootcamp has been completed
                  </div>
                )}

                {/* Guarantees */}
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                    <span>Lifetime access to materials</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                    <Award className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                    <span>Career support included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Instructor */}
            {bootcamp.instructor && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Lead Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100">
                      <Image
                        src={bootcamp.instructor.image || "/assets/default-avatar.png"}
                        alt={bootcamp.instructor.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-900">{bootcamp.instructor.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{bootcamp.instructor.profession}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">4.8</span>
                        <span className="text-xs text-gray-500">(120 reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                          Expert Instructor
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          5+ Years Experience
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {bootcamp.instructor.about && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                        {bootcamp.instructor.about}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">500+</div>
                      <div className="text-xs text-gray-600">Students Taught</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">95%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Instructor
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Co-Instructors */}
            {bootcamp.co_instructors?.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Co-Instructors & Mentors
                  </CardTitle>
                  <CardDescription>
                    Additional expert instructors supporting your learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bootcamp.co_instructors.map((instructor, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100">
                          <Image
                            src={instructor.image || "/assets/default-avatar.png"}
                            alt={instructor.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm text-gray-900">{instructor.name}</h5>
                          <p className="text-xs text-gray-600">{instructor.profession}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium">4.7</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Get instant access to bootcamp resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Questions
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-200">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:border-red-200">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Category & Tags */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Category & Tags
                </CardTitle>
                <CardDescription>
                  Bootcamp classification and topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bootcamp.category && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Category</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                      {bootcamp.category.categoryName}
                    </Badge>
                  </div>
                )}
                {bootcamp.subCategory && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Sub Category</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                      {bootcamp.subCategory}
                    </Badge>
                  </div>
                )}
                {bootcamp.bootcamp_tags?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Topics Covered</h4>
                    <div className="flex flex-wrap gap-1">
                      {bootcamp.bootcamp_tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {bootcamp.tools_and_technologies?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Tools & Technologies</h4>
                    <div className="flex flex-wrap gap-1">
                      {bootcamp.tools_and_technologies.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

