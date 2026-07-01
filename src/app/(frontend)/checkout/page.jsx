"use client";
import { useCartHooks } from "@/hooks/useCartHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Shield, 
  Lock, 
  CreditCard, 
  ArrowLeft,
  ShoppingBag,
  Check,
  AlertCircle,
  Star,
  Users,
  Clock,
  Info
} from "lucide-react";
import Link from "next/link";

export default function Checkout() {
  const { cartData, loading: cartLoading } = useCartHooks();
  const { paymentMethods, loading: paymentLoading } = usePaymentMethod();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [recommendedCoursesLoading, setRecommendedCoursesLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    coupon: ""
  });

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setRecommendedCoursesLoading(true);
      try {
        // Get course IDs that are already in cart
        const cartCourseIds = cartData?.data?.items?.map(item => 
          item.course?._id?.toString()
        ) || [];

        const formData = new FormData();
        formData.set('page', 1);
        formData.set('pagination', 10); // Fetch more to have enough after filtering
        formData.set('sortValue', 'popular');
        const res = await fetch("/api/course/list", {
          method: "POST",
          body: formData
        });
        const courseData = await res.json();
        if (courseData?.data) {
          // Filter out courses that are already in cart
          const filteredCourses = courseData.data.filter(course => 
            !cartCourseIds.includes(course._id?.toString())
          );
          // Take only 3 courses after filtering
          setRecommendedCourses(filteredCourses.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching recommended courses:', error);
      } finally {
        setRecommendedCoursesLoading(false);
      }
    };
    
    // Only fetch if cart data is available or loading is complete
    if (!cartLoading) {
      fetchRecommendedCourses();
    }
  }, [cartData, cartLoading]);

  const handlePlaceOrder = async (dataValue) => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Validate billing address (state and zipCode are optional)
    if (!formData.firstName || !formData.lastName || !formData.address || 
        !formData.city || !formData.country) {
      toast.error("Please fill in all required billing address fields");
      return;
    }

    const toastId = toast.loading("Processing your order...");

    try {
      // Prepare billing address object
      const billingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || null,
        address: formData.address,
        city: formData.city,
        state: formData.state || null,
        zipCode: formData.zipCode || null,
        country: formData.country,
      };

      const requestFormData = new FormData();
      requestFormData.append("paymentMethod", selectedMethod.codeName);
      requestFormData.append("billingAddress", JSON.stringify(billingAddress));
      
      const res = await fetch("/api/course/checkout", {
        method: "POST",
        body: requestFormData,
      });
      toast.dismiss(toastId);

      const data = await res.json();

      if (data) {
        window.location = data.url;
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Error processing your order. Please try again.", {
        id: toastId,
      });
    }
  };

  const calculateSubtotal = () => {
    if (!cartData?.data?.items) return 0;
    return cartData.data.items.reduce((total, item) => {
      return total + (item.course.price || 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm font-medium text-gray-700">Cart</span>
              </div>
              <div className="w-12 h-0.5 bg-emerald-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#5F0EB3] text-white flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <span className="text-sm font-semibold text-[#5F0EB3]">Checkout</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <span className="text-sm font-medium text-gray-500">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {(cartLoading || paymentLoading) ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column Skeleton */}
            <div className="space-y-6">
              {/* Billing Address Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Courses Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
              {/* Order Summary Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex gap-3 pb-3 border-b">
                        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Information & Billing */}
          <div className="space-y-6">
            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing address</CardTitle>
                <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Enter billing address to generate your invoice
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company name <span className="text-gray-400">(Optional)</span></Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Town / City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State <span className="text-gray-400">(Optional)</span></Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip code <span className="text-gray-400">(Optional)</span></Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#5F0EB3]" />
                  You May Also Like
                </CardTitle>
                <CardDescription>
                  Popular courses students also purchased
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedCoursesLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="w-20 h-16 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recommendedCourses.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">
                    No recommendations available.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendedCourses.map((course) => (
                      <Link 
                        key={course._id} 
                        href={`/course/details?id=${course._id}`}
                        className="block"
                      >
                        <div className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#5F0EB3] hover:bg-[#5F0EB3]/5 transition-all cursor-pointer group">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={course?.thumbnail || "/assets/placeholder.jpg"}
                              alt={course?.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-[#5F0EB3] transition-colors">
                              {course?.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              {course?.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[#FC6441] text-[#FC6441]" />
                                  <span>{course.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {course?.students && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{course.students}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline" className="text-xs">
                                {course?.category?.categoryName || "Cours"}
                              </Badge>
                              <span className="font-bold text-[#5F0EB3] text-sm">
                                ${course?.price?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order & Payment */}
          <div className="space-y-6">
            {/* Your Order */}
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!cartData?.data?.items || cartData.data.items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartData.data.items.map((item, index) => (
                      <div key={index} className="flex gap-3 pb-3 border-b">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.course.thumbnail || "/assets/placeholder.jpg"}
                            alt={item.course.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                            {item.course.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.course.short_description || "Course description"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${item.course.price?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="coupon">Redeem Coupon</Label>
                  <Input
                    id="coupon"
                    value={formData.coupon}
                    onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                    placeholder="Code promo"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentLoading ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                ) : paymentMethods?.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">
                    No payment methods available.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paymentMethods.map((item, index) => {
                      const id = `payment_${index}`;
                      const isSelected = selectedMethod?._id === item._id;
                      const isCardMethod = item.codeName?.toLowerCase().includes('card') || item.codeName?.toLowerCase().includes('visa');
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="relative">
                            <input
                              className="peer hidden"
                              id={id}
                              type="radio"
                              name="payment"
                              value={item._id}
                              checked={isSelected}
                              onChange={() => setSelectedMethod(item)}
                            />
                            <label
                              className={`flex cursor-pointer select-none rounded-lg border-2 p-2.5 transition-all ${
                                isSelected
                                  ? "border-[#5F0EB3] bg-[#5F0EB3]/5"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                              htmlFor={id}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? "border-[#5F0EB3] bg-[#5F0EB3]"
                                    : "border-gray-300"
                                }`}>
                                  {isSelected && (
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  )}
                                </div>
                                <div className="relative w-10 h-10 rounded overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                  {item?.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item?.name || "Moyen de paiement"}
                                      width={40}
                                      height={40}
                                      className="object-contain p-1.5"
                                    />
                                  ) : (
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {item?.name}
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>

                          {/* Card Details if Card Payment Selected */}
                          {isSelected && isCardMethod && (
                            <div className="pl-4 space-y-3 border-l-2 border-[#5F0EB3] ml-6">
                              <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card number</Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  value={formData.cardNumber}
                                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                  maxLength={19}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label htmlFor="expiryDate">MM/YY</Label>
                                  <Input
                                    id="expiryDate"
                                    placeholder="12/25"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    maxLength={5}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvc">CVC</Label>
                                  <Input
                                    id="cvc"
                                    placeholder="123"
                                    value={formData.cvc}
                                    onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                                    maxLength={4}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                    <Link href="/privacy-policy" className="text-[#5F0EB3] hover:underline">
                      privacy policy
                    </Link>
                  </p>
                </div>

                {cartData?.data?.items && cartData.data.items.length > 0 && (
                  <Button
                    onClick={() => handlePlaceOrder(cartData)}
                    disabled={!selectedMethod}
                    className="w-full bg-[#5F0EB3] hover:bg-[#4B0B8E] text-white font-semibold py-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    Process to payment →
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
