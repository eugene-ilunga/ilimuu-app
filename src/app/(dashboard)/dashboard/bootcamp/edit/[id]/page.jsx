"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useBootcampManagement, useBootcampDetails } from "@/hooks/useBootcampHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditBootcampPage() {
  const router = useRouter();
  const params = useParams();
  const bootcampId = params.id;
  
  const { bootcamp, loading: fetchingBootcamp, error: fetchError } = useBootcampDetails(bootcampId);
  const { updateBootcamp, loading, error } = useBootcampManagement();
  
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    thumbnail: "",
    overview_video: "",
    category: "",
    subCategory: "",
    price: "",
    discount: 0,
    duration_weeks: "",
    start_date: "",
    end_date: "",
    application_deadline: "",
    level: "all level",
    language: "English",
    max_students: "",
    bootcamp_type: "",
    days_per_week: "",
    hours_per_day: "",
    requirements: [],
    outcomes: [],
    bootcamp_tags: [],
    prerequisites: [],
    tools_and_technologies: [],
    bootcamp_badge: "new",
    certification: true,
    bootcamp_includes: [
      "Live sessions",
      "Project assignments", 
      "Mentor support",
      "Career guidance",
      "Certificate of completion"
    ],
    phases: [],
    schedule: {
      days_per_week: "",
      hours_per_day: "",
      class_times: []
    },
    career_support: {
      job_placement_assistance: false,
      resume_review: false,
      interview_preparation: false,
      portfolio_building: false,
    },
    co_instructors: [],
  });

  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [currentPhase, setCurrentPhase] = useState({
    phase_number: 1,
    title: "",
    description: "",
    duration_weeks: "",
    learning_objectives: [],
    projects: []
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/all");
        const data = await res.json();
        if (data.status === 200) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Populate form data when bootcamp is fetched
  useEffect(() => {
    if (bootcamp) {
      // Check if days_per_week and hours_per_day are in schedule object or at root level
      const daysPerWeek = bootcamp.days_per_week || bootcamp.schedule?.days_per_week || "";
      const hoursPerDay = bootcamp.hours_per_day || bootcamp.schedule?.hours_per_day || "";
      
      console.log("Bootcamp data:", {
        days_per_week_root: bootcamp.days_per_week,
        hours_per_day_root: bootcamp.hours_per_day,
        schedule: bootcamp.schedule,
        daysPerWeek,
        hoursPerDay
      });
      
      setFormData({
        title: bootcamp.title || "",
        short_description: bootcamp.short_description || "",
        description: bootcamp.description || "",
        thumbnail: bootcamp.thumbnail || "",
        overview_video: bootcamp.overview_video || "",
        category: bootcamp.category?._id || bootcamp.category || "",
        subCategory: bootcamp.subCategory || "",
        price: bootcamp.price || "",
        discount: bootcamp.discount || 0,
        duration_weeks: bootcamp.duration_weeks || "",
        start_date: bootcamp.start_date ? new Date(bootcamp.start_date).toISOString().split('T')[0] : "",
        end_date: bootcamp.end_date ? new Date(bootcamp.end_date).toISOString().split('T')[0] : "",
        application_deadline: bootcamp.application_deadline ? new Date(bootcamp.application_deadline).toISOString().split('T')[0] : "",
        level: bootcamp.level || "all level",
        language: bootcamp.language || "English",
        max_students: bootcamp.max_students || "",
        bootcamp_type: bootcamp.bootcamp_type || "",
        days_per_week: daysPerWeek,
        hours_per_day: hoursPerDay,
        requirements: bootcamp.requirements || [],
        outcomes: bootcamp.outcomes || [],
        bootcamp_tags: bootcamp.bootcamp_tags || [],
        prerequisites: bootcamp.prerequisites || [],
        tools_and_technologies: bootcamp.tools_and_technologies || [],
        bootcamp_badge: bootcamp.bootcamp_badge || "new",
        certification: bootcamp.certification !== undefined ? bootcamp.certification : true,
        bootcamp_includes: bootcamp.bootcamp_includes || [
          "Live sessions",
          "Project assignments", 
          "Mentor support",
          "Career guidance",
          "Certificate of completion"
        ],
        phases: bootcamp.phases || [],
        schedule: bootcamp.schedule || {
          days_per_week: daysPerWeek,
          hours_per_day: hoursPerDay,
          class_times: []
        },
        career_support: bootcamp.career_support || {
          job_placement_assistance: false,
          resume_review: false,
          interview_preparation: false,
          portfolio_building: false,
        },
        co_instructors: bootcamp.co_instructors || [],
      });
    }
  }, [bootcamp]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const addPhase = () => {
    if (currentPhase.title && currentPhase.description && currentPhase.duration_weeks) {
      setFormData(prev => ({
        ...prev,
        phases: [...prev.phases, { ...currentPhase }]
      }));
      setCurrentPhase({
        phase_number: formData.phases.length + 2,
        title: "",
        description: "",
        duration_weeks: "",
        learning_objectives: [],
        projects: []
      });
    }
  };

  const removePhase = (index) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields
    const requiredFields = [
      'title', 'short_description', 'description', 'thumbnail', 'overview_video',
      'category', 'subCategory', 'price', 'duration_weeks', 'start_date', 'end_date',
      'application_deadline', 'max_students', 'bootcamp_type', 'days_per_week', 'hours_per_day'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        errors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    // Date validation
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const applicationDeadline = new Date(formData.application_deadline);

    if (endDate <= startDate) {
      errors.end_date = "End date must be after start date";
    }

    if (applicationDeadline >= startDate) {
      errors.application_deadline = "Application deadline must be before start date";
    }

    // Numeric validation
    if (formData.duration_weeks < 4) {
      errors.duration_weeks = "Duration must be at least 4 weeks";
    }

    if (formData.max_students < 5 || formData.max_students > 100) {
      errors.max_students = "Maximum students must be between 5 and 100";
    }

    if (formData.days_per_week < 3 || formData.days_per_week > 7) {
      errors.days_per_week = "Days per week must be between 3 and 7";
    }

    if (formData.hours_per_day < 2 || formData.hours_per_day > 8) {
      errors.hours_per_day = "Hours per day must be between 2 and 8";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Prepare data for API - flatten career_support
    const dataToSend = {
      ...formData,
      job_placement_assistance: formData.career_support.job_placement_assistance,
      resume_review: formData.career_support.resume_review,
      interview_preparation: formData.career_support.interview_preparation,
      portfolio_building: formData.career_support.portfolio_building,
    };
    
    // Remove the nested career_support object since we've flattened it
    delete dataToSend.career_support;

    const result = await updateBootcamp(bootcampId, dataToSend);
    
    if (result.success) {
      toast.success("Bootcamp updated successfully!");
      router.push("/dashboard/bootcamp");
    } else {
      toast.error(result.error || "Failed to update bootcamp");
      if (result.errors) {
        setFormErrors(result.errors);
      }
    }
  };

  const bootcampTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "weekend", label: "Weekend" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const levels = [
    { value: "beginner", label: "Débutant" },
    { value: "intermediate", label: "Intermédiaire" },
    { value: "advanced", label: "Avancé" },
    { value: "all level", label: "All Levels" },
  ];

  const badges = [
    { value: "bestseller", label: "Bestseller" },
    { value: "toprated", label: "Top Rated" },
    { value: "new", label: "New" },
    { value: "trending", label: "Trending" },
    { value: "intensive", label: "Intensive" },
  ];

  if (fetchingBootcamp) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading bootcamp...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Bootcamp not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/bootcamp">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Bootcamp</h1>
          <p className="text-gray-600 mt-1">
            Update your bootcamp program details
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          Edit Mode
        </Badge>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about your bootcamp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Bootcamp Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Full-Stack Web Development Bootcamp"
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && (
                  <span className="text-sm text-red-500">{formErrors.title}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <span className="text-sm text-red-500">{formErrors.category}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) => handleInputChange("short_description", e.target.value)}
                placeholder="Brief description of the bootcamp (1-2 sentences)"
                rows={3}
                className={formErrors.short_description ? "border-red-500" : ""}
              />
              {formErrors.short_description && (
                <span className="text-sm text-red-500">{formErrors.short_description}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detailed description of what students will learn and achieve"
                rows={6}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && (
                <span className="text-sm text-red-500">{formErrors.description}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category *</Label>
                <Input
                  id="subCategory"
                  value={formData.subCategory}
                  onChange={(e) => handleInputChange("subCategory", e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className={formErrors.subCategory ? "border-red-500" : ""}
                />
                {formErrors.subCategory && (
                  <span className="text-sm text-red-500">{formErrors.subCategory}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  placeholder="e.g., English, Spanish"
                  className={formErrors.language ? "border-red-500" : ""}
                />
                {formErrors.language && (
                  <span className="text-sm text-red-500">{formErrors.language}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                  placeholder="999"
                  className={formErrors.price ? "border-red-500" : ""}
                />
                {formErrors.price && (
                  <span className="text-sm text-red-500">{formErrors.price}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleInputChange("discount", parseFloat(e.target.value))}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_weeks">Duration (weeks) *</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) => handleInputChange("duration_weeks", parseInt(e.target.value))}
                  placeholder="12"
                  min="4"
                  className={formErrors.duration_weeks ? "border-red-500" : ""}
                />
                {formErrors.duration_weeks && (
                  <span className="text-sm text-red-500">{formErrors.duration_weeks}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bootcamp_type">Bootcamp Type *</Label>
                <Select
                  value={formData.bootcamp_type}
                  onValueChange={(value) => handleInputChange("bootcamp_type", value)}
                >
                  <SelectTrigger className={formErrors.bootcamp_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bootcampTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.bootcamp_type && (
                  <span className="text-sm text-red-500">{formErrors.bootcamp_type}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="days_per_week">Days per Week *</Label>
                <Input
                  id="days_per_week"
                  type="number"
                  value={formData.days_per_week}
                  onChange={(e) => handleInputChange("days_per_week", parseInt(e.target.value))}
                  placeholder="5"
                  min="3"
                  max="7"
                  className={formErrors.days_per_week ? "border-red-500" : ""}
                />
                {formErrors.days_per_week && (
                  <span className="text-sm text-red-500">{formErrors.days_per_week}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours_per_day">Hours per Day *</Label>
                <Input
                  id="hours_per_day"
                  type="number"
                  value={formData.hours_per_day}
                  onChange={(e) => handleInputChange("hours_per_day", parseInt(e.target.value))}
                  placeholder="8"
                  min="2"
                  max="8"
                  className={formErrors.hours_per_day ? "border-red-500" : ""}
                />
                {formErrors.hours_per_day && (
                  <span className="text-sm text-red-500">{formErrors.hours_per_day}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_students">Max Students *</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => handleInputChange("max_students", parseInt(e.target.value))}
                  placeholder="25"
                  min="5"
                  max="100"
                  className={formErrors.max_students ? "border-red-500" : ""}
                />
                {formErrors.max_students && (
                  <span className="text-sm text-red-500">{formErrors.max_students}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline *</Label>
                <Input
                  id="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleInputChange("application_deadline", e.target.value)}
                  className={formErrors.application_deadline ? "border-red-500" : ""}
                />
                {formErrors.application_deadline && (
                  <span className="text-sm text-red-500">{formErrors.application_deadline}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  className={formErrors.start_date ? "border-red-500" : ""}
                />
                {formErrors.start_date && (
                  <span className="text-sm text-red-500">{formErrors.start_date}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  className={formErrors.end_date ? "border-red-500" : ""}
                />
                {formErrors.end_date && (
                  <span className="text-sm text-red-500">{formErrors.end_date}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL *</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={formErrors.thumbnail ? "border-red-500" : ""}
                />
                {formErrors.thumbnail && (
                  <span className="text-sm text-red-500">{formErrors.thumbnail}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="overview_video">Overview Video URL *</Label>
                <Input
                  id="overview_video"
                  value={formData.overview_video}
                  onChange={(e) => handleInputChange("overview_video", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={formErrors.overview_video ? "border-red-500" : ""}
                />
                {formErrors.overview_video && (
                  <span className="text-sm text-red-500">{formErrors.overview_video}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bootcamp_badge">Badge</Label>
                <Select
                  value={formData.bootcamp_badge}
                  onValueChange={(value) => handleInputChange("bootcamp_badge", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select badge" />
                  </SelectTrigger>
                  <SelectContent>
                    {badges.map((badge) => (
                      <SelectItem key={badge.value} value={badge.value}>
                        {badge.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certification"
                  checked={formData.certification}
                  onCheckedChange={(checked) => handleInputChange("certification", checked)}
                />
                <Label htmlFor="certification">Provide certificate of completion</Label>
              </div>

              <div className="space-y-3">
                <Label>Career Support Options</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="job_placement"
                      checked={formData.career_support.job_placement_assistance}
                      onCheckedChange={(checked) => 
                        handleInputChange("career_support", {
                          ...formData.career_support,
                          job_placement_assistance: checked
                        })
                      }
                    />
                    <Label htmlFor="job_placement">Job Placement Assistance</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="resume_review"
                      checked={formData.career_support.resume_review}
                      onCheckedChange={(checked) => 
                        handleInputChange("career_support", {
                          ...formData.career_support,
                          resume_review: checked
                        })
                      }
                    />
                    <Label htmlFor="resume_review">Resume Review</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interview_prep"
                      checked={formData.career_support.interview_preparation}
                      onCheckedChange={(checked) => 
                        handleInputChange("career_support", {
                          ...formData.career_support,
                          interview_preparation: checked
                        })
                      }
                    />
                    <Label htmlFor="interview_prep">Interview Preparation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="portfolio_building"
                      checked={formData.career_support.portfolio_building}
                      onCheckedChange={(checked) => 
                        handleInputChange("career_support", {
                          ...formData.career_support,
                          portfolio_building: checked
                        })
                      }
                    />
                    <Label htmlFor="portfolio_building">Portfolio Building</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/bootcamp")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="text-white"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Update Bootcamp
          </Button>
        </div>
      </form>
    </div>
  );
}

