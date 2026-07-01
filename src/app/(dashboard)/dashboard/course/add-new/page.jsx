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
  CardFooter,
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
import useCourseData from "@/hooks/useCourseSelectors";
import Image from "next/image";

const AddCourse = () => {
  const [inputValue, setInputValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const router = useRouter();

  const [chips, setChips] = useState([]);
  const [requirements, setRequirements] = useState([""]);
  const [outcomes, setOutcomes] = useState([""]);
  const [courseIncludes, setCourseIncludes] = useState([""]);
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false);
    const [isFree, setIsFree] = useState(false);

  const [course, setCourse] = useState({
    thumbnail: "",
    level: "",
    instructor: "",
    category: "",
    subCategory: "",
    course_type: "",
    cetification: false,
    session_type:""
  });
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

  const handleCheckboxChange = (value) => {
    setIsCertificateAvailable(value);
  };

  const handleFreeCheckboxChange = (value) => {
    setIsFree(value);
  }


  const {
    categoryData,
    subCategoryData,
    courseTypeData,
    levelData,
    setSubCategoryData,
    sessionType
  } = useCourseData({ categoryID: course.category });


  const createCourse = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("thumbnail", course.thumbnail);
    formData.append("instructor", "");
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

    const toastID = toast.loading("Creating course...");

    try {
      const res = await fetch("/api/course/add-new", {
        method: "POST",
        body: formData,
      });

      toast.dismiss(toastID);
      const data = await res.json();

      if (res.status !== 201) {
        toast.error(`Failed to create course! ${data.message}`);
      } else {
        toast.success("Course created successfully!");
        router.push("/dashboard/course");
      }
    } catch (error) {
      toast.dismiss(toastID);
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file, setUploading, setUploadProgress, setCourse, course);
    }
  };

  return (
    <div>
      <main className="grid flex-1 mt-3 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <form onSubmit={createCourse} className="grid gap-4 py-4">
          <div className=" grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
                          name="title"
                          type="text"
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="title">Short Description</Label>
                        <Textarea
                          name="short_description"
                          required
                          className="min-h-15"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
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
                          name="price"
                          type="number"
                          placeholder="100"
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="discount">Discount %</Label>
                        <Input name="discount" type="number" placeholder="10" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="totalSeat">Total Seat</Label>
                        <Input
                          name="totalSeat"
                          type="number"
                          placeholder="50"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="duration">Total Duration </Label>
                        <Input
                          name="duration"
                          type="text"
                          placeholder="3 hr 50 min"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label htmlFor="overview_video">Overview Video</Label>
                      <Input
                        name="overview_video"
                        type="text"
                        placeholder="https://youtube.com/intro_video"
                      />
                    </div>
                    <div className="grid grid-cols-2">
                    <div className="flex items-center space-x-2 pt-3">
                      <Checkbox
                        id="terms"
                        checked={isCertificateAvailable}
                        onCheckedChange={handleCheckboxChange} // Attach the onChange handler
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Certificate Available
                      </label>
                    </div>

                     <div className="flex items-center space-x-2 pt-3">
                      <Checkbox
                        id="terms"
                        checked={isFree}
                        onCheckedChange={handleFreeCheckboxChange} // Attach the onChange handler
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Free Course
                      </label>
                    </div>
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
                        width={150}
                        height={100}
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
                Save Course
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddCourse;
