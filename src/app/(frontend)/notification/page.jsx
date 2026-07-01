"use client";

import { useNotificationHooks } from '@/hooks/useNotificationHooks';
import { formatDateTime } from '@/utils/dateformate';
import { Clock, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from "@/components/ui/badge"
import Image from 'next/image';

import { Bell, BookOpen, Users, Gift, Shield, Radio, MoreHorizontal, Check, CheckCheck,Loader2 } from "lucide-react"

const Notification = () => {
    const [loading, setLoading] = useState(false)
  
    const bgColour = ["bg-blue-50",
        "bg-red-200",
        "bg-green-200",
        "bg-yellow-200",
        "bg-purple-200",
        "bg-pink-200",
        "bg-blue-200",
        "bg-cyan-200",
        "bg-orange-200"]

    const getRandomColour = () => {
        const randomColour = Math.floor(Math.random() * bgColour.length);
        console.log(randomColour);
        return bgColour[randomColour];
    }

    const { notificationData, fetchNotification } = useNotificationHooks();
    console.log(notificationData);

       const getNotificationIcon = (type) => {
    const iconMap = {
      CoursePurchase: <BookOpen className="w-5 h-5" />,
      BookMentorShip: <Users className="w-5 h-5" />,
      Referral: <Gift className="w-5 h-5" />,
      AdminNotification: <Shield className="w-5 h-5" />,
      Broadcast: <Radio className="w-5 h-5" />,
      Other: <MoreHorizontal className="w-5 h-5" />,
    }
    return iconMap[type] || iconMap["Other"]
  }

  const getNotificationColor = (type) => {
    const colorMap = {
      CoursePurchase: "bg-blue-100 text-blue-600",
      BookMentorShip: "bg-purple-100 text-purple-600",
      Referral: "bg-green-100 text-green-600",
      AdminNotification: "bg-red-100 text-red-600",
      Broadcast: "bg-orange-100 text-orange-600",
      Other: "bg-gray-100 text-gray-600",
    }
    return colorMap[type] || colorMap["Other"]
  }


  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("notification_id", notificationId)
      formData.append("status", "true")

      const response = await fetch("/api/notification/update-status", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.status === 200) {
        // Refetch notifications to get updated data
        await fetchNotification()

      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)

    } finally {
      setLoading(false)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setMarkingAllRead(true)

      const formData = new FormData()
      formData.append("markAllRead", "true")

      const response = await fetch("/api/notification/update", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.status === 200) {
        // Refetch notifications to get updated data
        await fetchNotification()

      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)

    } finally {
      setMarkingAllRead(false)
    }
  }

  const unreadCount = notificationData?.filter((n) => !n.isRead).length || 0

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await markAsRead(notification._id)
    }

    // Navigate to action link if available
    if (notification.actionLink) {
      window.location.href = notification.actionLink
    }
  }


    return (
        <div className='lg:p-10 lg:pt-5 lg:container'>
            <h4 className='text-2xl font-semibold mb-3 pl-5 lg:pl-0'>Notifications list</h4>
            {notificationData && notificationData.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notificationData.map((notification, index) => (
                          <div
                            key={notification._id || index}
                            className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer relative ${
                              !notification.isRead ? "bg-blue-50/30 border-l-4 border-l-blue-500" : ""
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start gap-4">
                              {/* Notification Icon/Image */}
                              <div className="flex-shrink-0">
                                {notification.imageUrl ? (
                                  <Image
                                    src={notification.imageUrl || "/placeholder.svg"}
                                    alt="Notification"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    width={48}
                                    height={48}
                                  />
                                ) : (
                                  <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}
                                  >
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                )}
                              </div>
          
                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <h4
                                    className={`text-sm font-medium line-clamp-2 leading-5 ${
                                      !notification.isRead ? "text-gray-900" : "text-gray-700"
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
          
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-5">{notification.message}</p>
          
                                <div className="flex items-center justify-between mt-3">
                                  <Badge variant="secondary" className="text-xs px-2 py-1">
                                    {notification.type.replace(/([A-Z])/g, " $1").trim()}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{formatDateTime(notification.createdAt)}</span>
                                </div>
                              </div>
          
                              {/* Mark as Read Button */}
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification._id)
                                  }}
                                  disabled={loading}
                                  className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                  aria-label="Marquer comme lu"
                                >
                                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Empty State */
                      <div className="flex flex-col items-center justify-center px-6 py-16">
                        <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                        <p className="text-sm text-gray-500 text-center max-w-sm">
                          When you have new notifications, they&apos;ll appear here to keep you updated.
                        </p>
                      </div>
                    )}
        </div >

    )
}

export default Notification
