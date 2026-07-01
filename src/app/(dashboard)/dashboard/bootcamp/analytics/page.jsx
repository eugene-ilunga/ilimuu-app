"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Target,
  Calendar,
  GraduationCap,
  CreditCard,
  Eye,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampAnalyticsPage() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("30");

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.set("pagination", "100");
      
      const res = await fetch("/api/bootcamp", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.status === 200) {
        setBootcamps(data.data);
      } else {
        toast.error("Failed to fetch bootcamps");
      }
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      toast.error("Failed to fetch bootcamps");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = useCallback(async () => {
    if (!selectedBootcamp) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        bootcampId: selectedBootcamp.bootcampId,
        period: period,
      });

      const res = await fetch(`/api/bootcamp/analytics?${params}`);
      const data = await res.json();
      
      if (data.status === 200) {
        setAnalyticsData(data.data);
      } else {
        toast.error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [selectedBootcamp, period]);

  useEffect(() => {
    fetchBootcamps();
  }, []);

  useEffect(() => {
    if (selectedBootcamp) {
      fetchAnalytics();
    }
  }, [selectedBootcamp, period, fetchAnalytics]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
        
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bootcamp Analytics</h1>
            <p className="text-gray-600 mt-1">Track performance, enrollments, and revenue metrics</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bootcamp Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Select Bootcamp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedBootcamp?.bootcampId || ""}
                  onValueChange={(value) => {
                    const bootcamp = bootcamps.find(b => b._id === value);
                    if (bootcamp) {
                      setSelectedBootcamp({
                        bootcampId: bootcamp._id,
                        title: bootcamp.title
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bootcamp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bootcamps</SelectItem>
                    {bootcamps.map((bootcamp) => (
                      <SelectItem key={bootcamp._id} value={bootcamp._id}>
                        {bootcamp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBootcamp && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">{selectedBootcamp.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Analytics for {period} days
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          {analyticsData ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.enrollmentStats.total}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(analyticsData.paymentStats.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.completionStats.completionRate}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analyticsData.completionStats.averageProgress}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enrollment Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Enrollment Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-600">
                        {analyticsData.enrollmentStats.pending}
                      </p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {analyticsData.enrollmentStats.approved}
                      </p>
                      <p className="text-sm text-gray-600">Approved</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">
                        {analyticsData.enrollmentStats.rejected}
                      </p>
                      <p className="text-sm text-gray-600">Rejected</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">
                        {analyticsData.enrollmentStats.waitlisted}
                      </p>
                      <p className="text-sm text-gray-600">Waitlisted</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">
                        {analyticsData.enrollmentStats.completed}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-600">
                        {analyticsData.enrollmentStats.dropped}
                      </p>
                      <p className="text-sm text-gray-600">Dropped</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {analyticsData.paymentStats.completed}
                      </p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-600">
                        {analyticsData.paymentStats.pending}
                      </p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">
                        {analyticsData.paymentStats.failed}
                      </p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(analyticsData.paymentStats.totalRevenue)}
                      </p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bootcamp Performance */}
              {analyticsData.bootcampPerformance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Bootcamp Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.bootcampPerformance.map((bootcamp, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{bootcamp.title}</h3>
                              <p className="text-gray-600">
                                Price: {formatCurrency(bootcamp.price)} | 
                                Max Students: {bootcamp.max_students} | 
                                Enrolled: {bootcamp.enrollmentCount}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(bootcamp.totalRevenue)}
                              </p>
                              <p className="text-sm text-gray-600">Revenue</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <p className="text-lg font-bold">{bootcamp.enrollmentCount}</p>
                              <p className="text-sm text-gray-600">Enrollments</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <p className="text-lg font-bold">{bootcamp.paymentCount}</p>
                              <p className="text-sm text-gray-600">Payments</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <p className="text-lg font-bold">{Math.round(bootcamp.completionRate)}%</p>
                              <p className="text-sm text-gray-600">Completion Rate</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enrollment Trends */}
              {analyticsData.enrollmentTrends.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Enrollment Trends ({period} days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analyticsData.enrollmentTrends.slice(-10).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {trend._id.month}/{trend._id.day}/{trend._id.year}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (trend.count / Math.max(...analyticsData.enrollmentTrends.map(t => t.count))) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{trend.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : selectedBootcamp ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Loading Analytics...
                </h3>
                <p className="text-gray-600">
                  Fetching analytics data for {selectedBootcamp.title}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a Bootcamp
                </h3>
                <p className="text-gray-600">
                  Choose a bootcamp from the list to view its analytics and performance metrics
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
