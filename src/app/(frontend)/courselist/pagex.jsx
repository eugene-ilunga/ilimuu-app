"use client";
import { useCallback, useState } from "react";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const sortOptions = [
  { name: "Les plus populaires", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Prix : croissant", href: "#", current: false },
  { name: "Prix : décroissant", href: "#", current: false },
];

const subCategories = [
  { name: "Totes", href: "#" },
  { name: "Backpacks", href: "#" },
  { name: "Travel Bags", href: "#" },
  { name: "Hip Bags", href: "#" },
  { name: "Laptop Sleeves", href: "#" },
];

const filters = [
  {
    id: "langugage",
    name: "Language",
    options: [
      { value: "English", label: "English", checked: false },
      { value: "Bangla", label: "Bangla", checked: false },
      { value: "Arabic", label: "Arabic", checked: true },
      { value: "Spanish", label: "Spanish", checked: false },
      { value: "Hindi", label: "Hindi", checked: false },
      { value: "Portugues", label: "Portugues", checked: false },
    ],
  },
  {
    id: "category",
    name: "Catégorie",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "type",
    name: "Type",
    options: [
      { value: "Gratuit", label: "Gratuit", checked: false },
      { value: "Paid", label: "Paid", checked: false },
      { value: "Subscription", label: "Subscription", checked: false },

    ],
  },
];
import { useEffect,Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {

  Card,
  CardContent,
  CardFooter,
  CardHeader,

} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookText, Clock, Star, Users } from "lucide-react";



//wrapped suspended function in useCallback to prevent unnecessary re-renders

export default function courseList(){
  return <Suspense fallback={<Skeleton className="h-80 w-[300px] rounded-xl" />}>
    <AllCourse />
  </Suspense>
}

 function AllCourse() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    color: false,
    category: false,
    size: false,
  });

  const [Sort, setSort] = useState(false);

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // State to hold the sort
  const handleSort = () => {
    setSort(!Sort);
  };

  const toggleSection = (sectionId) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const toggleFilterOption = (sectionId, optionIdx) => {
    const updatedFilters = filters.map((section) => {
      if (section.id === sectionId) {
        const updatedOptions = section.options.map((option, idx) => {
          if (idx === optionIdx) {
            return {
              ...option,
              checked: !option.checked,
            };
          }
          return option;
        });
        return {
          ...section,
          options: updatedOptions,
        };
      }
      return section;
    });
    // Update the state with the new filters
    setFiltersState(updatedFilters);
  };

  const [courseData, setCourseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();


  const fetchCourses = useCallback(async () => {
    try {
      const searchQuery = searchParams.get("search") || "";
      const formdata = new FormData();
      formdata.set("search", searchQuery);
      formdata.set("page", currentPage);
      formdata.set("pagination", 9);

      const res = await fetch("/api/course", {
        cache: "no-store",
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      setCourseData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  }, [currentPage, searchParams]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const [catagoryData, setCatagoryData] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const formdata = new FormData();
        formdata.set("page", 1);
        formdata.set("pagination", 5);
        const res = await fetch("api/category", {
          method: "POST",
          body: formdata,

        });

        const data = await res.json();
        console.log("Category data:", data);
        setCatagoryData(data.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    getCategory();
  }, []);

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
          {rating.toFixed(1)}k
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="relative">
        {/* Mobile filter dialog */}
        {mobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
        )}

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-2">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6 lg:pt-24">
            <h1 className="text-xl lg:text-4xl font-bold tracking-tight text-gray-900">
              All Course
            </h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    onClick={handleSort}
                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sort
                    <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  </button>
                </div>
                {Sort && (
                  <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <a
                          key={option.name}
                          href={option.href}
                          className={`block px-4 py-2 text-sm ${option.current
                            ? "font-medium text-gray-900"
                            : "text-gray-500"
                            }`}
                        >
                          {option.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={toggleMobileFilters}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-4 lg:pb-24 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {catagoryData.length == 0 ? (Array(8)
                    .fill(0)
                    .map((_, index) => (

                      <Skeleton key={index} className="h-4 w-[150px]" />

                    ))) : (catagoryData.map((category) => (
                      <li key={category.categoryName}>
                        <button >{category.categoryName}</button>
                      </li>
                    )))}
                </ul>

                {filters.map((section) => (
                  <div
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      >
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          {openSections[section.id] ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    </h3>
                    {openSections[section.id] && (
                      <div className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                value={option.value}
                                type="checkbox"
                                checked={option.checked}
                                onChange={() =>
                                  toggleFilterOption(section.id, optionIdx)
                                }
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 text-sm text-gray-600"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* grid course compnant here */}
                <section
                  id="Projects"
                  className=" mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-6 lg:gap-y-20 gap-x-6 mb-5"
                >
                  {courseData.length === 0 ? (Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-80 w-[300px] rounded-xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>

                    ))) : (courseData.map((course) => (
                     
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
                                  course.discount ? (
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
                                <span className="font-normal text-xs text-gray-600">Lesson 10</span>
                              </div>

                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs">10:30m</span>
                              </div>

                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="text-xs">Students 20+</span>
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
                              <Button className='mt-2 text-sm font-normal h-8 bg-[--primary] px-3 py-0 rounded-full hover:bg-[--primary]  hover:text-white  text-white '>Enroll <ArrowRight className='text-xs w-5 h-4' /></Button>

                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    )))}

                </section>

                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
                    <strong>{(currentPage - 1) * 5 + 5}</strong> Course
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                      </PaginationItem>
                      {[...Array(totalPages).keys()].map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            className='w-5 lg:w-12'
                            onClick={() => setCurrentPage(page + 1)}
                          >
                            {page + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>


              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
