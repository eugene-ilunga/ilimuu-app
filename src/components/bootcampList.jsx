"use client";

import { useState, useEffect, useMemo } from "react";
import { useBootcampHooks } from "@/hooks/useBootcampHooks";
import BootcampCard from "./bootcampCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";
import GlobalPagination from "@/components/GlobalPagination";

const BootcampList = ({ 
  showFilters = true, 
  limit = 8, 
  initialFilters = {},
  title = "Available Bootcamps"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  // Memoize the filters object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    ...filters,
    pagination: limit
  }), [filters.category, filters.subcategory, filters.bootcampBadge, filters.instructor, filters.minPrice, filters.maxPrice, filters.bootcampType, filters.status, filters.level, filters.startDateFrom, filters.startDateTo, limit]);

  const { bootcamps, loading, totalPages, total, error } = useBootcampHooks(
    currentPage,
    searchQuery,
    memoizedFilters
  );

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/all");
        const data = await res.json();
        if (data.status === 200) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      setCurrentPage(1);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
  };

  const bootcampTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "weekend", label: "Weekend" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const levels = [
    { value: "beginner", label: "Débutant" },
    { value: "intermediate", label: "Intermédiaire" },
    { value: "advanced", label: "Avancé" },
    { value: "all level", label: "All Levels" },
  ];

  const badges = [
    { value: "bestseller", label: "Bestseller" },
    { value: "toprated", label: "Top Rated" },
    { value: "new", label: "New" },
    { value: "trending", label: "Trending" },
    { value: "intensive", label: "Intensive" },
  ];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading bootcamps: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
    
      {/* Search and Filters */}
      {showFilters && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bootcamps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="outline">
                Search
              </Button>
              <Button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bootcamp Type Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Type
                  </label>
                  <Select
                    value={filters.bootcampType || "all"}
                    onValueChange={(value) => handleFilterChange("bootcampType", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {bootcampTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Level
                  </label>
                  <Select
                    value={filters.level || "all"}
                    onValueChange={(value) => handleFilterChange("level", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Badge Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Badge
                  </label>
                  <Select
                    value={filters.bootcampBadge || "all"}
                    onValueChange={(value) => handleFilterChange("bootcampBadge", value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Badges" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Badges</SelectItem>
                      {badges.map((badge) => (
                        <SelectItem key={badge.value} value={badge.value}>
                          {badge.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Min Price ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Max Price ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  />
                </div>

                {/* Start Date Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date From
                  </label>
                  <Input
                    type="date"
                    value={filters.startDateFrom || ""}
                    onChange={(e) => handleFilterChange("startDateFrom", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date To
                  </label>
                  <Input
                    type="date"
                    value={filters.startDateTo || ""}
                    onChange={(e) => handleFilterChange("startDateTo", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <Badge key={key} variant="secondary" className="cursor-pointer">
                      {key}: {value}
                      <button
                        onClick={() => handleFilterChange(key, "")}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Showing {bootcamps.length} of {total} bootcamps
          </span>
          {searchQuery && (
            <span>
              for &quot;{searchQuery}&quot;
            </span>
          )}
        </div>
      </div>

      {/* Bootcamp Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: limit }).map((_, index) => (
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
      ) : bootcamps.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {bootcamps.map((bootcamp) => (
              <BootcampCard
                key={bootcamp._id}
                bootcamp={bootcamp}
                showEnrollButton={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <GlobalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mb-4">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No bootcamps found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BootcampList;
