"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBootcampDetails } from "@/hooks/useBootcampHooks";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  Shield,
  Award,
  GraduationCap,
  BookOpen,
  Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampCheckoutPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootcampId = params?.id || searchParams.get("id");

  const { bootcamp, loading, error } = useBootcampDetails(bootcampId);
  const { paymentMethods } = usePaymentMethod();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState({
    motivation_letter: "",
    experience_level: "",
    goals: "",
    availability: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotal = () => {
    if (!bootcamp) return 0;
    const basePrice = bootcamp.price;
    const discount = bootcamp.discount || 0;
    const discountAmount = (discount / 100) * basePrice;
    return Math.max(0, basePrice - discountAmount);
  };

  const isApplicationOpen = () => {
    if (!bootcamp) return false;
    return new Date() < new Date(bootcamp.application_deadline);
  };

  const isBootcampFull = () => {
    if (!bootcamp) return false;
    return (bootcamp.enrolled_students?.length || 0) >= bootcamp.max_students;
  };

  const handleEnrollment = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!enrollmentData.motivation_letter || !enrollmentData.experience_level || 
        !enrollmentData.goals || !enrollmentData.availability) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreedToTerms || !agreedToRefund) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing your enrollment...");

    try {
      // First, submit the application
      const applicationFormData = new FormData();
      applicationFormData.set("bootcampId", bootcampId);
      applicationFormData.set("motivation_letter", enrollmentData.motivation_letter);
      applicationFormData.set("experience_level", enrollmentData.experience_level);
      applicationFormData.set("goals", enrollmentData.goals);
      applicationFormData.set("availability", enrollmentData.availability);
      applicationFormData.set("portfolio_url", enrollmentData.portfolio_url);
      applicationFormData.set("linkedin_url", enrollmentData.linkedin_url);
      applicationFormData.set("github_url", enrollmentData.github_url);

      const applicationRes = await fetch("/api/bootcamp/enroll", {
        method: "POST",
        body: applicationFormData,
      });

      const applicationData = await applicationRes.json();

      if (applicationData.status !== 201) {
        throw new Error(applicationData.message || "Failed to submit application");
      }

      // Then, process payment
      const paymentFormData = new FormData();
      paymentFormData.set("bootcampId", bootcampId);
      paymentFormData.set("paymentMethod", selectedPaymentMethod.codeName);
      paymentFormData.set("discount", bootcamp.discount || 0);

      const paymentRes = await fetch("/api/bootcamp/checkout", {
        method: "POST",
        body: paymentFormData,
      });

      const paymentData = await paymentRes.json();

      toast.dismiss(toastId);

      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        toast.success("Enrollment successful! Redirecting to dashboard...");
        router.push(`/bootcamp/${bootcampId}/dashboard`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Enrollment error:", error);
      toast.error(error.message || "Failed to process enrollment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bootcamp Not Found</h1>
        <p className="text-gray-600 mb-6">The bootcamp you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button asChild>
          <Link href="/bootcamp">Browse Bootcamps</Link>
        </Button>
      </div>
    );
  }

  if (!isApplicationOpen()) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Closed</h1>
        <p className="text-gray-600 mb-6">
          The application deadline for this bootcamp has passed.
        </p>
        <Button asChild>
          <Link href="/bootcamp">Browse Other Bootcamps</Link>
        </Button>
      </div>
    );
  }

  if (isBootcampFull()) {
    return (
      <div className="p-6 text-center">
        <Users className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bootcamp Full</h1>
        <p className="text-gray-600 mb-6">
          This bootcamp has reached its maximum capacity. You can apply to be added to the waitlist.
        </p>
        <Button asChild>
          <Link href="/bootcamp">Browse Other Bootcamps</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/bootcamp/${bootcampId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bootcamp
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enroll in Bootcamp</h1>
          <p className="text-gray-600 mt-1">Complete your application and payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bootcamp Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Bootcamp Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={bootcamp.thumbnail}
                  alt={bootcamp.title}
                  width={80}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{bootcamp.title}</h3>
                  <p className="text-gray-600">{bootcamp.short_description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span><strong>Start:</strong> {formatDate(bootcamp.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span><strong>End:</strong> {formatDate(bootcamp.end_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span><strong>Duration:</strong> {bootcamp.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span><strong>Students:</strong> {bootcamp.enrolled_students?.length || 0}/{bootcamp.max_students}</span>
                </div>
              </div>

              {bootcamp.phases && bootcamp.phases.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Bootcamp Phases</h4>
                  <div className="space-y-2">
                    {bootcamp.phases.map((phase, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Phase {phase.phase_number}: {phase.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Application Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="experience_level">Experience Level *</Label>
                <Select
                  value={enrollmentData.experience_level}
                  onValueChange={(value) => setEnrollmentData(prev => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="motivation_letter">Motivation Letter *</Label>
                <Textarea
                  id="motivation_letter"
                  placeholder="Dites-nous pourquoi vous voulez rejoindre ce bootcamp..."
                  value={enrollmentData.motivation_letter}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, motivation_letter: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="goals">Goals *</Label>
                <Textarea
                  id="goals"
                  placeholder="Qu'espérez-vous accomplir ?"
                  value={enrollmentData.goals}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Textarea
                  id="availability"
                  placeholder="Décrivez votre disponibilité..."
                  value={enrollmentData.availability}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, availability: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="portfolio_url">Portfolio URL</Label>
                  <Input
                    id="portfolio_url"
                    placeholder="https://portfolio.com"
                    value={enrollmentData.portfolio_url}
                    onChange={(e) => setEnrollmentData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/votre-profil"
                    value={enrollmentData.linkedin_url}
                    onChange={(e) => setEnrollmentData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    placeholder="https://github.com/votre-profil"
                    value={enrollmentData.github_url}
                    onChange={(e) => setEnrollmentData(prev => ({ ...prev, github_url: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment & Summary */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod?._id === method._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      <div className="ml-auto">
                        {selectedPaymentMethod?._id === method._id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Bootcamp Price</span>
                  <span>${bootcamp.price}</span>
                </div>
                {bootcamp.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({bootcamp.discount}%)</span>
                    <span>-${((bootcamp.discount / 100) * bootcamp.price).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  Your payment is secure and encrypted. We use industry-standard security measures.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the <Link href="/terms" className="text-blue-600 underline">Terms and Conditions</Link>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="refund"
                    checked={agreedToRefund}
                    onChange={(e) => setAgreedToRefund(e.target.checked)}
                  />
                  <Label htmlFor="refund" className="text-sm">
                    I understand the <Link href="/refund-policy" className="text-blue-600 underline">Refund Policy</Link>
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleEnrollment}
                disabled={isProcessing || !selectedPaymentMethod || !agreedToTerms || !agreedToRefund}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Enroll Now - ${calculateTotal().toFixed(2)}
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>You will be redirected to complete your payment</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
