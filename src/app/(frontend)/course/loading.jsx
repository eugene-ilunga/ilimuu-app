import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you're using shadcn/ui
import { BookOpen } from 'lucide-react'; // Assuming you're using lucide-react for icons
const LoadingPage = () => {
 return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section Skeleton */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            
            <div className="space-y-3 mb-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4" />
              ))}
            </div>
            
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-40 rounded-full" />
              <Skeleton className="h-12 w-40 rounded-full" />
            </div>
          </div>
          
          <div>
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        </div>
        
        {/* Instructor Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Pulse animation for loading */}
        <div className="flex justify-center items-center py-12">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-orange-500 opacity-75 animate-ping"></div>
            <div className="absolute inset-2 rounded-full bg-orange-600 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
}

export default LoadingPage
