"use client";

import Image from "next/image";
import { Search, Grid, FilterX, Star, LucideGavel, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookText, Clock, Users } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import GlobalPagination from "@/components/GlobalPagination";
export default function courseList() {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-[300px] rounded-xl" />}>
      <CoursesPage />
    </Suspense>
  );
}

function CoursesPage() {
  const [courseData, setCourseData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourse, settotalCourse] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [instructors, setinstructor] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("default");
  const [seletedCourseLevel, setseletedCourseLevel] = useState();

  const courseLevel = [
    { id: "beginner", name: "Débutant" },
    { id: "intermediate", name: "Intermédiaire" },
    { id: "advanced", name: "Avancé" },
    { id: "all-level", name: "Tous niveaux" },
  ];

  const handleCategoryCheckboxChange = (id) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleCheckboxChange = (id) => {
    setSelectedInstructorId((prev) => (prev === id ? null : id));
  };
  const handleCourseLevelChange = (id) => {
    setseletedCourseLevel((prev) => (prev === id ? null : id));
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Optionally trigger API/filtering here
  };

  const fetchCourses = useCallback(async () => {
    try {
      // Extract from URL query
      const urlSearch = searchParams.get("search") || "";
      const urlCategoryId = searchParams.get("category") || "";
      // Prefer app state (input) if available, else fallback to URL
      const finalSearch = searchTerm?.trim() !== "" ? searchTerm : urlSearch;
      const finalCategoryId = selectedCategoryId || urlCategoryId;

      const formdata = new FormData();
      formdata.set("search", finalSearch);
      formdata.set("page", currentPage);
      formdata.set("pagination", 9);
      formdata.set("level", seletedCourseLevel || "");
      formdata.set("category", finalCategoryId || "");
      formdata.set("instructor", selectedInstructorId || "");
      formdata.append("sortValue", sortValue);

      const res = await fetch("/api/course/list", {
        cache: "no-store",
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setCourseData(data.data);
      settotalCourse(data.total);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [
    currentPage,
    searchParams,
    selectedCategoryId,
    selectedInstructorId,
    searchTerm,
    seletedCourseLevel,
    sortValue,
  ]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);
  }, [fetchCourses]);

  const [catagoryData, setCatagoryData] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const formdata = new FormData();
        formdata.set("page", 1);
        formdata.set("pagination", 5);
        const res = await fetch("api/category", {
          method: "GET",
        });

        const data = await res.json();
        console.log("Category data:", data);
        setCatagoryData(data.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    const getInstructors = async () => {
      try {
        const res = await fetch("api/user/instructor", {
          method: "GET",
        });
        const data = await res.json();
        console.log("Instructor data:", data);
        setinstructor(data.data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };
    getInstructors();

    getCategory();
  }, []);
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center justify-left mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 mr-1 ${
              star <= Math.round(rating)
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

  // mobile sidebar responsive 
      const [toggleFilter, setToggleFilter] = useState(true);
      const handleToggleFilter = ()=>{
        setToggleFilter(!toggleFilter)
      }
    const [toggleClose, setToggleClose] = useState(false);
    const handleClose = () => {
      setToggleClose(toggleClose);
    };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-navy-900">
            Explore Courses
          </h1>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <span>Courses</span>
            <span className="mx-2">→</span>
            <span>Explore the course & grow up your skill</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:block hidden md:col-span-1 relative">
            <div className="space-y-8 sticky top-28">
              {/* Search */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-4">Search</h3>
                <div className="flex">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Rechercher des cours..."
                    className="rounded-r-none focus-visible:ring-0 border-r-0"
                  />
                  <Button
                    variant="default"
                    className="rounded-l-none bg-coral-500 hover:bg-coral-600"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Course Categories */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-4">Course Categories</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {catagoryData?.length === 0
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="flex flex-col space-y-3">
                            <Skeleton className="h-10 w-[500px] rounded-xl" />
                          </div>
                        ))
                    : catagoryData?.map((category) => (
                        <div
                          key={category._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={category._id}
                              checked={selectedCategoryId === category._id}
                              onCheckedChange={() =>
                                handleCategoryCheckboxChange(category._id)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={category._id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {category.categoryName}
                            </label>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({category.courseCount})
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Instructors */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-4">Instructors</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                  {instructors?.length === 0
                    ? Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <div key={index} className="flex flex-col space-y-3">
                            <Skeleton className="h-10 w-[500px] rounded-xl" />
                          </div>
                        ))
                    : instructors?.map((instructor) => (
                        <div
                          key={instructor._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={instructor._id}
                              checked={selectedInstructorId === instructor._id}
                              onCheckedChange={() =>
                                handleCheckboxChange(instructor._id)
                              }
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={instructor._id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {instructor.name}
                            </label>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({instructor.coursesCount})
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Prices */}
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="font-medium mb-4">Prices With Courses</h3>

                {courseLevel?.map((level) => (
                  <div
                    key={level.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 space-y-2">
                      <Checkbox
                        id={level.id}
                        checked={seletedCourseLevel === level.id}
                        onCheckedChange={() =>
                          handleCourseLevelChange(level.id)
                        }
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={level.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {level.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          
                {/* mobile responsive left sidebar  */}
          {
            !toggleFilter && (
                <div className="bg-black w-full h-full bg-opacity-70 fixed top-0 left-0 z-[9999]">
                    <button
                      id="toggleClose"
                      onClick={handleToggleFilter}
                      className="fixed top-2 right-4 z-[100] rounded-full bg-white p-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 fill-red-600"
                        viewBox="0 0 320.591 320.591"
                      >
                        <path
                          d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                          data-original="#000000"
                        ></path>
                      </svg>
                    </button>
                    <div className="block lg:hidden h-full w-72 bg-white overflow-scroll  p-5">
                        <div className="md:col-span-1 relative">
                          <div className="space-y-8 sticky top-28">
                            {/* Search */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h3 className="font-medium mb-4">Search</h3>
                              <div className="flex">
                                <Input
                                  type="text"
                                  value={searchTerm}
                                  onChange={handleInputChange}
                                  placeholder="Rechercher des cours..."
                                  className="rounded-r-none focus-visible:ring-0 border-r-0"
                                />
                                <Button
                                  variant="default"
                                  className="rounded-l-none bg-coral-500 hover:bg-coral-600"
                                >
                                  <Search className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>

                            {/* Course Categories */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h3 className="font-medium mb-4">Course Categories</h3>
                              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {catagoryData?.length === 0
                                  ? Array(6)
                                      .fill(0)
                                      .map((_, index) => (
                                        <div key={index} className="flex flex-col space-y-3">
                                          <Skeleton className="h-10 w-[500px] rounded-xl" />
                                        </div>
                                      ))
                                  : catagoryData?.map((category) => (
                                      <div
                                        key={category._id}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={category._id}
                                            checked={selectedCategoryId === category._id}
                                            onCheckedChange={() =>
                                              handleCategoryCheckboxChange(category._id)
                                            }
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                          />
                                          <label
                                            htmlFor={category._id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {category.categoryName}
                                          </label>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          ({category.courseCount})
                                        </span>
                                      </div>
                                    ))}
                              </div>
                            </div>

                            {/* Instructors */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h3 className="font-medium mb-4">Instructors</h3>
                              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {instructors?.length === 0
                                  ? Array(6)
                                      .fill(0)
                                      .map((_, index) => (
                                        <div key={index} className="flex flex-col space-y-3">
                                          <Skeleton className="h-10 w-[500px] rounded-xl" />
                                        </div>
                                      ))
                                  : instructors?.map((instructor) => (
                                      <div
                                        key={instructor._id}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={instructor._id}
                                            checked={selectedInstructorId === instructor._id}
                                            onCheckedChange={() =>
                                              handleCheckboxChange(instructor._id)
                                            }
                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                          />
                                          <label
                                            htmlFor={instructor._id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {instructor.name}
                                          </label>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                          ({instructor.coursesCount})
                                        </span>
                                      </div>
                                    ))}
                              </div>
                            </div>

                            {/* Prices */}
                            <div className="bg-white rounded-lg p-4 shadow-sm border">
                              <h3 className="font-medium mb-4">Prices With Courses</h3>

                              {courseLevel?.map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2 space-y-2">
                                    <Checkbox
                                      id={level.id}
                                      checked={seletedCourseLevel === level.id}
                                      onCheckedChange={() =>
                                        handleCourseLevelChange(level.id)
                                      }
                                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                                    />
                                    <label
                                      htmlFor={level.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {level.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            )
          }

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="lg:flex justify-between items-center mb-6">
              <div className="flex flex-row gap-2">
                
                 <h2 className="text-md lg:text-lg font-medium mb-5 lg:mb-0">
                We found <span className="text-coral-500">{totalCourse}</span>{" "}
                courses for you
              </h2>
              </div>
              
              <div className="flex items-center justify-between lg:gap-4 gap-2">
                 {/* mobile responsive filter button */}
                 <div className=" lg:hidden">
                  <Button
                    onClick={handleToggleFilter}
                    variant="outline"
                    className=" flex items-center font-thin gap-1 px-2 py-0 h-[30px]"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                 </div>
                 {/* mobile button end */}
                <div className="flex items-center gap-2">
                 
                
                  <Select
                    className="px-1 lg:px-5 py-2 lg:py-5"
                    defaultValue="default"
                    onValueChange={(value) => setSortValue(value)}
                  >
                    <SelectTrigger className="w-[100px] lg:w-[140px] h-[30px] lg:p-5 p-2">
                      <SelectValue placeholder="Par défaut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    setSelectedInstructorId(null);
                    setSelectedCategoryId(null);
                    setSearchTerm("");
                    setseletedCourseLevel(null);
                    setSortValue("default");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="flex items-center gap-2 text-sm font-medium border-gray-300 hover:bg-gray-100 px-1 lg:px-5 h-[30px] lg:h-[40px]"
                >
                  <FilterX className=" w-3 h-3 lg:w-4 lg:h-4" />
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseData === null ? (
                // Show loading skeletons
                Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-80 w-[300px] rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))
              ) : courseData.length === 0 ? (
                // Show "No data found" message
                <div className="text-center text-gray-500 col-span-full py-10 text-lg">
                  No courses found.
                </div>
              ) : (
                courseData.map((course) => (
                  <Card
                    className="w-full bg-blue-50/25 border-dashed border-[#c5b5ff] rounded-xl overflow-hidden p-5 transition-all duration-300 hover:shadow-xl"
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
                        <h5 className=" py-2 px-3 text-gray-300 text-xs bg-[#17254E] absolute bottom-3 left-3 rounded-md">
                          {course.category?.categoryName}
                        </h5>
                      </CardHeader>
                      <CardContent className="mt-3 pb-2 px-0">
                        <div className="flex justify-between items-center">
                          <RatingStars
                            rating={course.averageRating}
                          ></RatingStars>
                          <h5 className=" w-fit text-md py-1 mt-3 text-[--primary] font-semibold  ">
                            {course.discount ? (
                              <span>
                                <del className="font-normal text-md mr-2">
                                  ${course.discount}
                                </del>
                                ${course.price}
                              </span>
                            ) : (
                              <span className="text-md">${course.price}</span>
                            )}
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

                        <div className="lg:flex justify-between items-center mt-5">
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
                          <Button className="mt-2 text-sm font-normal h-8 bg-[--primary] px-3 py-0 rounded-full hover:bg-[--primary]  hover:text-white  text-white ">
                            Enroll <ArrowRight className="text-xs w-5 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))
              )}
            </div>
         
       {courseData &&  <GlobalPagination
           currentPage={currentPage}
           totalPages={totalPages}
           totalItems={totalPages * 10} // or real total count from backend
           currentPageDataLength={courseData.length}
           onPageChange={(page) => setCurrentPage(page)}
         />
       }
         
         
          </div>
        </div>
      </div>


   



      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}



