"use client";

import { useState } from "react";
import { useBootcampEnrollment } from "@/hooks/useBootcampHooks";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  FileText,
  Target,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const BootcampEnrollmentForm = ({ bootcamp, onSuccess }) => {
  const { enrollInBootcamp, loading, error } = useBootcampEnrollment();
  const [formData, setFormData] = useState({
    motivation_letter: "",
    experience_level: "",
    goals: "",
    availability: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.motivation_letter.trim()) {
      errors.motivation_letter = "Motivation letter is required";
    } else if (formData.motivation_letter.length < 100) {
      errors.motivation_letter = "Motivation letter must be at least 100 characters";
    }

    if (!formData.experience_level) {
      errors.experience_level = "Experience level is required";
    }

    if (!formData.goals.trim()) {
      errors.goals = "Goals are required";
    } else if (formData.goals.length < 50) {
      errors.goals = "Goals must be at least 50 characters";
    }

    if (!formData.availability.trim()) {
      errors.availability = "Availability information is required";
    }

    // Validate URLs if provided
    const urlPattern = /^https?:\/\/.+/;
    if (formData.portfolio_url && !urlPattern.test(formData.portfolio_url)) {
      errors.portfolio_url = "Please enter a valid URL starting with http:// or https://";
    }
    if (formData.linkedin_url && !urlPattern.test(formData.linkedin_url)) {
      errors.linkedin_url = "Please enter a valid LinkedIn URL";
    }
    if (formData.github_url && !urlPattern.test(formData.github_url)) {
      errors.github_url = "Please enter a valid GitHub URL";
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

    const result = await enrollInBootcamp(bootcamp._id, formData);
    
    if (result.success) {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      if (onSuccess) {
        onSuccess(result.data);
      }
    } else {
      toast.error(result.error || "Failed to submit application");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to <strong>{bootcamp.title}</strong>. 
            We&apos;ll review your application and get back to you soon.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• You&apos;ll receive an email confirmation shortly</p>
            <p>• Application review typically takes 3-5 business days</p>
            <p>• Check your email for updates on your application status</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/bootcamp'} 
            className="mt-6"
          >
            Browse More Bootcamps
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bootcamp Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Applying to: {bootcamp.title}
          </CardTitle>
          <CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Starts: {formatDate(bootcamp.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{bootcamp.duration_weeks} weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="capitalize">{bootcamp.bootcamp_type}</span>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="mr-2">
                Application deadline: {formatDate(bootcamp.application_deadline)}
              </Badge>
              <Badge variant="secondary">
                {bootcamp.available_spots} spots available
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Application Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Please provide detailed information about yourself and your goals. 
              This helps us understand if this bootcamp is the right fit for you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Motivation Letter */}
            <div className="space-y-2">
              <Label htmlFor="motivation_letter" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Motivation Letter *
              </Label>
              <Textarea
                id="motivation_letter"
                placeholder="Tell us why you want to join this bootcamp and what motivates you to learn these skills. What are your career goals and how do you think this bootcamp will help you achieve them? (Minimum 100 characters)"
                value={formData.motivation_letter}
                onChange={(e) => handleInputChange("motivation_letter", e.target.value)}
                rows={6}
                className={formErrors.motivation_letter ? "border-red-500" : ""}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formData.motivation_letter.length} characters</span>
                {formErrors.motivation_letter && (
                  <span className="text-red-500">{formErrors.motivation_letter}</span>
                )}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="experience_level" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Experience Level *
              </Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => handleInputChange("experience_level", value)}
              >
                <SelectTrigger className={formErrors.experience_level ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your current experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    Beginner - Little to no experience
                  </SelectItem>
                  <SelectItem value="intermediate">
                    Intermediate - Some experience or education
                  </SelectItem>
                  <SelectItem value="advanced">
                    Advanced - Significant experience in the field
                  </SelectItem>
                </SelectContent>
              </Select>
              {formErrors.experience_level && (
                <span className="text-sm text-red-500">{formErrors.experience_level}</span>
              )}
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label htmlFor="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Your Goals *
              </Label>
              <Textarea
                id="goals"
                placeholder="What do you hope to achieve after completing this bootcamp? What specific skills do you want to develop? What kind of role are you targeting? (Minimum 50 characters)"
                value={formData.goals}
                onChange={(e) => handleInputChange("goals", e.target.value)}
                rows={4}
                className={formErrors.goals ? "border-red-500" : ""}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formData.goals.length} characters</span>
                {formErrors.goals && (
                  <span className="text-red-500">{formErrors.goals}</span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label htmlFor="availability" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Availability *
              </Label>
              <Textarea
                id="availability"
                placeholder="Please describe your availability for this bootcamp. Can you commit to the required hours per week? Do you have any scheduling conflicts? Are you available for the full duration?"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                rows={3}
                className={formErrors.availability ? "border-red-500" : ""}
              />
              {formErrors.availability && (
                <span className="text-sm text-red-500">{formErrors.availability}</span>
              )}
            </div>

            {/* Optional URLs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Portfolio & Social Links (Optional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="portfolio_url" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Portfolio URL
                </Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_url}
                  onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                  className={formErrors.portfolio_url ? "border-red-500" : ""}
                />
                {formErrors.portfolio_url && (
                  <span className="text-sm text-red-500">{formErrors.portfolio_url}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  className={formErrors.linkedin_url ? "border-red-500" : ""}
                />
                {formErrors.linkedin_url && (
                  <span className="text-sm text-red-500">{formErrors.linkedin_url}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  className={formErrors.github_url ? "border-red-500" : ""}
                />
                {formErrors.github_url && (
                  <span className="text-sm text-red-500">{formErrors.github_url}</span>
                )}
              </div>
            </div>

            {/* Important Notes */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Applications are reviewed on a rolling basis. 
                Early applications have a better chance of acceptance. Make sure to 
                complete all required fields thoughtfully.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Application
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default BootcampEnrollmentForm;
