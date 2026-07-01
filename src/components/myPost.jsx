"use client";
import React, { useEffect, useState } from "react";
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
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import {
  X,
  Search,
  ImagePlus,
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  CrossIcon,
  MoreHorizontal,
  ThumbsUp,
  FileText,
  MessageSquare,

} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePostHooks } from "@/hooks/usePostHooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import toast from "react-hot-toast";
import { uploadImagePromised } from "@/utils/upload-image";
import Image from "next/image";
import { useSinglePostHooks } from "@/hooks/useSinglePostHook";

import { useUserDetailsHooks } from "@/hooks/useUserHooks";
import Comment from "./comment";
import Swal from 'sweetalert2';
import AutoPlayVideo from "@/components/AutoPlayVideo";
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";

const MyPost = () => {

  const [showComments, setShowComments] = useState(null);

  const { userDetails } = useUserDetailsHooks();

  const [dropdownPostId, setDropdownPostId] = useState(null);



  const [newPost, setNewPost] = useState({ content: "", image: null, thumbnail: "" });
  const {
    posts,
    setPosts,
    fetchPosts,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
  } = useSinglePostHooks(userDetails?._id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  console.log("setPosts:", setPosts);
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
    console.log(uploadedImageUrl, uploadedVideoUrl);

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
        setIsVisible(false); // Hide the form after successful post
      } else {
        toast.error(`Failed to create post: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
          // fetchPosts();
          setPosts((previousPosts) => previousPosts.filter((post) => post._id !== postId))
          toast.success("Post Deletd Successfully")
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


  const onLike = async (postId) => {
    try {
      const post = posts.find((post) => post._id === postId);
      const isLiked = post?.userLiked || false;

      const response = await fetch(`/api/post-feed/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postid: postId,
          userid: userDetails._id
        })
      });

      if (response.ok) {
        const result = await response.json();
        const { liked, likes } = result.data;

        setPosts(posts.map(post =>
          post._id === postId
            ? { ...post, totalLikes: likes, userLiked: liked }
            : post
        ));
      } else {
        const errorData = await response.json();
        console.error("Failed to like the post:", errorData.message);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const onShare = (postId) => {
    const url = `${window.location.origin}/popular-post/page?id=${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'You can now share it anywhere.',
        timer: 2000,
        showConfirmButton: false,
      });
    }).catch((error) => {
      console.error("Failed to copy: ", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to copy the link.',
      });
    })
  }




  const [isVisible, setIsVisible] = useState(false);

  const toggleComments = (postId) => {
    setShowComments((prev) => prev === postId ? null : postId)
  }

  const toggleDiv = () => {
    setIsVisible(prev => !prev)
  }

  return (
    <div className="w-full pb-4 pt-2">
      {/* Modern Header Section */}
      <div className="mb-3">
        <div className="mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Posts</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage and view your posts</p>
        </div>

        {/* Search and Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 sm:p-3">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-[#5F0EB3] focus:ring-[#5F0EB3] rounded-lg"
              />
            </div>
            
            {/* Add Post Button */}
            <Button
              onClick={toggleDiv}
              className={`h-11 px-6 rounded-lg font-semibold transition-all whitespace-nowrap ${
                isVisible
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-[#4B0B8E] hover:bg-[#3D0973] text-white shadow-sm hover:shadow-md'
              }`}
            >
              {isVisible ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Create Post Form */}
      {isVisible && (
        <Card className="w-full mb-3 shadow-xl border border-gray-200 rounded-xl overflow-hidden">
          <CardContent className="p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50/50">
                    <form onSubmit={handleCreatePost}>
                      <div className="space-y-4">
                        {/* User Avatar and Input Section */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Image
                              src={userDetails?.image || "/default-avatar.png"}
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="rounded-full object-cover border border-gray-200"
                            />
                          </div>
                          <div className="flex-1">
                            <Textarea
                              id="content"
                              placeholder="Share your thoughts, ideas, or insights..."
                              value={newPost.content}
                              onChange={(e) =>
                                setNewPost({ ...newPost, content: e.target.value })
                              }
                              className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-base placeholder:text-gray-400"
                              rows={4}
                            />
                          </div>
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
                            <ImagePlus className="w-5 h-5 text-[#5F0EB3]" />
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
                            className="px-6 bg-[#4B0B8E] hover:bg-[#3D0973] text-white"
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
      )}

      {/* Posts Feed */}
      <div className="space-y-3">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
              <FileText className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">No posts yet</h3>
            <p className="text-sm text-gray-500">Create your first post to get started!</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">No posts found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
                      <article
                        key={post._id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                      >
                        {/* Header */}
                        <div className="px-4 pt-3 pb-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={post.user?.image || "/default-avatar.png"}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="rounded-full object-cover border border-gray-200"
                              />
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900">{post.user?.name || "Unknown"}</h3>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.createdAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="relative inline-block text-left">
                              <button
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                                onClick={() => setDropdownPostId(dropdownPostId === post._id ? null : post._id)}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                              {
                                dropdownPostId === post._id && (
                                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      onClick={() => {
                                        handleDeletePost(post._id);
                                        setDropdownPostId(null);
                                      }}
                                    >
                                      Delete Post

                                    </button>
                                  </div>
                                )
                              }
                            </div>

                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-2">
                          <p className="text-gray-800 text-base">{post.content}</p>
                        </div>

                        {/* Image - Facebook style constrained width */}
                        {post.image?.[0] && (
                          <div className="border-y border-gray-200">
                            <Image
                              src={post.image[0]}
                              alt="Post"
                              width={680}
                              height={510}
                              className="w-full h-auto max-h-[510px] object-contain bg-gray-50"
                            />
                          </div>
                        )}

                        {/* Video - Facebook style constrained width */}
                        {post.video && (
                          <div className="border-y border-gray-200">
                            <AutoPlayVideo
                              src={post.video}
                              className="w-full h-auto max-h-[510px] object-contain bg-gray-50"
                              controls={true}
                              loop={true}
                            />
                          </div>
                        )}

                        {/* Stats */}
                        <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>{post?.totalLikes || 0} likes</span>
                            <span>{post.totalComments || 0} comments</span>
                            {/* <span>{post?.totalShares || 0} shares</span> */}
                          </div>
                        </div>

                        {/* Actions - Facebook style buttons */}
                        <div className="px-2 py-1 grid grid-cols-3 text-gray-500 text-sm font-medium">
                          <button
                            onClick={() => onLike(post._id)}
                            className={`flex items-center justify-center gap-1 p-2 rounded hover:bg-gray-100 ${post?.liked ? 'text-[#5F0EB3]' : ''}`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Like
                          </button>
                          <button onClick={() => toggleComments(post._id)} className="flex items-center justify-center gap-1 p-2 rounded hover:bg-gray-100">
                            <MessageSquare className="w-4 h-4" />
                            Comment
                          </button>

                          <button
                            onClick={() => onShare(post._id)}
                            className="flex items-center justify-center gap-1 p-2 rounded hover:bg-gray-100"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>

                        </div>
                        {showComments === post._id && <Comment postId={post._id} currentUserId={userDetails._id} />}
                      </article>
                    ))
        )}
      </div>

      {/* Pagination */}
      {filteredPosts.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{(currentPage - 1) * 5 + 1}</strong> to{" "}
            <strong>{Math.min((currentPage - 1) * 5 + 5, filteredPosts.length)}</strong> of {filteredPosts.length} posts
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    className='w-5 lg:w-12'
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page + 1);
                    }}
                    isActive={currentPage === page + 1}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MyPost;
