import { StarRating } from "@/components/star-rating";
import { RatingDistribution } from "@/components/rating-distribution";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { use } from "react";
import { useEffect,useState } from "react";
import { set } from "mongoose";

// This would typically come from an API call
const reviewData = {
  status: true,
  courseReviews: [
    {
      _id: "672f03a83e7488a90896264d",
      course: "66c472023ceb37f78290b2b6",
      user: {
        _id: "6689598adf625afe14c69f19",
        name: "Rz Tutul",
        image: "https://avatars.githubusercontent.com/u/37795928?v=4",
      },
      rating: 1.5,
      review: "This is not course",
      status: "active",
      createdAt: "2024-11-09T06:39:36.166Z",
      updatedAt: "2024-11-09T06:39:36.166Z",
    },
  ],
  total: 1,
  averageRating: "1.50",
};

// For demonstration, let's create a mock rating distribution
const ratingDistribution = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 1, // Our one review is 1.5, so closest to 1
};

export default function CourseReviews({courseId}) {
  // This would typically be fetched from an API

   const [reviewData, setreviewData] = useState()



  const fetchReviewData = async () => {

    try {
      const fomrData = new FormData();
      fomrData.set("course", courseId);
      fomrData.set("page", 1);
      fomrData.set("pagination", 10);
      const res = await fetch("/api/course/review/all", {
        method: "POST",
        body: fomrData,
      });

      const data = await res.json();
      setreviewData(data);
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, []);
  // Call the function to fetch review data


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Course Reviews</h1>
          <p className="text-muted-foreground">
            See what students are saying about this course
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Rating Summary Card */}
          <Card className="col-span-1 lg:col-span-1 shadow-md border-0 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 flex flex-col items-center justify-center">
              <h2 className="text-lg font-medium mb-4">Overall Rating</h2>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-2">
                  {reviewData?.averageRating}
                </div>
                <StarRating rating={reviewData?.averageRating} size="lg" className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Based on {reviewData?.total} review{reviewData?.total !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </Card>

          {/* Rating Distribution Card */}
          <Card className="col-span-1 lg:col-span-2 shadow-md border-0">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Rating Distribution</h2>
              <RatingDistribution distribution={ratingDistribution} />
            </div>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Student Feedback{" "}
            <span className="text-muted-foreground">({reviewData?.total})</span>
          </h2>

          {/* This would be a dropdown in a real implementation */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <span className="text-sm font-medium">Most Recent</span>
          </div>
        </div>

        {reviewData?.courseReviews.length > 0 ? (
          <div className="space-y-6">
            {reviewData?.courseReviews.map((review) => (
              <Card
                key={review._id}
                className="shadow-sm hover:shadow-md transition-shadow duration-200 border-0"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={review.user.image || "/placeholder.svg"}
                            alt={review.user.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {review.user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left">
                          <h3 className="font-medium">{review.user.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(review.createdAt), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StarRating rating={review.rating} />
                        <Badge variant="outline" className="font-medium">
                          {review.rating.toFixed(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.review}
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <div className="flex gap-4">
                          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-thumbs-up"
                            >
                              <path d="M7 10v12" />
                              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                            </svg>
                            Helpful
                          </button>
                          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-flag"
                            >
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                              <line x1="4" x2="4" y1="22" y2="15" />
                            </svg>
                            Report
                          </button>
                        </div>

                        {review.status === "active" && (
                          <Badge variant="secondary" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Be the first to share your experience with this course and help
                others make an informed decision.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
