"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  UserCircle,
} from "lucide-react"

import toast from "react-hot-toast";



export default function UserDetailsModal({ userId, isOpen, onClose }) {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")


  // Fetch user details when the modal opens and userId changes
  const fetchUserDetails = async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("userid", userId)

      const response = await fetch("/api/user/details", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.status === 200) {
        setUserData(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch user details")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast({
        title: "Erreur",
        description: "Failed to load user details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user details when the modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleVerify = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/user/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      })

      const result = await response.json()

      if (result.status === 200) {
        toast.success("User verified successfully!")
        fetchUserDetails()
      } else {
        throw new Error(result.message || "Failed to verify user")
      }
    } catch (error) {
      console.error("Error verifying user:", error)
      toast.error("Failed to verify user. Please try again.")
    }
  }



  return (
    <Dialog key={userId} open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Comprehensive information about the selected user.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading user details...</span>
          </div>
        ) : !userData ? (
          <div className="text-center py-10">
            <p>No user data found</p>
            <Button onClick={fetchUserDetails} variant="outline" className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-6">
              {/* User Profile Header */}
              <div className="md:w-1/3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      {userData.image ? (
                        <Image
                          src={userData.image || "/placeholder.svg"}
                          alt={userData.name}
                          width={120}
                          height={120}
                          className="rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center mb-4">
                          <span className="text-4xl font-semibold">
                            {userData.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <h3 className="text-xl font-bold">{userData.name}</h3>
                      <p className="text-muted-foreground">{userData.profession || "No profession listed"}</p>

                      <div className="flex gap-2 mt-2">
                        <Badge variant={getStatusBadgeVariant(userData.status)} className="capitalize">
                          {userData.status}
                        </Badge>
                        <Badge variant={userData.isVerified ? "outline" : "secondary"}>
                          {userData.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>

                      <div className="mt-4 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate">{userData.email}</span>
                        </div>
                        {userData.phone && (
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{userData.phone}</span>
                          </div>
                        )}
                        {userData.country && (
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{userData.country}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{userData.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Joined: {formatDate(userData.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Details Tabs */}
              <div className="md:w-2/3">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="expertise">Expertise</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {userData.about && (
                      <Card>
                        <CardHeader>
                          <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{userData.about}</p>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p>{userData.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p>{userData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p>{userData.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Gender</p>
                            <p className="capitalize">{userData.gender || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Country</p>
                            <p>{userData.country || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Profession</p>
                            <p>{userData.profession || "Not specified"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="expertise" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Areas of Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userData.expartise && userData.expartise.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {userData.expartise.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No expertise listed</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Languages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userData.language && userData.language.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {userData.language.map((lang, index) => (
                              <Badge key={index} variant="outline">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No languages listed</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Certificates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userData.certificate && userData.certificate.length > 0 ? (
                          <ul className="space-y-2">
                            {userData.certificate.map((cert, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No certificates listed</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="account" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Account Status</p>
                                <p className="text-sm text-muted-foreground">Current account status</p>
                              </div>
                            </div>
                            <Badge variant={getStatusBadgeVariant(userData.status)} className="capitalize">
                              {userData.status}
                            </Badge>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Verification Status</p>
                                <p className="text-sm text-muted-foreground">Email verification status</p>
                              </div>
                            </div>
                            <Badge variant={userData.isVerified ? "success" : "secondary"}>
                              {userData.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Posting Privileges</p>
                                <p className="text-sm text-muted-foreground">Ability to create posts</p>
                              </div>
                            </div>
                            <Badge variant={userData.isBanfromPosting ? "destructive" : "success"}>
                              {userData.isBanfromPosting ? "Banned" : "Allowed"}
                            </Badge>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserCircle className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Authentication Type</p>
                                <p className="text-sm text-muted-foreground">How user authenticates</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {userData.authType}
                            </Badge>
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">Last Updated</p>
                                <p className="text-sm text-muted-foreground">Last profile update</p>
                              </div>
                            </div>
                            <span className="text-sm">{formatDate(userData.updatedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}

        <DialogFooter>
         
           <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Verify User</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will verify the user and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleVerify}>Verify</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
