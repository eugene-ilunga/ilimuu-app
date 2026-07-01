"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBootcampDetails } from "@/hooks/useBootcampHooks";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Award,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function BootcampEnrollmentPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bootcampId = params?.id || searchParams.get("id");

  console.log("Enrollment Page - Bootcamp ID:", bootcampId);
  console.log("Enrollment Page - Params:", params);

  const { bootcamp, loading, error } = useBootcampDetails(bootcampId);
  const { paymentMethods } = usePaymentMethod();
  const [enrollmentData, setEnrollmentData] = useState({
    paymentMethod: null,
    agreeToTerms: false,
    agreeToRefund: false,
  });
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollment = async () => {
    if (!enrollmentData.agreeToTerms || !enrollmentData.agreeToRefund) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (!enrollmentData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsEnrolling(true);
    const toastId = toast.loading("Processing your enrollment...");
    
    try {
      const formData = new FormData();
      formData.append("bootcampId", bootcampId);
      formData.append("paymentMethod", enrollmentData.paymentMethod.codeName);
      
      const res = await fetch("/api/bootcamp/checkout", {
        method: "POST",
        body: formData,
      });
      
      toast.dismiss(toastId);
      const data = await res.json();

      if (res.status === 200) {
        toast.success("Redirecting to payment gateway...");
        window.location = data.url;
      } else if (res.status === 401) {
        toast.error("User not authenticated! Please login to continue");
      } else if (res.status === 409) {
        toast.error("You are already enrolled in this bootcamp");
      } else if (res.status === 400) {
        toast.error(data.message || "Bootcamp ID is required");
      } else {
        toast.error(data.message || "Enrollment failed. Please try again.");
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalPrice = () => {
    if (!bootcamp) return 0;
    const discountAmount = bootcamp.price * (bootcamp.discount / 100);
    return bootcamp.price - discountAmount;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bootcamp Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The bootcamp you&apos;re trying to enroll in doesn&apos;t exist.
            </p>
            <Button onClick={() => router.push("/bootcamp")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bootcamps
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enroll in Bootcamp</h1>
              <p className="text-gray-600 mt-1">{bootcamp.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrollment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bootcamp Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Bootcamp Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={bootcamp.thumbnail || "/assets/placeholder.jpg"}
                      alt={bootcamp.title}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized={true}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{bootcamp.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{bootcamp.short_description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{bootcamp.duration_weeks} weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{bootcamp.bootcamp_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Max {bootcamp.max_students} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods?.length === 0 ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((method, index) => {
                      const id = `payment_${index}`;
                      return (
                        <div key={index} className="relative">
                          <input
                            className="peer hidden"
                            id={id}
                            type="radio"
                            name="paymentMethod"
                            value={method._id}
                            checked={enrollmentData.paymentMethod?._id === method._id}
                            onChange={() => setEnrollmentData(prev => ({
                              ...prev,
                              paymentMethod: method
                            }))}
                          />
                          <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                          <label
                            className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                            htmlFor={id}
                          >
                            <Image
                              src={method?.image || "/assets/placeholder.jpg"}
                              alt="Moyen de paiement"
                              width={56}
                              height={56}
                              className="object-contain rounded-sm"
                            />
                            <div className="ml-5">
                              <span className="mt-2 font-semibold">{method?.name}</span>
                              <p className="text-slate-500 text-sm leading-6">
                                {method?.description}
                              </p>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={enrollmentData.agreeToTerms}
                      onChange={(e) => setEnrollmentData(prev => ({
                        ...prev,
                        agreeToTerms: e.target.checked
                      }))}
                      className="w-4 h-4 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="refund"
                      checked={enrollmentData.agreeToRefund}
                      onChange={(e) => setEnrollmentData(prev => ({
                        ...prev,
                        agreeToRefund: e.target.checked
                      }))}
                      className="w-4 h-4 mt-1"
                    />
                    <label htmlFor="refund" className="text-sm cursor-pointer">
                      I understand the refund policy and agree to the <a href="#" className="text-blue-600 hover:underline">refund terms</a>
                    </label>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    By enrolling, you commit to attending all sessions and completing the bootcamp requirements.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bootcamp Price</span>
                    <span>${bootcamp.price.toFixed(2)}</span>
                  </div>
                  
                  {bootcamp.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({bootcamp.discount}%)</span>
                      <span>-${(bootcamp.price * bootcamp.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>$0.00</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Award className="w-4 h-4" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Users className="w-4 h-4" />
                    <span>Lifetime access to materials</span>
                  </div>
                </div>

                <Button 
                  onClick={handleEnrollment}
                  disabled={!enrollmentData.agreeToTerms || !enrollmentData.agreeToRefund || !enrollmentData.paymentMethod || isEnrolling}
                  className="w-full bg-[#5F0EB3] hover:bg-[#4B0B8E] text-white font-semibold text-base py-6 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isEnrolling ? (
                    "Processing..."
                  ) : (
                    `Enroll Now - $${getTotalPrice().toFixed(2)}`
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500">
                  <p>Secure payment processing</p>
                  <p>Your payment information is encrypted</p>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Application deadline: {formatDate(bootcamp.application_deadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Start date: {formatDate(bootcamp.start_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>End date: {formatDate(bootcamp.end_date)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}