import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  User, 
  Play, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  BookOpen
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const BootcampList = ({ enrollments }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "En attente" },
      approved: { color: "bg-green-100 text-green-800", text: "Approuvé" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejeté" },
      waitlisted: { color: "bg-blue-100 text-blue-800", text: "Waitlisted" },
      completed: { color: "bg-purple-100 text-purple-800", text: "Terminé" },
      dropped: { color: "bg-gray-100 text-gray-800", text: "Dropped" },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (enrollments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium">No bootcamps enrolled yet.</p>
        <p className="text-sm mb-4">
          Explore our bootcamps and start your intensive learning journey!
        </p>
        <Link
          href="/bootcamp"
          className="text-blue-500 hover:underline inline-block"
        >
          Browse Bootcamps
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {enrollments.map((enrollment) => (
        <Card key={enrollment._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row">
            {/* Bootcamp Image */}
            <div className="relative w-full md:w-1/3 h-48 md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={enrollment.bootcamp?.thumbnail || "/placeholder.svg"}
                alt={enrollment.bootcamp?.title || "Bootcamp"}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 z-20">
                {getStatusBadge(enrollment.enrollment_status)}
              </div>
            </div>

            {/* Bootcamp Details */}
            <div className="flex-1 p-6">
              <CardHeader className="p-0 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {enrollment.bootcamp?.title || "Bootcamp"}
                    </CardTitle>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {enrollment.bootcamp?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 pb-4">
                <div className="space-y-3">
                  {/* Bootcamp Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {enrollment.bootcamp?.start_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>Start: {formatDate(enrollment.bootcamp.start_date)}</span>
                      </div>
                    )}
                    
                    {enrollment.bootcamp?.end_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span>End: {formatDate(enrollment.bootcamp.end_date)}</span>
                      </div>
                    )}
                    
                    {enrollment.bootcamp?.duration && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>{enrollment.bootcamp.duration}</span>
                      </div>
                    )}
                    
                    {enrollment.bootcamp?.bootcamp_type && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="h-4 w-4 text-orange-500" />
                        <span className="capitalize">{enrollment.bootcamp.bootcamp_type}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Section */}
                  {enrollment.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-medium">
                          {enrollment.progress.overall_progress || 0}%
                        </span>
                      </div>
                      <Progress 
                        value={enrollment.progress.overall_progress || 0} 
                        className="h-2"
                      />
                      
                      {enrollment.progress.current_phase && (
                        <div className="text-sm text-gray-600">
                          <span>Current Phase: </span>
                          <span className="font-medium">Phase {enrollment.progress.current_phase}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Application Info */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Applied: {formatDate(enrollment.application_date)}</span>
                      <span>
                        {formatDistanceToNow(new Date(enrollment.application_date), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {enrollment.enrollment_status === "approved" && (
                  <Link href={`/bootcamp/${enrollment.bootcamp?._id}/dashboard`}>
                    <Button className="gap-2">
                      <Play className="h-4 w-4" />
                      Continue Learning
                    </Button>
                  </Link>
                )}
                
                <Link href={`/bootcamp/${enrollment.bootcamp?._id}/learn`}>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BootcampList;
