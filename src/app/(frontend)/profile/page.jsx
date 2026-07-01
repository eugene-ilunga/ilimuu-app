"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Edit,
  Clock,
  User,
  Play,
  Plus,
   Mail, Phone, MapPin, Briefcase, Award, Languages,
  Check
} from "lucide-react";
import Image from "next/image";
import { useEnrollListHooks } from "@/hooks/useEntrollListHooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import BecomeInstructorModal from "./become-instructor-modal";
import { Textarea } from "@/components/ui/textarea";
import { useEnrollPlanHooks } from "@/hooks/useMentorPlanEnrollHooks";
import { MentorList } from "./mentor-list";
import { useBootcampEnrollmentsHooks } from "@/hooks/useBootcampEnrollmentsHooks";
import BootcampList from "./bootcamp-list";

function StudentProfileComponent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { enrollListData, fetchEnrollList } = useEnrollListHooks();
  const [isEditing, setIsEditing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [hoveredCard, setHoveredCard] = useState("");
  const [user, setUser] = useState();
  const [currentPage, SetCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabParam || "courses");

  const { enrollPlan } = useEnrollPlanHooks();
  const { bootcampEnrollments, loading: bootcampLoading } = useBootcampEnrollmentsHooks();

  // Handle tab change from URL parameter and auto-scroll
  useEffect(() => {
    if (tabParam && ["courses", "mentors", "bootcamps"].includes(tabParam)) {
      setActiveTab(tabParam);
      // Scroll to tabs section after a short delay to ensure page is loaded
      setTimeout(() => {
        const tabsElement = document.querySelector('[role="tablist"]');
        if (tabsElement) {
          tabsElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [tabParam]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const formData = new FormData();
        const res = await fetch("/api/user/details", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUser(data.data);
        console.log(data.data);
      } catch {
        console.error("user fetching error");
      }
    };
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updateUser = {
      userId: user._id,
      name: formData.get("name"),
      email: formData.get("email"),
      image: user?.image,
    };

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUser),
      });
      const result = await res.json();

      if (result.success) {
        setUser(result.data);
        setIsEditing(false);
      } else {
        console.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [newSkills, setNewSkills] = useState("");

  const handleAddExpertise = (e) => {
    e.preventDefault();

    // Split by comma or newline, trim each skill, remove empties, and remove duplicates
    const skillsToAdd = newSkills
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsToAdd.length === 0) return;

    // Combine old skills + new skills, dedupe
    const combinedSkills = Array.from(
      new Set([...userData.expartise, ...skillsToAdd])
    );

    setUserSkillData((prev) => ({
      ...prev,
      expartise: combinedSkills,
    }));

    setNewSkills("");
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div>

           <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-8">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold capitalize flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              {user?.role} Profile
            </CardTitle>
            <p className="text-blue-100 text-sm mt-1">Manage your account information</p>
          </div>

          {user?.role !== "admin" && (
            <BecomeInstructorModal
              userId={user?._id}
              userData={{
                name: user?.name,
                email: user?.email,
                image: user?.image,
                phone: user?.phone,
                gender: user?.gender,
                profession: user?.profession,
                about: user?.about,
                country: user?.country,
                expertise: user?.expartise,
                languages: user?.language,
                certificates: user?.certificate,
              }}
              trigger={
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              }
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <Image
                src={user?.image || "/placeholder.svg?height=400&width=400&query=professional headshot"}
                alt={user?.name || "User Image"}
                height={400}
                width={400}
                className="rounded-2xl w-40 h-40 object-cover shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <Badge variant="secondary" className="mt-4 px-3 py-1 bg-blue-100 text-blue-700 capitalize">
              {user?.role}
            </Badge>
          </div>

          {/* User Information Section */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-lg text-gray-600 mb-4">{user?.profession}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contact</h3>

                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{user?.email}</span>
                </div>

                {user?.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                )}

                {user?.country && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{user?.country}</span>
                  </div>
                )}
              </div>

              {/* Professional Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Professional</h3>

                {user?.profession && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{user?.profession}</span>
                  </div>
                )}

                {user?.expartise && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{user?.expartise}</span>
                  </div>
                )}

                {user?.language && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Languages className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">{user?.language}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            {user?.about && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{user?.about}</p>
              </div>
            )}

            {/* Certificates */}
            {user?.certificate && (
              <div className="pt-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Certificates</h3>
                <div className="flex flex-wrap gap-2">
                  {user.certificate.map((cert, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 bg-gray-50 text-gray-700">
                      {cert.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
      

    
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-5">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold capitalize">
              {user?.role} Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your courses, mentors, and transactions
            </p>
          </div>
          {user?.role === "student" && (
            <BecomeInstructorModal
              userId={user?._id}
              userData={{
                name: user?.name,
                email: user?.email,
                image: user?.image,
                phone: user?.phone,
                gender: user?.gender,
              }}
              isOpen={isModalOpen}
              trigger={
                <Button
                  onClick={openModal}
                  className="mt-4 md:mt-0 px-6 py-3 text-white font-semibold text-base
          bg-[#5943E3] hover:bg-[#4735b5]
          shadow-lg hover:shadow-xl transition-all duration-800
          rounded-full animate-pulse"
                >
                  <User className="mr-2 h-5 w-5" /> Join as Instructor
                </Button>
              }
              onClose={closeModal}
            />
          )}
        </div>

        {/* Conditional rendering of modal */}

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex overflow-x-scroll lg:w-fit lg:overflow-hidden lg:justify-start">
              <TabsTrigger className="ml-24 lg:ml-0" value="courses">
                Enrolled Courses
              </TabsTrigger>
              <TabsTrigger value="mentors">Booked Mentors</TabsTrigger>
              <TabsTrigger value="bootcamps">Bootcamps</TabsTrigger>
            </TabsList>
            <TabsContent value="courses">
              <div className="container mx-auto py-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                  <Badge variant="outline" className="text-sm">
                    {enrollListData.length} {enrollListData.length === 1 ? 'Cours' : 'Cours'}
                  </Badge>
                </div>
                <ScrollArea className="h-[800px] rounded-lg border bg-card p-1">
                  <div className="grid gap-4 p-4">
                    {enrollListData.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No courses enrolled yet.</p>
                        <p className="text-sm mt-2">
                          Explore our courses and start learning today!
                        </p>
                        <Link
                          href="/courselist"
                          className="text-primary hover:underline mt-4 inline-block font-medium"
                        >
                          Browse Courses →
                        </Link>
                      </div>
                    ) : (
                      enrollListData.map((course, index) => {
                        // Calculate and round progress
                        const progressValue = typeof course.progress === 'number' 
                          ? course.progress 
                          : parseFloat(course.progress) || 0;
                        const progressPercentage = Math.min(100, Math.max(0, Math.round(progressValue)));
                        
                        return (
                          <Card
                          key={index}
                          className="overflow-hidden transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/20 group"
                          onMouseEnter={() =>
                            setHoveredCard(course.courseId.id)
                          }
                          onMouseLeave={() => setHoveredCard("")}
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-1/3 h-48 md:h-auto min-h-[200px]">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                              <Image
                                src={
                                  course.courseId.thumbnail ||
                                  "/assets/placeholder.jpg"
                                }
                                alt={course.courseId.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {hoveredCard === course.courseId.id && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-sm">
                                  <Link
                                    href={`/profile/enroll-lectures?id=${course.courseId._id}`}
                                  >
                                    <Button
                                      size="lg"
                                      variant="secondary"
                                      className="rounded-full w-20 h-20 bg-white/90 hover:bg-white text-primary shadow-lg"
                                    >
                                      <Play
                                        className="h-10 w-10 ml-1"
                                        fill="currentColor"
                                      />
                                    </Button>
                                  </Link>
                                </div>
                              )}
                              {course.completed && (
                                <Badge className="absolute top-3 right-3 z-20 bg-green-500 hover:bg-green-600 text-white shadow-lg">
                                  <Check className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {progressPercentage > 0 && progressPercentage < 100 && (
                                <Badge className="absolute top-3 left-3 z-20 bg-blue-500 hover:bg-blue-600 text-white shadow-lg">
                                  In Progress
                                </Badge>
                              )}
                            </div>

                            <div className="flex-1 p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                              <CardHeader className="p-0 pb-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
                                      {course.courseId.title}
                                    </h3>
                                    <div className="flex items-center mt-3 text-muted-foreground">
                                      <Avatar className="h-7 w-7 mr-2 border-2 border-white shadow-sm">
                                        <AvatarImage
                                          src={
                                            course.courseId.instructor?.image ||
                                            "/assets/default-avatar.png"
                                          }
                                          alt={course.courseId.instructor?.name}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {course.courseId.instructor?.name?.charAt(0) || 'I'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">
                                        {course.courseId.instructor?.name || 'Formateur'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="p-0 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Course Progress
                                      </span>
                                      <span className="text-sm font-bold text-primary">
                                        {progressPercentage}%
                                      </span>
                                    </div>
                                    <div className="relative w-full">
                                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full rounded-full transition-all duration-300 ease-out"
                                          style={{ 
                                            width: `${Math.max(progressPercentage, 0)}%`,
                                            backgroundColor: progressPercentage > 0 ? '#5F0EB3' : 'transparent',
                                            minWidth: progressPercentage > 0 ? '4px' : '0px'
                                          }}
                                        />
                                      </div>
                                      {progressPercentage === 100 && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                          <Check className="h-4 w-4 text-white z-10" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                      <span>{progressPercentage === 0 ? 'Not started' : progressPercentage === 100 ? 'Terminé' : 'In progress'}</span>
                                      {course.courseId.duration && (
                                        <span className="flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {course.courseId.duration}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                                      <span>
                                        Enrolled{" "}
                                        {formatDistanceToNow(
                                          new Date(course.enrollmentDate),
                                          { addSuffix: true }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>

                              <CardFooter className="p-0 pt-4 flex justify-between items-center border-t">
                                <Link
                                  href={`/profile/enroll-lectures?id=${course.courseId._id}`}
                                  className="flex-1"
                                >
                                  <Button 
                                    variant="default" 
                                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                                  >
                                    <GraduationCap className="h-4 w-4" />
                                    {progressPercentage === 100 ? 'Review Course' : 'Continue Learning'}
                                  </Button>
                                </Link>
                              </CardFooter>
                            </div>
                          </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="mentors">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {enrollPlan.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        <p className="text-lg">No mentorship enrolled yet.</p>
                        <p className="text-sm">
                          Explore our mentors and start learning today!
                        </p>
                        <Link
                          href="/mentorlist"
                          className="text-blue-500 hover:underline mt-2 inline-block"
                        >
                          Browse Mentors
                        </Link>
                      </div>
                    ) : (
                  <MentorList enrollments={enrollPlan} />
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="bootcamps">
              <div className="container mx-auto py-6">
                <h2 className="text-2xl font-bold mb-6">My Bootcamp Enrollments</h2>
                <ScrollArea className="h-[800px] rounded-lg border bg-card p-1">
                  <div className="p-4">
                    {bootcampLoading ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Loading bootcamp enrollments...</p>
                      </div>
                    ) : (
                      <BootcampList enrollments={bootcampEnrollments} />
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfile() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <StudentProfileComponent />
    </Suspense>
  );
}
