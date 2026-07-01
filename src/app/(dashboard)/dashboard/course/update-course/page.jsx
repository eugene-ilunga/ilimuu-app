"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Upload, SquarePlus, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import ChipInput from "@/components/chipsInput";
import { uploadImage } from "@/utils/upload-image";
import SelectField from "@/components/selectField";
import TextareaList from "@/components/textarea-dynmaic";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import useCourseData from "@/hooks/useCourseSelectors";
import Image from "next/image";

const EditCourse = () => {
  return (
    <Suspense>
      <Edit />
    </Suspense>
  );
};
export default EditCourse;

const Edit = () => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("key");

  const courseData = JSON.parse(data);

  const [chips, setChips] = useState(courseData.courseTags);
  const [inputValue, setInputValue] = useState("");

  const [isCertificateAvailable, setIsCertificateAvailable] = useState(
    courseData.cetification
  );

  

  const [course, setCourse] = useState({
    title: courseData.title,
    short_description: courseData.short_description,
    description: courseData.description,
    thumbnail: courseData.thumbnail,
    overview_video: courseData.overview_video,
    price: courseData.price,
    discount: courseData.discount,
    duration: courseData.duration,
    level: courseData.level,
    course_type: courseData.course_type,
    session_type: courseData.session_type,
    courseTags: courseData.courseTags,
    language: courseData.language,
    totalSeat: courseData.totalSeat,
    requirements: courseData.requirements,
    courseIncludes: courseData.courseIncludes,
    cetification: courseData.cetification,
    outcomes: courseData.outcomes,
    courseTags: courseData.courseTags,
    instructor: courseData.instructor,
    category: courseData.category._id,
    subCategory: courseData.subCategory,
    status: courseData.status,
  });

  const [requirements, setRequirements] = useState(courseData.requirements);
  const [outcomes, setOutcomes] = useState(courseData.outcomes);
  const [courseIncludes, setCourseIncludes] = useState(
    courseData.courseIncludes
  );

  const handleCategoryChange = (value) => {
    setCourse({ ...course, category: value });
    setSubCategoryData(categoryData.find((c) => c._id === value).subCategory);
  };
  const handleSubCategory = (value) => {
    setCourse({ ...course, subCategory: value });
  };

  const handleLevelChange = (value) => {
    setCourse({ ...course, level: value });
  };

  const handleCourseTypeChange = (value) => {
    setCourse({ ...course, course_type: value });
  };
    const handleSessionTypeChange = (value) => {
    setCourse({ ...course, session_type: value });
  };
  const handleCheckboxChange = (event) => {
    setIsCertificateAvailable(event.target.checked);
  };

  const {
    categoryData,
    subCategoryData,
    courseTypeData,
    levelData,
    sessionType,
    setSubCategoryData,
  } = useCourseData({ categoryID: courseData.category._id });




  const updateCourse = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("id", courseData._id);

    formData.append("thumbnail", course.thumbnail);
    formData.append("instructor", course.instructor._id);
    formData.append("category", course.category);
    formData.append("subCategory", course.subCategory);
    formData.append("level", course.level);
    formData.append("course_type", course.course_type);
    formData.append("cetification", isCertificateAvailable);
    formData.append("session_type", course.session_type);

    requirements.forEach((requirement) => {
      formData.append("requirements", requirement);
    });
    outcomes.forEach((outcome) => {
      formData.append("outcomes", outcome);
    });
    courseIncludes.forEach((courseInclude) => {
      formData.append("courseIncludes", courseInclude);
    });

    chips.forEach((chip) => {
      formData.append("courseTags", chip);
    });

    setSubmitting(true);
    const toastId = toast.loading("Update course...");

    try {
      const res = await fetch("/api/course/update", {
        method: "POST",
        body: formData,
        agent_name: "web",
      });

      setSubmitting(false);

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { id } = await res.json();
      toast.success("Update course successfully", { id: toastId });

      router.push("/dashboard/course");
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Failed to create category: ", error);
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <div>
      <main className="grid flex-1 mt-3 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <form onSubmit={updateCourse} className="grid gap-4 py-4">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/course">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>

              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Add Course
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                New
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Link href="/dashboard/course">
                  <Button variant="outline" size="sm">
                    Discard
                  </Button>
                </Link>
                <Button type="submit" size="sm" className="text-white">
                  {" "}
                  Save Course
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                    <CardDescription>
                      Add course details info here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          defaultValue={course.title}
                          name="title"
                          type="text"
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="title">Short Description</Label>
                        <Textarea
                          defaultValue={course.short_description}
                          name="short_description"
                          required
                          className="min-h-15"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          defaultValue={course.description}
                          name="description"
                          required
                          className="min-h-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>More Info</CardTitle>
                    <CardDescription>
                      Add more info about the course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="price">Price $</Label>
                        <Input
                          defaultValue={course.price}
                          name="price"
                          type="number"
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="discount">Discount %</Label>
                        <Input
                          defaultValue={course.discount}
                          name="discount"
                          type="number"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="totalSeat">Total Seat</Label>
                        <Input
                          defaultValue={course.totalSeat}
                          name="totalSeat"
                          type="number"
                          placeholder="50"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="duration">Total Duration </Label>
                        <Input
                          defaultValue={course.duration}
                          name="duration"
                          type="text"
                          placeholder="3 hr 50 min"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="overview_video">Overview Video</Label>
                      <Input
                        defaultValue={course.overview_video}
                        name="overview_video"
                        type="text"
                        placeholder="https://youtube.com/intro_video"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-3">
                      <Checkbox
                        id="terms"
                        checked={isCertificateAvailable}
                        onChange={handleCheckboxChange} // Attach the onChange handler
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Certificate Available
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Requiremnet & Outcome</CardTitle>
                    <CardDescription>
                      Add course Requirement & Outcome info here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <TextareaList
                        label="Requirement"
                        items={requirements}
                        setItems={setRequirements}
                        handleAddNew={() =>
                          setRequirements([...requirements, ""])
                        }
                      />

                      <TextareaList
                        label="Outcomes"
                        items={outcomes}
                        setItems={setOutcomes}
                        handleAddNew={() => setOutcomes([...outcomes, ""])}
                      />

                      <TextareaList
                        label="Course Includes"
                        items={courseIncludes}
                        setItems={setCourseIncludes}
                        handleAddNew={() =>
                          setCourseIncludes([...courseIncludes, ""])
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle> Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <SelectField
                        label="Catégorie"
                        options={categoryData}
                        value={course.category}
                        field="categoryName"
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                      />

                      <SelectField
                        label="Sub Category"
                        options={subCategoryData}
                        value={course.subCategory}
                        field={""}
                        onChange={handleSubCategory}
                        placeholder="Select Sub-Category"
                      />

                      <ChipInput
                        label="Course Tag"
                        chips={chips}
                        setChips={setChips}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        maxChips={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Course Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <SelectField
                        label="Course Level"
                        options={levelData}
                        value={course.level}
                        field={""}
                        onChange={handleLevelChange}
                        placeholder="Select level"
                      />
                      <SelectField
                        label="Course Type"
                        options={courseTypeData}
                        value={course.course_type}
                        field={"name"}
                        onChange={handleCourseTypeChange}
                        placeholder="Select type"
                      />


                          <SelectField
                        label="Session Type"
                        options={sessionType}
                        value={course.session_type}
                        field={""}
                        onChange={handleSessionTypeChange}
                        placeholder="Select Session"
                      />

                      <div className="grid gap-3">
                        <Label htmlFor="Language">Course Language</Label>
                        <Input
                          defaultValue={course.language}
                          name="language"
                          type="text"
                          placeholder="English"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Course Thumbnail</CardTitle>
                    <CardDescription>
                      Make sure the thumbnail is clear and attractive
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Course image"
                        className="aspect-square w-full rounded-md object-cover"
                        src={
                          course.thumbnail
                            ? course.thumbnail
                            : "/assets/placeholder.jpg"
                        }
                        width={300}
                        height={300}
                        loading="lazy"
                      />
                      {uploading && <Progress value={uploadProgress} />}{" "}
                      {/* Display progress bar when uploading */}
                      <Input
                        id="thumbnail"
                        type="file"
                        onChange={handleImageChange}
                        className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                      ></Input>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button type="submit" size="sm" className="text-white">
                {" "}
                Save Course
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
