"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft, Check, ShoppingCart, Plus, Minus, BookOpen, User } from "lucide-react"
import { useCartHooks } from '@/hooks/useCartHooks';
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"


export default function CartPage() {
    // Initial cart data from the API response
    const { cartData, loading } = useCartHooks();

    const removeItem = async (cartId, itemId) => {
        const toastId = toast.loading("Removing item...");
        try {
            const formData = new FormData();
            formData.append("cartId", cartId);
            formData.append("itemId", itemId);
            const res = await fetch(`/api/cart/delete`, {
                method: "DELETE",
                body: formData,
            });

            const data = await res.json();
            if (data.status === 200) {
                toast.success("Item removed from cart", { id: toastId });
                // Reload the page to refresh cart
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                toast.error("Failed to remove item", { id: toastId });
            }
        } catch (error) {
            toast.error("Error removing item", { id: toastId });
        }
    };

    const calculateSubtotal = () => {
        if (!cartData?.data?.items) return 0;
        return cartData.data.items.reduce((total, item) => {
            return total + (item.course?.price || 0);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const tax = 0;
    const total = subtotal + tax;


    // const removeItem = (itemId) => {
    //     const updatedItems = cartData.items.filter((item) => item._id !== itemId)
    //     const newTotal = updatedItems.reduce((sum, item) => sum + item.course.price, 0)

    //     setCartData({ ...cartData, items: updatedItems })
    //     setTotalAmount(newTotal)
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/courselist">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
                        <div className="w-20"></div> {/* Spacer for center alignment */}
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center pb-2">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#5F0EB3] text-white flex items-center justify-center text-xs font-semibold">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-semibold text-[#5F0EB3]">Cart</span>
                            </div>
                            <div className="w-12 h-0.5 bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-xs font-semibold">
                                    2
                                </div>
                                <span className="text-sm font-medium text-gray-500">Checkout</span>
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
            {loading ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items Skeleton */}
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <Skeleton className="w-32 h-24 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton className="h-6 w-3/4" />
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="w-5 h-5 rounded-full" />
                                                        <Skeleton className="h-4 w-32" />
                                                    </div>
                                                    <Skeleton className="h-5 w-20" />
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                    <Skeleton className="h-6 w-20" />
                                                    <Skeleton className="h-9 w-24" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Skeleton */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between pt-1">
                                        <Skeleton className="h-5 w-16" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : !cartData?.data?.items || cartData.data.items.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 text-center max-w-md">
                            Looks like you haven&apos;t added any courses yet. Start exploring our amazing courses!
                        </p>
                        <Button asChild size="lg" className="bg-[#5F0EB3] hover:bg-[#4B0B8E] text-white">
                            <Link href="/courselist">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Browse Courses
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Shopping Cart ({cartData?.data?.items?.length || 0} {cartData?.data?.items?.length === 1 ? 'article' : 'articles'})
                            </h2>
                        </div>
                        
                        <div className="space-y-4">
                            {cartData?.data?.items?.map((item, index) => (
                                <Card key={item._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <Link href={`/course/details?id=${item.course?._id}`} className="flex-shrink-0">
                                                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                                                    <Image
                                                        src={item.course?.thumbnail || "/assets/placeholder.jpg"}
                                                        alt={item.course?.title || "Cours"}
                                                        fill
                                                        className="object-cover"
                                                        sizes="128px"
                                                    />
                                                </div>
                                            </Link>
                                            
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div className="flex-1">
                                                    <Link href={`/course/details?id=${item.course?._id}`}>
                                                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-[#5F0EB3] transition-colors">
                                                            {item.course?.title}
                                                        </h3>
                                                    </Link>
                                                    {item.course?.instructor && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                            {item.course.instructor.image && (
                                                                <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                                                    <Image
                                                                        src={item.course.instructor.image}
                                                                        alt={item.course.instructor.name || "Formateur"}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="20px"
                                                                    />
                                                                </div>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">
                                                                    {item.course.instructor.name || "Formateur"}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {item.course?.category?.categoryName && (
                                                        <Badge variant="outline" className="text-xs w-fit">
                                                            {item.course.category.categoryName}
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${item.course?.price?.toFixed(2) || "0.00"}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeItem(cartData?.data?._id, item._id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="font-medium text-gray-900">$0.00</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between pt-1">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Link href='/checkout'>
                                        <Button className="w-full bg-[#5F0EB3] hover:bg-[#4B0B8E] text-white font-semibold py-6 text-base">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/courselist">
                                            Continue Shopping
                                        </Link>
                                    </Button>
                                </div>

                                <div className="pt-4 border-t space-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>Secure checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>30-day money-back guarantee</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
        </div>
    )
}
