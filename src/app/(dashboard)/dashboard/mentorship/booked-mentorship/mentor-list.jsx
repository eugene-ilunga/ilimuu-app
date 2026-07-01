"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, DollarSign, CheckCircle, XCircle, Star, Users, TrendingUp, Search } from "lucide-react"
import { ChatDialog } from "@/components/chat-dialog"

export function MentorList({ enrollList = [], total = 0 }) {
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Debug: Log the data to see what we're receiving
  console.log("MentorList received:", { enrollList, total })

  const isActive = (endDate) => {
    return new Date(endDate) > new Date()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalStudents = enrollList.length
    const activeStudents = enrollList.filter((e) => isActive(e.endDate)).length
    const totalEarnings = enrollList.reduce((sum, e) => sum + (e.package?.price || 0), 0)
    const thisMonthEnrollments = enrollList.filter((e) => {
      const enrollDate = new Date(e.purchaseDate)
      const now = new Date()
      return enrollDate.getMonth() === now.getMonth() && enrollDate.getFullYear() === now.getFullYear()
    }).length

    return {
      totalStudents,
      activeStudents,
      totalEarnings,
      thisMonthEnrollments,
    }
  }, [enrollList])

  // Filter enrollments based on search and status
  const filteredEnrollments = useMemo(() => {
    return enrollList.filter((enrollment) => {
      const matchesSearch =
        enrollment.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.package?.title?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive(enrollment.endDate)) ||
        (statusFilter === "expired" && !isActive(enrollment.endDate)) ||
        (statusFilter === "pending" && enrollment.paymentStatus === "pending")

      return matchesSearch && matchesStatus
    })
  }, [enrollList, searchTerm, statusFilter])

  const handleChatClick = (enrollment) => {
    if (isActive(enrollment.endDate)) {
      setSelectedStudent(enrollment)
      setIsChatOpen(true)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Debug Info */}
      

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your enrolled students and mentorship programs</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeStudents}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-purple-600">${stats.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.thisMonthEnrollments}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students, emails, or packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="expired">Expired Only</SelectItem>
                  <SelectItem value="pending">Pending Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="space-y-4">
          {filteredEnrollments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "You don't have any enrolled students yet"}
                </p>
                <p className="text-sm text-gray-500 mt-2">Raw data length: {enrollList.length}</p>
              </CardContent>
            </Card>
          ) : (
            filteredEnrollments.map((enrollment) => {
              const active = isActive(enrollment.endDate)
              const daysRemaining = getDaysRemaining(enrollment.endDate)

              return (
                <Card
                  key={enrollment._id}
                  className={`transition-all duration-200 hover:shadow-lg ${
                    active ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Left Section - Student Info */}
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <Avatar className="h-16 w-16 ring-2 ring-white shadow-sm flex-shrink-0">
                          <AvatarImage
                            src={enrollment.user?.image || "/placeholder.svg"}
                            alt={enrollment.user?.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                            {enrollment.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "ST"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-xl text-gray-900 truncate">
                              {enrollment.user?.name || "Student Name"}
                            </h3>
                            <Badge
                              variant={active ? "default" : "secondary"}
                              className={`${
                                active
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              } flex-shrink-0`}
                            >
                              {active ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" /> Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" /> Expired
                                </>
                              )}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {enrollment.package?.title}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />${enrollment.package?.price}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm">{enrollment.package?.short_description}</p>
                        </div>
                      </div>

                      {/* Middle Section - Package Services */}
                      <div className="hidden lg:block min-w-0 flex-1 max-w-xs">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Package Services:</h5>
                        <div className="space-y-1">
                          {enrollment.package?.services?.slice(0, 3).map((service, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                              <span className="truncate">{service}</span>
                            </div>
                          )) || <div className="text-sm text-gray-500">No services listed</div>}
                          {(enrollment.package?.services?.length || 0) > 3 && (
                            <div className="text-xs text-gray-500 ml-5">
                              +{(enrollment.package?.services?.length || 0) - 3} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Timeline & Action */}
                      <div className="flex items-center gap-6 flex-shrink-0">
                        {/* Timeline */}
                        <div className="hidden md:block text-right min-w-0">
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-end text-sm">
                              <span className="text-gray-600 mr-2">Purchased:</span>
                              <span className="font-medium">{formatDate(enrollment.purchaseDate)}</span>
                            </div>
                            <div className="flex items-center justify-end text-sm">
                              <span className="text-gray-600 mr-2">Started:</span>
                              <span className="font-medium">{formatDate(enrollment.startDate)}</span>
                            </div>
                            <div className="flex items-center justify-end text-sm">
                              <span className="text-gray-600 mr-2">{active ? "Expires:" : "Expired:"}</span>
                              <span className={`font-medium ${active ? "text-green-600" : "text-red-600"}`}>
                                {formatDate(enrollment.endDate)}
                              </span>
                            </div>
                          </div>

                          {active && daysRemaining > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1 mb-3">
                              <p className="text-xs text-blue-800 font-medium">{daysRemaining} days left</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {active ? (
                            <Button
                              onClick={() => handleChatClick(enrollment)}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 min-w-[120px] text-white"
                              size="lg"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat
                            </Button>
                          ) : (
                            <Button
                              disabled
                              variant="outline"
                              className="bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed min-w-[120px]"
                              size="lg"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Expired
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Timeline - Show on smaller screens */}
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <div>
                          <span className="text-gray-600">Purchased: </span>
                          <span className="font-medium">{formatDate(enrollment.purchaseDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Started: </span>
                          <span className="font-medium">{formatDate(enrollment.startDate)}</span>
                        </div>
                      </div>
                      <div className="flex justify-center items-center text-sm">
                        <div>
                          <span className="text-gray-600">{active ? "Expires: " : "Expired: "}</span>
                          <span className={`font-medium ${active ? "text-green-600" : "text-red-600"}`}>
                            {formatDate(enrollment.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Services - Show on smaller screens */}
                    <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Package Services:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {enrollment.package?.services?.slice(0, 4).map((service, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                            <span className="truncate">{service}</span>
                          </div>
                        )) || <div className="text-sm text-gray-500">No services listed</div>}
                        {(enrollment.package?.services?.length || 0) > 4 && (
                          <div className="text-sm text-gray-500 ml-5 col-span-full">
                            +{(enrollment.package?.services?.length || 0) - 4} more services
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Dialog */}
      {selectedStudent && (
        <ChatDialog
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          mentor={selectedStudent?.user}
          currentUserId={selectedStudent?.mentor}
          currentUserName={selectedStudent?.user?.name}
          currentUserImage={selectedStudent?.user?.image || "/placeholder.svg"}
        />
      )}
    </>
  )
}
