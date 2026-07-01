"use client"


import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Progress } from "@/components/ui/progress";
import { uploadImage } from "@/utils/upload-image";
import Image from "next/image"

// Define the form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phone: z.string().optional(),
  role: z.enum(["student", "instructor", "admin", "user"], {
    required_error: "Please select a role.",
  }),
  profession: z.string().optional(),
  gender: z
    .enum(["male", "female", "other", "not_specified"], {
      required_error: "Please select a gender.",
    })
    .optional(),
  about: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"], {
    required_error: "Please select a status.",
  }),
  isVerified: z.boolean().default(false),
  isBanfromPosting: z.boolean().default(false),
  authType: z.enum(["manual", "google", "facebook"], {
    required_error: "Please select an authentication type.",
  }),
  // New fields for expertise
  expertise: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  certificates: z.array(z.string()).optional(),
})



export default function AddUserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  // State for expertise, languages, and certificates
  const [expertiseInput, setExpertiseInput] = useState("")
  const [languageInput, setLanguageInput] = useState("")
  const [certificateInput, setCertificateInput] = useState("")
  const [imageUrl, setImageUrl] = useState(null)

  const router = useRouter()

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "student",
      profession: "",
      gender: "not_specified",
      about: "",
      country: "",
      status: "active",
      isVerified: false,
      isBanfromPosting: false,
      authType: "manual",
      expertise: [],
      languages: [],
      certificates: [],
    },
  })

  // Get the current role value to conditionally render fields
  const currentRole = form.watch("role")

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {

     uploadImage(file, setUploading, setUploadProgress, setImageUrl, imageUrl);
        
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result )
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle adding expertise
  const handleAddExpertise = () => {
    if (expertiseInput.trim() !== "") {
      const currentExpertise = form.getValues("expertise") || []
      form.setValue("expertise", [...currentExpertise, expertiseInput.trim()])
      setExpertiseInput("")
    }
  }

  // Handle removing expertise
  const handleRemoveExpertise = (index) => {
    const currentExpertise = form.getValues("expertise") || []
    form.setValue(
      "expertise",
      currentExpertise.filter((_, i) => i !== index),
    )
  }

  // Handle adding language
  const handleAddLanguage = () => {
    if (languageInput.trim() !== "") {
      const currentLanguages = form.getValues("languages") || []
      form.setValue("languages", [...currentLanguages, languageInput.trim()])
      setLanguageInput("")
    }
  }

  // Handle removing language
  const handleRemoveLanguage = (index) => {
    const currentLanguages = form.getValues("languages") || []
    form.setValue(
      "languages",
      currentLanguages.filter((_, i) => i !== index),
    )
  }

  // Handle adding certificate
  const handleAddCertificate = () => {
    if (certificateInput.trim() !== "") {
      const currentCertificates = form.getValues("certificates") || []
      form.setValue("certificates", [...currentCertificates, certificateInput.trim()])
      setCertificateInput("")
    }
  }

  // Handle removing certificate
  const handleRemoveCertificate = (index) => {
    const currentCertificates = form.getValues("certificates") || []
    form.setValue(
      "certificates",
      currentCertificates.filter((_, i) => i !== index),
    )
  }

  // Automatically switch to expertise tab when role changes to instructor
  useEffect(() => {
    if (currentRole === "instructor" && activeTab === "basic") {
      // Only switch if we're on the basic tab to avoid disrupting user flow
      setTimeout(() => {
        setActiveTab("expertise")
      }, 300)
    }
  }, [currentRole, activeTab])

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    const toastId = toast.loading("Creating user...")
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData()

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle arrays (expertise, languages, certificates)
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value.toString())
        }
      })

      // Append image file if it exists
      if (imageUrl) {
        formData.append("image", imageFile)
      }

      // In a real implementation, you would send this to your API
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      })

      // For demo purposes, we'll simulate a successful response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success toast
        toast.success("User created successfully!", { id: toastId })

      // Redirect to user management page
      router.push("/dashboard/user")
    } catch (error) {
      console.error("Error creating user:", error)
        toast.error("Failed to create user. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-5">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                           <TabsTrigger value="security">Security</TabsTrigger>

            {currentRole === "instructor" && (
              <>

                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
               
              </>
            )}
            {currentRole !== "instructor" && (
              <>
                <TabsTrigger value="profile" disabled={currentRole === "student"}>
                  Profile
                </TabsTrigger>
                
                <TabsTrigger value="expertise" disabled={currentRole === "student"}>
                  Expertise
                </TabsTrigger>
                <TabsTrigger value="account" disabled={currentRole === "student"}>
                  Account Settings
                </TabsTrigger>
 
              </>
            )}
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for the new user.
                  {currentRole === "student" && (
                    <span className="block mt-2 text-amber-600">
                      Note: Students only require basic information and password.
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="instructor">Mentor/Instructor</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="user">Regular User</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>This determines the user&apos;s permissions and required fields.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel>Profile Image</FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full border overflow-hidden flex items-center justify-center bg-muted">
                      {imagePreview ? (
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-semibold text-muted-foreground">
                          {form.watch("name")?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => document.getElementById("profile-image")?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload Image
                      </Button>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended: Square image, at least 300x300px
                      </p>
                    </div>
                  </div>
                </div>

                {currentRole === "student" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800">Student Account</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      For student accounts, only basic information and password are required. Additional fields are
                      optional.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Additional details about the user&apos;s profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Developer" {...field} />
                        </FormControl>
                        <FormDescription>
                          {currentRole === "instructor" ? "Required for instructors" : "Optionnel"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="not_specified">Not specified</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormDescription>Optional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description about the user..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {currentRole === "instructor"
                          ? "A detailed bio for the instructor. This will be visible to students."
                          : "A short bio or description about the user. Optional."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise">
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
                <CardDescription>
                  {currentRole === "instructor"
                    ? "Add the instructor's areas of expertise, languages, and certifications."
                    : "Optional expertise information for the user."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Expertise */}
                <div className="space-y-4">
                  <FormLabel>Areas of Expertise</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an area of expertise..."
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddExpertise()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddExpertise} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("expertise")?.map((item, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {form.watch("expertise")?.length === 0 && (
                      <p className="text-sm text-muted-foreground">No expertise added yet.</p>
                    )}
                  </div>
                  {currentRole === "instructor" && (
                    <p className="text-sm text-amber-600">
                      Required for instructors. Add at least one area of expertise.
                    </p>
                  )}
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <FormLabel>Languages</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a language..."
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddLanguage()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddLanguage} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("languages")?.map((item, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {form.watch("languages")?.length === 0 && (
                      <p className="text-sm text-muted-foreground">No languages added yet.</p>
                    )}
                  </div>
                </div>

                {/* Certificates */}
                <div className="space-y-4">
                  <FormLabel>Certificates</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a certificate..."
                      value={certificateInput}
                      onChange={(e) => setCertificateInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCertificate()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddCertificate} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("certificates")?.map((item, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {form.watch("certificates")?.length === 0 && (
                      <p className="text-sm text-muted-foreground">No certificates added yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Configure the user&apos;s account status and permissions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Determines if the user can access the platform.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="authType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authentication Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select auth type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manual">Manual (Email/Password)</SelectItem>
                            <SelectItem value="google">Google</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How the user will authenticate with the system.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isVerified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Verified Account</FormLabel>
                          <FormDescription>
                            Mark the account as verified. This bypasses email verification.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isBanfromPosting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Ban from Posting</FormLabel>
                          <FormDescription>Prevent the user from creating new posts or content.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Set the user&apos;s password and security options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 6 characters. Only required for manual authentication.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("authType") !== "manual" && (
                  <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Note: For {form.watch("authType")} authentication, the password field will be ignored. The user
                      will authenticate through their {form.watch("authType")} account.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create User
          </Button>
        </div>
      </form>
    </Form>
  )
}
