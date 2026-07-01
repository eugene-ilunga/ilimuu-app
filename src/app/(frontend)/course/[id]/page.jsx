"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  Play,
  GraduationCap,
  Clock,
  Users,
  CheckCircle2,
  DollarSign,
  Lock,
  PlayCircle,
  BookText,
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  FolderOpen,
  Tag,
  Award,
  LucideGavel,
  ArrowRight,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { from } from "form-data";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import CourseReviews from "./../rating";

import VideoPlayer from "@/components/videoPlayer";
import LoadingPage from "../loading";
import { useRef } from "react";
import Slider from "react-slick";
import { useCart } from "@/utils/CartContext";

export default function Component() {
  const [activeTab, setActiveTab] = useState("overview");
  const [videoSrc, setVideoSrc] = useState("");
  const [courses, setCourses] = useState([]);
  const tabRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleSeeFullCurriculum = () => {
    setActiveTab("course-info");

    // Scroll to the tab section smoothly
    setTimeout(() => {
      tabRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Add delay to ensure the tab content is rendered
  };

  const searchParams = useSearchParams();
  const courseID = searchParams.get("id");

  const [course, setcourse] = useState(null);
  const [lectures, setlectures] = useState([]);
  const { fetchCart } = useCart();

  const paymentCheckout = async () => {
    try {
      const formdata = new FormData();
      formdata.set("courseid", courseID);
      formdata.set("quantity", 1);
      formdata.set("price", course.price);

      const toastID = toast.loading("Please wait...");
      const res = await fetch("/api/cart/add", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();

      if (data.status === 200) {
        toast.success(data.message, { id: toastID });

    
          await fetchCart(); // ✅ just fetch function
       
      } else if (data.status === 409) {
        toast.custom(
          (t) => (
            <div
              className={`${t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <ShoppingCart
                      className="h-6 w-6 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Already in cart
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      This course is already in your cart.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Checkout
                </button>
              </div>
            </div>
          ),
          { id: toastID }
        );
      } else {
        toast.error(data.message, { id: toastID });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  //--- slider start ---
  const sliderRef = useRef(null);
  var settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        setLoading(true);

        const formdata = new FormData();
        formdata.set("courseid", courseID);
        const res = await fetch("/api/course/details", {
          method: "POST",
          body: formdata,
        });
        const data = await res.json();
        setcourse(data.data);


      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      }
    };

    const getLecture = async () => {
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
        setlectures(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCourseDetails();
    getLecture();

  }, [courseID]);

  useEffect(() => {
    const getSimilarCourses = async () => {
      if (!course?.category?._id) return;

      try {
        const formdata = new FormData();
        formdata.set("page", 1);
        formdata.set("pagination", 4);
        formdata.set("category", course.category._id);

        const res = await fetch("/api/course", {
          method: "POST",
          body: formdata,
        });

        const data = await res.json();
        console.log("Similar Courses:", data.data);
        setCourses(data.data);
      } catch (error) {
        console.error("Error fetching similar courses:", error);
      }
    };

    getSimilarCourses();
  }, [course?.category?._id]);


  const [activeLecture, setActiveLecture] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const playVideo = (lecture) => {
    setActiveLecture(lecture);
  };

  const closeVideo = () => {
    setActiveLecture(null);
  };

  // Determine how many lectures to show initially
  const initialDisplayCount = 3;
  const displayedLectures = showAll
    ? lectures
    : lectures.slice(0, initialDisplayCount);
  const hasMoreLectures = lectures.length > initialDisplayCount;
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center justify-left mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 mr-1 ${star <= Math.round(rating)
              ? "text-[#FC6441] fill-current"
              : "text-gray-300"
              }`}
          />
        ))}
        <span className=" text-sm px-2  text-gray-700">
          {rating === 0 ? "" : `(${rating})`}
        </span>
      </div>
    );
  };
  if (loading) {
    return LoadingPage();
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="order-2 lg:order-1">
          <RatingStars rating={course?.averageRating}></RatingStars>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl lg:text-4xl font-bold"> {course?.title}</h1>
            {course?.price === 0 || course?.price === null || course?.price === undefined ? (
              <div className="bg-green-100 text-green-800 text-md lg:text-xl font-bold py-2 px-4 rounded-full">
                Free
              </div>
            ) : course?.discount && course?.discount > 0 ? (
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">${course?.discount}</span>
                  <span className="bg-green-100 text-green-800 text-lg lg:text-2xl font-bold py-2 px-4 rounded-full flex items-center gap-1">
                    <DollarSign className="w-4 h-4 lg:w-5 lg:h-5" />
                    {course?.price}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-green-100 text-green-800 text-md lg:text-xl font-bold py-2 px-4 rounded-full flex items-center gap-1">
                <DollarSign className="w-4 h-4 mr-1" />
                {course?.price}
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-6 text-lg">
            {course?.short_description}{" "}
          </p>
          <ul className="grid gap-1.5 mb-4">
            <li className="flex items-center py-1">
              <GraduationCap className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span className="text-gray-700 text-sm capitalize">
                {course?.level}
              </span>
            </li>

            <li className="flex items-center py-1">
              <Tag className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
              <span className="text-gray-700 text-sm capitalize">
                {course?.category?.categoryName}
              </span>
            </li>

            <li className="flex items-center py-1">
              <FolderOpen className="w-4 h-4 mr-2 text-indigo-600 shrink-0" />
              <span className="text-gray-700 text-sm capitalize">
                {course?.subCategory}
              </span>
            </li>

            <li className="flex items-center py-1">
              <Users className="w-4 h-4 mr-2 text-amber-600 shrink-0" />
              <span className="text-gray-700 text-sm">
                {course?.totalSeat} Seats
              </span>
            </li>

            <li className="flex items-center py-1">
              <Clock className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
              <span className="text-gray-700 text-sm">
                Duration: {course?.duration}
              </span>
            </li>
          </ul>
          <div className="flex flex-row space-x-4">
            <Button
              onClick={paymentCheckout}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 h-[35px] rounded-full"
            >
              Enroll Course
            </Button>

            <Button
              onClick={handleSeeFullCurriculum}
              variant="outline"
              size="lg"
              className="text-gray-700 border-gray-300 hover:bg-gray-50 px-4 h-[35px] rounded-full"
            >
              See Curriculum
            </Button>
          </div>
        </div>
        <div className="relative order-1 lg:order-2 ">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="overflow-hidden rounded-lg cursor-pointer">
                <Image
                  alt="Web Development Course"
                  className="w-full h-auto object-cover"
                  height={400}
                  width={600}
                  src={course?.thumbnail}
                  style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                  }}
                />
                <div className="absolute inset-0  flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full w-16 h-16 bg-white bg-opacity-80 hover:bg-opacity-100"
                  >
                    <Play className="w-8 h-8 text-orange-500" />
                  </Button>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-w-[95vw] p-0 bg-black/95 border-0 [&>button]:text-white [&>button]:hover:text-gray-300 [&>button]:hover:bg-white/10">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="text-white text-xl font-semibold">Course Preview</DialogTitle>
              </DialogHeader>
              <div className="px-6 pb-6">
                <VideoPlayer src={course?.overview_video} onClose={closeVideo} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm mt-10 lg:mt-12 ">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Meet Your Instructor
            </h2>
            <Link href={`/mentor?id=${course?.instructor?._id}`}>
              <button className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                <span>View Profile</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Instructor Image with Border */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-[2px]"></div>
              <div className="relative p-1 bg-white rounded-full">
                <Image
                  src={
                    course?.instructor?.image ||
                    "/assets/custom-image/default-instructor.jpg"
                  }
                  alt={course?.instructor?.name || "Formateur"}
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-24 h-24 border-2 border-white"
                />
              </div>
            </div>

            {/* Instructor Details */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-800">
                {course?.instructor?.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {course?.instructor?.profession}
              </p>

              {/* About */}
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {course?.instructor?.about}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={tabRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5 lg:mt-12">
          <TabsList className="bg-transparent border-b w-full justify-start overflow-x-scroll lg:overflow-hidden ">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 rounded-none border-b-2 border-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="course-info"
              className="data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 rounded-none border-b-2 border-transparent"
            >
              Course Module
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 rounded-none border-b-2 border-transparent"
            >
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="mt-8 text-sm text-blue-600 mb-4">Overview</div>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold mb-4">
                  Description
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li> {course?.description}</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold lg:mb-4">Stack</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {course?.courseTags?.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold">136 Total Enrolled</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold">
                        Total Duration: {course?.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold">
                        {course?.totalSeat} Seats Free
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold">
                        Completion Certificate
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold capitalize">
                        Level Course {course?.level}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-blue-500" />
                    <div className="text-sm">
                      <div className="font-semibold">
                        Language: {course?.language}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 lg:mt-12">
              <h2 className="text-xl lg:text-2xl font-bold mb-4">
                Course Included
              </h2>
              <ul className="space-y-2">
                {course?.courseIncludes?.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-orange-500 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 lg:mt-12 grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold mb-4">
                  Course Requirements
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {course?.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold mb-4">
                  Course Outcomes
                </h2>
                <ul className="space-y-2 text-gray-600">
                  {course?.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 mt-1 flex-shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="review">
            <CourseReviews courseId={course?._id} />
          </TabsContent>

          <TabsContent value="course-info">
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                  Course Lessons
                </h2>
                <Badge variant="outline" className="text-sm">
                  {lectures.length} lessons
                </Badge>
              </div>

              <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <h3 className="text-lg font-medium">Course Curriculum</h3>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="divide-y divide-gray-100">
                    {displayedLectures.map((lecture, index) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {lecture.status === "free" ? (
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <PlayCircle className="w-6 h-6 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900">
                              {index + 1}. {lecture.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <Clock className="w-3.5 h-3.5" />
                              {lecture.duration}
                              {(lecture.contentType === "pdf" || lecture.contentType === "both") && (
                                <Badge variant="outline" className="text-xs">
                                  {lecture.contentType === "both" ? "Video + PDF" : "PDF"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {lecture.status === "free" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => playVideo(lecture)}
                              >
                                {(lecture.contentType === "pdf" || lecture.contentType === "both") && lecture.pdfUrl
                                  ? "View Content"
                                  : "Watch Now"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[900px] max-w-[95vw] p-0 bg-black/95 border-0 [&>button]:text-white [&>button]:hover:text-gray-300 [&>button]:hover:bg-white/10">
                              <DialogHeader className="px-6 pt-6 pb-2">
                                <DialogTitle className="text-white text-xl font-semibold">{lecture.title}</DialogTitle>
                              </DialogHeader>
                              <div className="px-6 pb-6">
                                {(() => {
                                  const contentType = lecture.contentType || "video";
                                  const hasVideo = (contentType === "video" || contentType === "both") && lecture.videoUrl;
                                  const hasPdf = (contentType === "pdf" || contentType === "both") && lecture.pdfUrl;

                                  if (hasVideo && (!hasPdf || contentType === "video")) {
                                    // Show video only
                                    return <VideoPlayer src={lecture.videoUrl} onClose={closeVideo} />;
                                  } else if (hasPdf && (!hasVideo || contentType === "pdf")) {
                                    // Show PDF only
                                    return (
                                      <div className="w-full bg-white dark:bg-slate-900 rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
                                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Lecture PDF</h3>
                                          </div>
                                          <a
                                            href={lecture.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                          >
                                            <Download className="h-4 w-4" />
                                            Download PDF
                                          </a>
                                        </div>
                                        <div className="w-full" style={{ height: '600px' }}>
                                          <iframe
                                            src={`${lecture.pdfUrl}#toolbar=0`}
                                            className="w-full h-full border-0"
                                            title="PDF Viewer"
                                          ></iframe>
                                        </div>
                                      </div>
                                    );
                                  } else if (hasVideo && hasPdf) {
                                    // Show both - we'll default to video but allow switching (for now just show video)
                                    return <VideoPlayer src={lecture.videoUrl} onClose={closeVideo} />;
                                  } else {
                                    return (
                                      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
                                        <p className="text-gray-500">No content available for this lecture</p>
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Premium
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {hasMoreLectures && (
                    <div className="p-4 text-center border-t border-gray-100">
                      <Button
                        variant="ghost"
                        onClick={() => setShowAll(!showAll)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {showAll
                          ? "Show Less"
                          : `Show All (${lectures.length}) Lessons`}
                        {showAll ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Unlock all premium content to {course?.title}
                </p>
                <Button>Buy Now</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8 lg:mt-16">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">
          Similar Courses
        </h2>
        <div className="grid  md:grid-cols-4 gap-6">

          {/* <Slider ref={sliderRef} {...settings}> */}
          {
            courses.map((course) => (
              <Card className="w-full bg-blue-50/25 border-dashed border-[#c5b5ff] rounded-xl overflow-hidden p-5 transition-all duration-300 hover:shadow-xl"
                key={course._id}
                course={course}
              >
                <Link href={`/course/details?id=${course._id}`}>
                  <CardHeader className="p-0 relative w-[100%] h-[200px]">
                    <Image
                      src={course.thumbnail}
                      alt=""
                      className=" w-full h-full object-cover rounded-lg"
                      width={300}
                      height={450}
                    />
                    <h5 className=" py-2 px-3 text-gray-300 text-xs bg-[#17254E] absolute bottom-3 left-3 rounded-md">Digital Merketing</h5>
                  </CardHeader>
                  <CardContent className="mt-3 pb-2 px-0">
                    <div className="flex justify-between items-center">
                      <RatingStars rating={5.3}></RatingStars>
                      <h5 className=" w-fit text-md py-1 mt-3 text-[--primary] font-semibold  ">

                        {
                          course.price === 0 || course.price === null || course.price === undefined ? (
                            <span className="text-md">Free</span>
                          ) : course.discount ? (
                            <span>
                              <del className="font-normal text-md mr-2">${course.discount}</del>${course.price}
                            </span>
                          ) : (
                            <span className="text-md">
                              ${course.price}
                            </span>
                          )
                        }
                      </h5>
                    </div>
                    <h3 className="text-lg font-bold text-primary truncate">
                      {course.title}
                    </h3>
                    <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-1 px-2 py-1 bg-white rounded-sm shadow-sm max-w-md mt-2">
                      <div className="flex items-center gap-1">
                        <BookText className="w-4 h-4" />
                        <span className="font-normal text-xs capitalize text-gray-600">
                          {course.courseBadge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-600">
                        <LucideGavel className="w-4 h-4" />
                        <span className="text-xs capitalize">
                          {course.level}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">
                          Seat {course.totalSeat}
                        </span>
                      </div>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-2 justify-between lg:items-center mt-5">
                      <div className="flex gap-3">
                        <Image
                          className="w-8 h-8 rounded-full"
                          src={course.instructor?.image}
                          alt="Author Image"
                          width={50}
                          height={50}
                        ></Image>

                        <h3>{course.instructor?.name}</h3>
                      </div>
                      <Button className='text-sm w-fit font-normal h-8 bg-[--primary] px-3 py-0 rounded-full hover:bg-[--primary]  hover:text-white  text-white '>Enroll <ArrowRight className='text-xs w-5 h-4' /></Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          }
          {/* </Slider> */}


        </div>
      </div>
      <div className="mt-4 lg:mt-8">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Who can join courses on ELIMUU?
            </AccordionTrigger>
            <AccordionContent>
              Anyone with a desire to learn can join! Our platform offers beginner to advanced level courses suitable for students, professionals, and career changers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Do I get lifetime access to purchased courses?
            </AccordionTrigger>
            <AccordionContent>
              Yes! Once you enroll in a course, you get lifetime access to the materials and future updates at no extra cost.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Will I receive a certificate after completing a course?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. After successfully completing any course, you will receive a digitally verifiable certificate that you can download and share.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              What kind of support does ELIMUU provide?
            </AccordionTrigger>
            <AccordionContent>
              Our students get access to dedicated support including course Q&A sections, discussion forums, and live instructor sessions where available.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              Can I access the courses from mobile devices?
            </AccordionTrigger>
            <AccordionContent>
              Yes, our platform is fully responsive. You can learn on the go using your smartphone, tablet, or any modern device.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

    </div>
  );
}
