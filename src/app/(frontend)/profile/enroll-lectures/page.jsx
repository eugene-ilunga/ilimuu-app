"use client"

import  React, { Suspense } from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  FileText,
  Video,
  FileVideo,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation";



 function CourseLecturePlayerComponent() {
  const router = useRouter()
  const [currentLecture, setCurrentLecture] = useState([])
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true)
  const [showAutoPlayOverlay, setShowAutoPlayOverlay] = useState(false)
  const [autoPlayCountdown, setAutoPlayCountdown] = useState(5)
  const [isMobile, setIsMobile] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState(null)
  const [lectureData, setlectures] = useState([]);
  const [courseInfo, setCourseInfo] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("video"); // "video" or "pdf"
  const [isLoading, setIsLoading] = useState(true);
  

    const searchParams = useSearchParams();
    const courseID = searchParams.get("id");

  const videoRef = useRef(null)
  const videoContainerRef = useRef(null)
  const progressBarRef = useRef(null)

  // Check if on mobile device
  useEffect(() => {

       const getLecture = async () => {
      setIsLoading(true);
      try {
        const formdata = new FormData();
        formdata.set("courseid", courseID);
        formdata.set("pagination", 15);
        formdata.set("page", 1);

        const res = await fetch("/api/lecture", {
          method: "POST",
          body: formdata,
        });
        const data = await res.json();
        console.log(data);
        setlectures(data);
        if (data.data && data.data.length > 0) {
          setCurrentLecture(data.data[0]);
          setCurrentLectureIndex(0);
          setProgress(data.data[0].progress || 0);
          setDuration(data.data[0].duration);
          setVolume(data.data[0].volume || 1);
          setIsMuted(data.data[0].isMuted || false);
          setAutoPlayEnabled(data.data[0].autoPlayEnabled || true);
          setCurrentTime(data.data[0].currentTime || 0);
        }
        setCourseInfo(data.course);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getLecture();

    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }

 

  }, [])

  // Function to handle lecture selection
  const handleSelectLecture = (lecture, index) => {
    setCurrentLecture(lecture)
    setCurrentLectureIndex(index)
    setProgress(lecture.progress || 0)
    setIsPlaying(false)
    setCurrentTime(0)
    setShowAutoPlayOverlay(false)
    
    // Set default view mode based on content type
    if (lecture.contentType === "pdf") {
      setViewMode("pdf")
    } else if (lecture.contentType === "both") {
      setViewMode("video") // Default to video for "both"
    } else {
      setViewMode("video")
    }
    
    // Auto play video if available
    if (lecture.contentType !== "pdf" && lecture.videoUrl) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }, 500)
    }
  }

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Update progress as the video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(Math.round(currentProgress))
      setCurrentTime(videoRef.current.currentTime)

      // Hide controls after 3 seconds of inactivity
      resetControlsTimeout()
    }
  }

  // Handle video metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Handle seeking
  const handleSeek = (e) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen()
        setIsFullScreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullScreen(false)
      }
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Handle video ended - autoplay next lecture
  const handleVideoEnded = () => {
    setIsPlaying(false)

    if (autoPlayEnabled && currentLectureIndex < (lectureData?.data?.length || 0) - 1) {
      setShowAutoPlayOverlay(true)

      // Start countdown
      let countdown = 5
      setAutoPlayCountdown(countdown)

      const countdownInterval = setInterval(() => {
        countdown -= 1
        setAutoPlayCountdown(countdown)

        if (countdown <= 0) {
          clearInterval(countdownInterval)
          setShowAutoPlayOverlay(false)
          handleSelectLecture(lectureData?.data?.[currentLectureIndex + 1], currentLectureIndex + 1)

          // Auto play the next video
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play()
              setIsPlaying(true)
            }
          }, 500)
        }
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }

  // Handle playback rate change
  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  // Skip forward/backward
  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  // Skip to next lecture
  const skipToNextLecture = () => {
    if (currentLectureIndex < (lectureData?.data?.length || 0) - 1) {
      handleSelectLecture(lectureData?.data?.[currentLectureIndex + 1], currentLectureIndex + 1)

      // Auto play the next video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play()
          setIsPlaying(true)
        }
      }, 500)
    }
  }

  // Handle buffering
  const handleWaiting = () => {
    setIsBuffering(true)
  }

  const handlePlaying = () => {
    setIsBuffering(false)
  }

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setIsControlsVisible(true)
    resetControlsTimeout()
  }

  const resetControlsTimeout = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }

    const timeout = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false)
      }
    }, 3000)

    setControlsTimeout(timeout)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [controlsTimeout])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === "INPUT") return

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault()
          togglePlayPause()
          break
        case "f":
          e.preventDefault()
          toggleFullScreen()
          break
        case "m":
          e.preventDefault()
          toggleMute()
          break
        case "arrowright":
          e.preventDefault()
          skipTime(10)
          break
        case "arrowleft":
          e.preventDefault()
          skipTime(-10)
          break
        case "n":
          e.preventDefault()
          skipToNextLecture()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, isMuted, currentLectureIndex])

  // Format the video URL for embedding
  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("v=") ? url.split("v=")[1].split("&")[0] : url.split("/").pop()
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0`
    }
    return url
  }

  // Format PDF URL to prevent download and force inline display
  const getPdfDisplayUrl = (url) => {
    if (!url) return ""
    
    // Use Mozilla PDF.js viewer with download disabled
    // This prevents users from downloading the PDF
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}#toolbar=0`
  }

  // Determine if the video is YouTube or direct
  const isYouTubeVideo = currentLecture.videoUrl?.includes("youtube.com") || currentLecture.videoUrl?.includes("youtu.be")
  
  // Check if lecture has PDF
  const hasPDF = currentLecture?.pdfUrl && (currentLecture?.contentType === "pdf" || currentLecture?.contentType === "both")
  
  // Check if lecture has video
  const hasVideo = currentLecture?.videoUrl && (currentLecture?.contentType === "video" || currentLecture?.contentType === "both")

  // Filter lectures based on search query
  const filteredLectures = lectureData?.data?.filter((lecture) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      lecture.title?.toLowerCase().includes(query) ||
      lecture.contentType?.toLowerCase().includes(query) ||
      lecture.status?.toLowerCase().includes(query)
    )
  }) || []

  // Get lecture type icon and label
  const getLectureTypeInfo = (contentType) => {
    switch (contentType?.toLowerCase()) {
      case "video":
        return { icon: Video, label: "Video", color: "text-blue-600 dark:text-blue-400" }
      case "pdf":
        return { icon: FileText, label: "PDF", color: "text-red-600 dark:text-red-400" }
      case "both":
        return { icon: FileVideo, label: "Video & PDF", color: "text-purple-600 dark:text-purple-400" }
      default:
        return { icon: Video, label: "Video", color: "text-slate-600 dark:text-slate-400" }
    }
  }

  // Loading Skeleton Component
  const VideoPlayerSkeleton = () => (
    <div className="w-full lg:w-2/3 bg-gradient-to-br from-slate-900 via-black to-slate-900 relative shadow-2xl">
      <div className="relative h-full flex flex-col">
        <div className="relative flex-1 flex items-center justify-center bg-black/50">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
              <Skeleton className="h-6 w-48 mx-auto mb-2 bg-white/10" />
              <Skeleton className="h-4 w-32 mx-auto bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const LectureListSkeleton = () => (
    <div className="w-full lg:w-1/3 border-l border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
      <div className="h-full flex flex-col">
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm px-4 lg:px-6 py-4">
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 flex-1 rounded-lg" />
          </div>
        </div>
        <div className="p-4 lg:p-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg mb-4" />
        </div>
        <div className="p-4 lg:p-6 space-y-3 flex-1 overflow-auto">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-2 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4 lg:p-5">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="container flex items-center h-16 px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()} 
            className="mr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {courseInfo?.title}
                </h1>
                <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 truncate">
                  Instructor: {courseInfo?.instructor?.name}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      {isLoading ? (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <VideoPlayerSkeleton />
          <LectureListSkeleton />
        </div>
      ) : (
      <div className={cn("flex flex-col lg:flex-row flex-1 overflow-hidden", isFullScreen && "fixed inset-0 z-50 bg-black")}>
        {/* Video/PDF player section */}
        <div
          className={cn("w-full lg:w-2/3 bg-gradient-to-br from-slate-900 via-black to-slate-900 relative shadow-2xl", isFullScreen && "w-full h-full")}
          ref={videoContainerRef}
          onMouseMove={handleMouseMove}
        >
          <div className="relative h-full flex flex-col">
            {/* Content Type Switcher - Show when both video and PDF are available */}
            {hasVideo && hasPDF && (
              <div className="absolute top-4 left-4 z-30 flex gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-1 border border-white/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setViewMode("video")
                    if (videoRef.current && !isPlaying) {
                      setTimeout(() => {
                        videoRef.current?.play()
                        setIsPlaying(true)
                      }, 100)
                    }
                  }}
                  className={cn(
                    "text-white hover:bg-white/20 rounded-md px-4 py-2 transition-all",
                    viewMode === "video" && "bg-primary text-white"
                  )}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setViewMode("pdf")
                    if (videoRef.current && isPlaying) {
                      videoRef.current.pause()
                      setIsPlaying(false)
                    }
                  }}
                  className={cn(
                    "text-white hover:bg-white/20 rounded-md px-4 py-2 transition-all",
                    viewMode === "pdf" && "bg-primary text-white"
                  )}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            )}

            {/* Content Display */}
            <div className="relative flex-1 flex items-center justify-center bg-black/50">
              {/* PDF Viewer */}
              {viewMode === "pdf" && hasPDF && (
                <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">PDF Document</span>
                      <Badge variant="outline" className="ml-2">
                        {currentLecture.title}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          // Open PDF in new tab using PDF.js viewer (download disabled)
                          const displayUrl = getPdfDisplayUrl(currentLecture.pdfUrl)
                          window.open(displayUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                  <div 
                    className="flex-1 overflow-hidden relative"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ userSelect: 'none' }}
                  >
                    {/* Use PDF.js viewer with download disabled */}
                    <iframe
                      src={getPdfDisplayUrl(currentLecture.pdfUrl)}
                      className="w-full h-full"
                      title="PDF Viewer"
                      type="application/pdf"
                      onError={() => {
                        console.error("PDF iframe failed to load")
                      }}
                      style={{ border: 'none', pointerEvents: 'auto' }}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      allow="fullscreen"
                    />
                    {/* Fallback message if PDF doesn't load */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg border text-center pointer-events-auto">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-red-600" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          PDF viewer may not be available. Click the button above to open in a new tab.
                        </p>
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            const displayUrl = getPdfDisplayUrl(currentLecture.pdfUrl)
                            window.open(displayUrl, '_blank', 'noopener,noreferrer')
                          }}
                          className="gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Open PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Player */}
              {viewMode === "video" && hasVideo && (
                <>
                  {isYouTubeVideo ? (
                    <iframe
                      src={getEmbedUrl(currentLecture.videoUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  ) : (
                    <video
                      ref={videoRef}
                      src={currentLecture.videoUrl}
                      className="w-full h-full max-h-[calc(100vh-16rem)]"
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onLoadedMetadata={handleMetadataLoaded}
                      onEnded={handleVideoEnded}
                      onWaiting={handleWaiting}
                      onPlaying={handlePlaying}
                      poster="/placeholder.svg?height=720&width=1280"
                      playsInline // Important for mobile
                    ></video>
                  )}
                </>
              )}

              {/* Loading State for Content */}
              {!hasVideo && !hasPDF && isLoading && (
                <div className="text-center text-white p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
                  <Skeleton className="h-6 w-64 mx-auto bg-white/10" />
                </div>
              )}
              
              {/* No Content Message - Only show when not loading */}
              {!hasVideo && !hasPDF && !isLoading && (
                <div className="text-center text-white p-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No content available for this lecture</p>
                </div>
              )}

              {/* Modern Buffering indicator */}
              {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20"></div>
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white absolute top-0 left-0"></div>
                    </div>
                    <p className="text-white text-sm font-medium">Buffering...</p>
                  </div>
                </div>
              )}

              {/* Modern Auto-play overlay */}
              {showAutoPlayOverlay && (
                <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20">
                  <div className="text-center text-white px-6 max-w-md">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 mb-4">
                        <span className="text-3xl font-bold">{autoPlayCountdown}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Next lecture starting soon
                    </h3>
                    <p className="text-slate-300 mb-6 text-lg">{lectureData?.data?.[currentLectureIndex + 1]?.title}</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAutoPlayOverlay(false)}
                        className="text-white border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAutoPlayOverlay(false)
                          skipToNextLecture()
                        }}
                        className="bg-white text-black hover:bg-white/90 px-6 shadow-lg"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Video controls (only for direct videos and when viewing video) */}
            {!isYouTubeVideo && viewMode === "video" && hasVideo && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm p-4 lg:p-6 transition-all duration-300",
                  isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
                )}
              >
                {/* Modern Progress bar */}
                <div
                  className="mb-4 relative h-2 bg-white/20 rounded-full cursor-pointer group hover:h-2.5 transition-all duration-200"
                  onClick={handleSeek}
                  ref={progressBarRef}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-200 shadow-lg shadow-primary/50"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"></div>
                  </div>
                </div>

                {/* Modern Controls */}
                <div className="flex items-center justify-between gap-2 lg:gap-4">
                  <div className="flex items-center gap-1 lg:gap-2 flex-1 min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 rounded-lg h-10 w-10 transition-all duration-200 hover:scale-110"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </Button>

                    {!isMobile && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20 rounded-lg h-9 w-9 transition-all duration-200"
                          onClick={() => skipTime(-10)}
                          title="Rewind 10s"
                        >
                          <Rewind className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20 rounded-lg h-9 w-9 transition-all duration-200"
                          onClick={() => skipTime(10)}
                          title="Forward 10s"
                        >
                          <FastForward className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <div className="flex items-center gap-1 lg:gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20 rounded-lg h-9 w-9 transition-all duration-200" 
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      {!isMobile && (
                        <div className="w-20 lg:w-24 hidden sm:block">
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="h-1.5"
                          />
                        </div>
                      )}
                    </div>

                    <span className="text-xs lg:text-sm text-white/90 font-medium hidden sm:inline-block min-w-fit ml-2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 lg:gap-2">
                    {!isMobile && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-white hover:bg-white/20 rounded-lg text-xs lg:text-sm font-medium px-3 h-9"
                            >
                              {playbackRate}x
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-sm border-slate-700">
                            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                              <DropdownMenuItem
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={cn(
                                  "cursor-pointer",
                                  playbackRate === rate ? "bg-primary/20 text-primary" : "text-white hover:bg-white/10"
                                )}
                              >
                                {rate}x
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20 rounded-lg h-9 w-9 transition-all duration-200 disabled:opacity-30"
                          onClick={skipToNextLecture}
                          disabled={currentLectureIndex >= lectureData?.data?.length - 1}
                          title="Next lecture"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 rounded-lg h-9 w-9 transition-all duration-200"
                      onClick={toggleFullScreen}
                      title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Lecture list section - hide in fullscreen mode */}
        {!isFullScreen && (
          <div className="w-full lg:w-1/3 border-l border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
            <Tabs defaultValue="lectures" className="h-full flex flex-col">
              <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm px-4 lg:px-6">
                <style dangerouslySetInnerHTML={{__html: `
                  .lecture-tabs [data-state="active"] {
                    background-color: var(--primary) !important;
                    color: white !important;
                  }
                  .lecture-tabs [data-state="active"] * {
                    color: white !important;
                  }
                  .lecture-tabs button[data-state="active"] {
                    color: white !important;
                  }
                  .lecture-tabs [data-state="active"] span {
                    color: white !important;
                  }
                `}} />
                <TabsList className="lecture-tabs h-16 bg-transparent gap-2">
                  <TabsTrigger 
                    value="lectures" 
                    className="flex-1 rounded-lg transition-all duration-200 font-semibold text-sm lg:text-base text-slate-700 dark:text-slate-300 data-[state=active]:shadow-md"
                  >
                    Lectures ({lectureData?.total || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes" 
                    className="flex-1 rounded-lg transition-all duration-200 font-semibold text-sm lg:text-base text-slate-700 dark:text-slate-300 data-[state=active]:shadow-md"
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="lectures" className="p-0 overflow-visible flex-1">
                <div className="p-4 lg:p-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/30 to-transparent dark:from-slate-900/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Course Content
                      {searchQuery && (
                        <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                          ({filteredLectures.length} found)
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span className="font-medium">{lectureData?.course?.duration || "0h 0m"} total</span>
                    </div>
                  </div>
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des leçons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="overflow-visible">
                  <div className="p-4 lg:p-6 space-y-3">
                    {filteredLectures.map((lecture) => {
                      const typeInfo = getLectureTypeInfo(lecture.contentType)
                      const TypeIcon = typeInfo.icon
                      // Find the original index in the full lecture data array
                      const originalIndex = lectureData?.data?.findIndex((l) => l._id === lecture._id) ?? 0
                      return (
                      <Card
                        key={lecture._id}
                        className={cn(
                          "overflow-hidden transition-all duration-300 cursor-pointer group border-2",
                          "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                          currentLecture._id === lecture._id 
                            ? "border-primary shadow-lg shadow-primary/20 bg-primary/5 dark:bg-primary/10" 
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        )}
                        onClick={() => handleSelectLecture(lecture, originalIndex)}
                      >
                        <CardContent className="p-0">
                          <div className="flex items-start p-4 lg:p-5">
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <h4 className="font-semibold text-sm lg:text-base text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                                  {lecture.title}
                                </h4>
                                {lecture.progress === 100 && (
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                {/* Lecture Type */}
                                <div className={cn("flex items-center text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md", typeInfo.color)}>
                                  <TypeIcon className="h-3 w-3 mr-1.5" />
                                  <span>{typeInfo.label}</span>
                                </div>
                                {/* PDF Indicator */}
                                {(lecture.contentType === "pdf" || lecture.contentType === "both") && lecture.pdfUrl && (
                                  <div className="flex items-center text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-800">
                                    <FileText className="h-3 w-3 mr-1.5" />
                                    <span>PDF Available</span>
                                  </div>
                                )}
                                {/* Video Indicator */}
                                {(lecture.contentType === "video" || lecture.contentType === "both") && lecture.videoUrl && (
                                  <div className="flex items-center text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                                    <Video className="h-3 w-3 mr-1.5" />
                                    <span>Video Available</span>
                                  </div>
                                )}
                                <div className="flex items-center text-xs lg:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{lecture.duration}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs border-2",
                                    lecture.status === "free" 
                                      ? "border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                                      : "border-slate-300 dark:border-slate-700"
                                  )}
                                >
                                  {lecture.status}
                                </Badge>
                              </div>
                              {/* Progress Bar */}
                              {lecture.progress > 0 && (
                                <div className="mt-2">
                                  <Progress 
                                    value={lecture.progress} 
                                    className="h-1.5" 
                                  />
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {lecture.progress}% completed
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                    })}
                    {isLoading && filteredLectures.length === 0 && (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <Card key={i} className="border-2 border-slate-200 dark:border-slate-800">
                            <CardContent className="p-4 lg:p-5">
                              <div className="space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <div className="flex gap-2">
                                  <Skeleton className="h-6 w-20 rounded-md" />
                                  <Skeleton className="h-6 w-16 rounded-md" />
                                  <Skeleton className="h-6 w-16 rounded-md" />
                                </div>
                                <Skeleton className="h-1.5 w-full rounded-full" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {!isLoading && filteredLectures.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">
                          {searchQuery ? "No lectures found matching your search" : "No lectures available"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="flex-1 p-4 lg:p-6 overflow-auto">
                <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Lecture Summary</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentLecture?.summary || "No summary available for this lecture."}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      )}
    </div>
  )
}

export default function CourseLecturePlayer() {

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
    <CourseLecturePlayerComponent />
    </Suspense>
  )
}