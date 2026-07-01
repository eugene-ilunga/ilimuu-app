"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Users, Send } from "lucide-react";

import { useRouter } from "next/navigation";
import { type } from "os";
import { toast } from "react-hot-toast";

export default function AdminNotificationPanel() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [specificUserEmail, setSpecificUserEmail] = useState("");
  const [userGroup, setTargetGroup] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState("");
  const [actionLink, setActionLink] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const route = useRouter();

  const isFormValid =
    title.length > 0 &&
    title.length <= 100 &&
    message.length > 0 &&
    message.length <= 500 &&
    userGroup.length > 0;

  const handlePreviewRecipients = () => {
    setShowPreview(true);
  };

  const handleSendNotification = async (e) => {
    // This would typically be an API call to send the notification

    e.preventDefault();

    const notification = {
      title,
      message,
      type: "AdminNotification",
      imageUrl,
      userGroup,
      additionalFilters,
      actionLink,
      specificUserEmail,
    };

    const toastId = toast.loading("Sending notification...");

    try {
      const res = await fetch("/api/notification/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      const data = await res.json();

      if (data.status === 200) {
        // Reset the form
        setTitle("");
        setMessage("");
        setImageUrl("");
        setTargetGroup("");
        setAdditionalFilters("");
        setActionLink("");
        setShowPreview(false);
        setSelectedUser(null);
        setUserSearch("");
        toast.dismiss(toastId); // Dismiss loading toast

        // Redirect to the notification list page
        toast.success("Notification sent successfully!");
        route.push("/dashboard/notification");
      } else {
        toast.dismiss(toastId); // Dismiss loading toast

        toast.error("Error sending notification: " + data.message);
        console.error("Error sending notification:", data.message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto mt-5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Send Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Notification Title</Label>
          <Input
            id="title"
            placeholder="Enter the notification title (max 100 characters)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          {title.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {title.length}/100 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Write your notification message (max 500 characters)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          {message.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {message.length}/500 characters
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL (Optional)</Label>
          <Input
            id="imageUrl"
            placeholder="Paste an image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userGroup">Target User Group</Label>
          <Select
            onValueChange={(value) => {
              setTargetGroup(value);
              if (value !== "specific") {
                setSelectedUser(null);
                setUserSearch("");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a user group to target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="mentors">Mentors</SelectItem>
              <SelectItem value="newStudents">
                New Students (Last 7 Days)
              </SelectItem>
              <SelectItem value="newMentors">
                New Mentors (Last 7 Days)
              </SelectItem>
              <SelectItem value="specific">Specific User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userGroup === "specific" && (
          <div className="space-y-2">
            <Label htmlFor="userSearch">Enter User email</Label>
            <div className="flex space-x-2">
              <Input
                id="specificUserEmail"
                placeholder="Enter user email"
                onChange={(e) => setSpecificUserEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="additionalFilters">
            Additional Filters (Optional)
          </Label>
          <Input
            id="additionalFilters"
            placeholder="Add filters (e.g., subscription=premium)"
            value={additionalFilters}
            onChange={(e) => setAdditionalFilters(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actionLink">Action Link (Optional)</Label>
          <Input
            id="actionLink"
            placeholder="Add an optional link for user action (e.g., https://...)"
            value={actionLink}
            onChange={(e) => setActionLink(e.target.value)}
            type="url"
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePreviewRecipients}
                  className="w-full sm:w-auto text-white"
                >
                  <Users className="mr-2 h-4 w-4" /> Preview Recipients
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to preview the recipients based on your selection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSendNotification}
                  disabled={!isFormValid}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" /> Send Notification
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send the configured notification</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showPreview && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="mb-4 w-full flex justify-between items-center"
            >
              <span>{showPreview ? "Hide Recipients" : "Show Recipients"}</span>
              {showPreview ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>

            <div className="overflow-x-auto">
              <Card className="w-full border shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="font-medium">{title}</span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Message
                    </span>
                    <span className="font-medium">{message}</span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 w-max">
                      {type}
                    </span>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Targeted Group
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 w-max">
                      {userGroup}
                    </span>
                  </div>

                  {specificUserEmail && (
                    <div className="flex flex-col space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-sm text-muted-foreground">
                        Specific User
                      </span>
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 w-max">
                        {specificUserEmail}
                      </span>
                    </div>
                  )}

                  {additionalFilters && (
                    <div className="flex flex-col space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-sm text-muted-foreground">
                        Additional Filters
                      </span>
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 w-max">
                        {additionalFilters}
                      </span>
                    </div>
                  )}

                  {actionLink && (
                    <div className="flex flex-col space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-sm text-muted-foreground">
                        Action Link
                      </span>
                      <a
                        href={actionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline truncate"
                      >
                        {actionLink}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
