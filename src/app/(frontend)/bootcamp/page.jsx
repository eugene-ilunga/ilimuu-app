"use client";

import { Suspense } from "react";
import BootcampList from "@/components/bootcampList";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BootcampPage() {
  return (
    <Suspense fallback={<BootcampPageSkeleton />}>
      <BootcampListPage />
    </Suspense>
  );
}

function BootcampListPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full bg-gradient-to-r from-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Intensive Bootcamps
          </h1>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <span>Bootcamps</span>
            <span className="mx-2">→</span>
            <span>Explore intensive bootcamps & accelerate your career</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <BootcampList 
          showFilters={true}
          limit={12}
          title=""
        />
      </div>
    </div>
  );
}

function BootcampPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters Skeleton */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
