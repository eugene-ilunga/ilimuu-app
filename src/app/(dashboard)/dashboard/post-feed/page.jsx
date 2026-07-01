"use client";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Ban,
  Trash2,
  AlertTriangle,
  Send,
  Image as ImageIcon,
  Video,
  X,
  Search,
  Eye,
  Edit,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePostHooks } from "@/hooks/usePostHooks";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { uploadImagePromised } from "@/utils/upload-image";
import { from } from "form-data";
import Image from "next/image";

const AdminPostPanel = () => {
  const [newPost, setNewPost] = useState({ content: "", image: null, thumbnail: "" });
  const {
    posts,
    fetchPosts,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
  } = usePostHooks();
  const [warningMessage, setWarningMessage] = useState(
    "You have been warned for violating community guidelines and your post has been removed."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim() && !newPost.image) return;
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true);

    let uploadedImageUrl = null;
    let uploadedVideoUrl = null;

    if (newPost.image) {
      try {
        const uploadResult = await uploadImagePromised(newPost.image, setUploading, setUploadProgress);
        // Handle new format: {url, type} or old format: string (for backward compatibility)
        if (typeof uploadResult === 'object' && uploadResult.url) {
          if (uploadResult.type === 'video') {
            uploadedVideoUrl = uploadResult.url;
          } else {
            uploadedImageUrl = uploadResult.url;
          }
        } else {
          // Backward compatibility: if it's a string, assume it's an image
          uploadedImageUrl = uploadResult;
        }
      } catch (error) {
        console.error("Media upload failed:", error);
        toast.error("Media upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    // Prepare formData for the POST request
    const formData = new FormData();
    formData.append("content", newPost.content || "");

    if (uploadedImageUrl) {
      formData.append("image", JSON.stringify([uploadedImageUrl])); // Adjust based on backend expectations
    }

    if (uploadedVideoUrl) {
      formData.append("video", uploadedVideoUrl);
    }

    try {
      const response = await fetch("/api/post-feed/add-new", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Post created successfully");
        setNewPost({ content: "", image: null, thumbnail: null });
        fetchPosts();
      } else {
        toast.error(`Failed to create post: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = (postId) => {
    const formData = new FormData();
    formData.append("postId", postId);
    fetch("/api/post-feed/delete", {
      method: "DELETE",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          fetchPosts();
        } else {
          console.error("Error deleting post:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleBanUser = (post) => {
    const formData = new FormData();
    formData.append("postid", post._id);
    formData.append("userid", post.user._id);
    fetch("/api/post-feed/ban-post", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          fetchPosts();
        } else {
          console.error("Error banning user:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error banning user:", error);
      });
  };

  const handleWarnUser = (userId, message) => {
    // Logic to handle the warning, including the message
    //send notification to user

    const formData = new FormData();
    formData.append("userid", userId);
    formData.append("title", "Warning Notification");
    formData.append(
      "message",
      message ??
      "You have been warned for violating community guidelines and your post has been removed."
    );
    formData.append("type", "Other");
    fetch("/api/notification/user", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("User warned successfully");
          fetchPosts();
        } else {
          console.error("Error warning user:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error warning user:", error);
      });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || post.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="m-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Post Panel</h1>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Manage Posts</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter posts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Image</TableHead>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead className="w-[400px]">Content</TableHead>
                    <TableHead className="w-[200px]">Created At</TableHead>
                    <TableHead className="w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Image className="w-32 h-20 rounded-md" src={post.image[0]} width={100} height={100} alt={""}></Image>
                        </div>
                      </TableCell>
                      <TableCell className=" font-semibold">
                        {post.content?.slice(0, 50) || "No content"}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[400px] truncate">{post.content}</div>
                      </TableCell>
                      <TableCell>{new Date(post.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Post Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>
                                  <strong>User:</strong> {post.user.name}
                                </p>
                                {post.image && (
                                  <img
                                    src={post.image}
                                    alt="Post content"
                                    className="max-h-64 rounded"
                                  />
                                )}
                                {post.video && (
                                  <video
                                    src={post.video}
                                    controls
                                    className="max-h-64 rounded"
                                  />
                                )}
                                <p>
                                  <strong>Content:</strong> {post.content}
                                </p>
                                <p>
                                  <strong>Created At:</strong>{" "}
                                  {new Date(post.createdAt).toLocaleString()}
                                </p>
                                <p>
                                  <strong>Status:</strong> {post.status}
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ban User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to ban this user? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBanUser(post)}>
                                  Ban User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this post? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post._id)}
                                >
                                  Delete Post
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Warn User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to warn this user? You can provide
                                  a warning message below.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="my-4">
                                <label
                                  htmlFor="warning-message"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Warning Message
                                </label>
                                <textarea
                                  id="warning-message"
                                  className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  placeholder="Enter your warning message here..."
                                  rows={4}
                                  value={warningMessage}
                                  onChange={(e) => setWarningMessage(e.target.value)}
                                />
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleWarnUser(post.user._id, warningMessage)
                                  }
                                >
                                  Warn User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>

            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
                <strong>{(currentPage - 1) * 5 + 5}</strong> Post
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages).keys()].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className='w-5 lg:w-12'
                        href="#"
                        onClick={() => setCurrentPage(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="w-full mx-auto shadow-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">
                Create New Post
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost}>
                <div className="space-y-4">
                  <div>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts, ideas, or insights..."
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      className="min-h-[120px] resize-none text-base"
                      rows={5}
                    />
                  </div>

                  {/* Media Preview */}
                  {newPost.image && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      {newPost.image.type.startsWith("image/") ? (
                        <Image
                          src={URL.createObjectURL(newPost.image)}
                          alt="Aperçu"
                          width={600}
                          height={400}
                          className="w-full h-auto max-h-[400px] object-contain"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(newPost.image)}
                          className="w-full h-auto max-h-[400px] object-contain"
                          controls
                        />
                      )}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() =>
                          setNewPost({ ...newPost, image: null })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} />
                      <p className="text-sm text-gray-500 text-center">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="image"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <ImagePlus className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Photo/Video
                      </span>
                      <Input
                        id="image"
                        type="file"
                        onChange={(e) =>
                          setNewPost({ ...newPost, image: e.target.files[0] })
                        }
                        accept="image/*,video/*"
                        className="hidden"
                      />
                    </Label>

                    <Button
                      type="submit"
                      className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isSubmitting || (!newPost.content && !newPost.image)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPostPanel;
