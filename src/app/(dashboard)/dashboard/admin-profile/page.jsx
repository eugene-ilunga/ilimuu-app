"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserDetailsHooks } from "@/hooks/useUserHooks";
import { updateUserDetails } from "./action";
import { uploadImagePromised } from "@/utils/upload-image";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminProfile() {
  const { userDetails } = useUserDetailsHooks();

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [admin, setAdmin] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

  // toogle password change
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    setAdmin({
      name: userDetails?.name,
      email: userDetails?.email,
      image: userDetails?.image,
    });
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = admin.image;
    if (admin.image) {
      try {
        const uploadResult = await uploadImagePromised(
          admin.image,
          setUploading,
          setUploadProgress
        );
        // Handle new format: {url, type} or old format: string (for backward compatibility)
        uploadedImageUrl = typeof uploadResult === 'object' && uploadResult.url ? uploadResult.url : uploadResult;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }


    admin.image = uploadedImageUrl;
    await updateUserDetails(userDetails, admin);
    setIsEditing(false);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.set("userid", userDetails?._id);
    data.set("oldPassword", oldPassword);
    data.set("newPassword", newPassword);

    const toastID = toast.loading("Changing password...");

    const res = await fetch("/api/update-password", {
      method: "PUT",
      body: data,
    });

    const response = await res.json();

    if (response.status === 200) {
      toast.success("Password changed successfully", { id: toastID });

   
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(`Error changing password: ${response.message}`, {
        id: toastID,
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdmin((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <div className=" p-4">
      <Card className="max-w-3xl ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Admin Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={admin?.image} alt={admin?.name} />
              <AvatarFallback>{admin?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{admin?.name}</h2>
              <p className="text-gray-500">{admin?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={admin?.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={admin?.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="image">Profile Picture</Label>
              <Input
                id="image"
                name="image"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={!isEditing}
              />
            </div>

            {uploading && (
              <Progress value={uploadProgress} className="w-full" />
            )}

            {isEditing && (
              <div className="flex justify-start space-x-4">
                <Button type="submit" className="text-white">Save Changes</Button>
                <Button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </form>

          {!isEditing && (
            <Button className="mt-5 text-white" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}

        <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        {/* Old Password */}

        <div className="relative w-full">
  <Label htmlFor="oldPassword">Old Password</Label>
  <Input
    id="oldPassword"
    name="oldPassword"
    type={showPassword ? "text" : "password"}
    value={oldPassword}
    className="w-full pr-12 h-10" // Ensure sufficient space and consistent height
    onChange={(e) => setOldPassword(e.target.value)}
  />
  <button
    type="button"
    className="absolute top-11 right-3 transform -translate-y-1/2 flex items-center justify-center"
    onClick={togglePasswordVisibility}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5 text-gray-500" />
    ) : (
      <Eye className="h-5 w-5 text-gray-500" />
    )}
  </button>
</div>

   

        {/* New Password */}
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="text-white">Change Password</Button>
      </form>
    </div>
        </CardContent>
      </Card>
    </div>
  );
}
