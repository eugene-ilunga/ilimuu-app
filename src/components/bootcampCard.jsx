"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  StarIcon,
  ClockIcon,
  UsersIcon,
  CalendarDays,
  Clock,
  MapPin,
  Award,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

const BootcampCard = ({ bootcamp, showEnrollButton = true }) => {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/bootcamp/${bootcamp._id}?name=${encodeURIComponent(bootcamp.title)}`);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    router.push(`/bootcamp/${bootcamp._id}/enroll`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getBadgeColor = (badge) => {
    const badgeColors = {
      'bestseller': 'bg-orange-100 text-orange-800',
      'toprated': 'bg-green-100 text-green-800',
      'new': 'bg-blue-100 text-blue-800',
      'trending': 'bg-purple-100 text-purple-800',
      'intensive': 'bg-red-100 text-red-800',
    };
    return badgeColors[badge] || 'bg-gray-100 text-gray-800';
  };

  const getBootcampTypeIcon = (type) => {
    const icons = {
      'full-time': <Clock className="w-4 h-4" />,
      'part-time': <ClockIcon className="w-4 h-4" />,
      'weekend': <CalendarDays className="w-4 h-4" />,
      'online': <MapPin className="w-4 h-4" />,
      'hybrid': <TrendingUp className="w-4 h-4" />,
    };
    return icons[type] || <Clock className="w-4 h-4" />;
  };

  const discountedPrice = bootcamp.price - (bootcamp.price * bootcamp.discount / 100);
  const enrollmentPercentage = bootcamp.enrollment_percentage || 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md overflow-hidden flex flex-col h-full">
      <div onClick={handleCardClick} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          {/* Bootcamp Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={imageError ? "/assets/placeholder.jpg" : bootcamp.thumbnail}
              alt={bootcamp.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true}
            />
            
            {/* Dark overlay for better badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {bootcamp.bootcamp_badge && (
                <Badge 
                  className={`${getBadgeColor(bootcamp.bootcamp_badge)} border-0 font-semibold text-xs px-2.5 py-1 shadow-lg backdrop-blur-sm bg-opacity-95 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.2)] capitalize`}
                >
                  {bootcamp.bootcamp_badge}
                </Badge>
              )}
              {bootcamp.status && (
                <Badge 
                  className={`${getStatusColor(bootcamp.status)} border-0 font-semibold text-xs px-2.5 py-1 shadow-lg backdrop-blur-sm bg-opacity-95 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.2)] capitalize`}
                >
                  {bootcamp.status}
                </Badge>
              )}
            </div>

            {/* Discount Badge */}
            {bootcamp.discount > 0 && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 font-bold text-xs px-2.5 py-1 shadow-xl backdrop-blur-sm [text-shadow:_0_1px_3px_rgb(0_0_0_/_0.3)]">
                  -{bootcamp.discount}%
                </Badge>
              </div>
            )}

            {/* Enrollment Status */}
            <div className="absolute bottom-3 right-3 z-10">
              <Badge className="bg-black/80 text-white border-0 backdrop-blur-md text-xs px-2.5 py-1 font-medium shadow-lg [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]">
                {bootcamp.enrolled_count || 0}/{bootcamp.max_students} enrolled
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3 flex-1">
          {/* Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {bootcamp.category?.categoryName || 'Uncategorized'}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              {getBootcampTypeIcon(bootcamp.bootcamp_type)}
              <span className="capitalize">{bootcamp.bootcamp_type}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {bootcamp.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={bootcamp.instructor?.image || "/assets/default-avatar.png"}
                alt={bootcamp.instructor?.name || "Formateur"}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-600">
              {bootcamp.instructor?.name || 'Unknown Instructor'}
            </span>
          </div>

          {/* Duration and Dates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{bootcamp.duration_weeks} weeks</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{formatDate(bootcamp.start_date)}</span>
              </div>
            </div>
            
            {/* Application Deadline */}
            <div className="text-xs text-red-600 font-medium">
              Apply by: {formatDate(bootcamp.application_deadline)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Enrollment Progress</span>
              <span>{enrollmentPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollmentPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {bootcamp.certification && (
              <Badge variant="outline" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                Certificate
              </Badge>
            )}
            {bootcamp.career_support?.job_placement_assistance && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Job Support
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto border-t border-gray-100">
          {/* Price */}
          <div className="flex items-center gap-2">
            {bootcamp.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-[--primary]">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${bootcamp.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[--primary]">
                ${bootcamp.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Enroll Button */}
          {showEnrollButton && bootcamp.is_application_open && bootcamp.available_spots > 0 && (
            <Button
              onClick={handleEnrollClick}
              className="bg-[--primary] hover:bg-[--primary-hover] text-white"
              size="sm"
            >
              Apply Now
            </Button>
          )}
          
          {!bootcamp.is_application_open && (
            <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
              Applications Closed
            </Badge>
          )}
          
          {bootcamp.available_spots <= 0 && bootcamp.is_application_open && (
            <Badge className="bg-red-100 text-red-600 border-0 text-xs">
              Full
            </Badge>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default BootcampCard;
