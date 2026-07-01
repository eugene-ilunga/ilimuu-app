"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


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
  Bookmark,


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
import { useUserDetailsHooks } from "@/hooks/useUserHooks";
import Link from "next/link";
import Comment_ from "postcss/lib/comment";
import Comment from "./comment";
import Swal from 'sweetalert2';
import GlobalSkeletonLoader from "@/components/GlobalSkeletonLoader";
import AutoPlayVideo from "@/components/AutoPlayVideo";



const AllPosts = () => {

  const [showComments, setShowComments] = useState(null);

  const [dropdownId, setDropdownId] = useState(null)
  const { userDetails } = useUserDetailsHooks();
  const [selectedImage, setSelectedImage] = useState(null);




  const [newPost, setNewPost] = useState({ content: "", image: null, thumbnail: "" });
  const {
    posts,
    setPosts,
    fetchPosts,
    loadMorePosts,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    loading,
    loadingMore,
    hasMore,
  } = usePostHooks();

  // Infinite scroll observer
  const observerTarget = useRef(null);
  const loadMoreRef = useRef(loadMorePosts);
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const loadingRef = useRef(loading);

  // Update refs when values change
  useEffect(() => {
    loadMoreRef.current = loadMorePosts;
    hasMoreRef.current = hasMore;
    loadingMoreRef.current = loadingMore;
    loadingRef.current = loading;
  }, [loadMorePosts, hasMore, loadingMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingMoreRef.current && !loadingRef.current) {
          loadMoreRef.current();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress



  const toggleComments = (postId) => {
    // Check if user is logged in
    if (!userDetails || !userDetails._id) {
      toast.error("Please login first to view comments");
      return;
    }
    
    setShowComments((prev) => prev === postId ? null : postId)
  }

  const handleBookmark = async (postId) => {
    // Check if user is logged in
    if (!userDetails || !userDetails._id) {
      toast.error("Please login first to bookmark a post");
      return;
    }

    const formdata = new FormData();
    formdata.append("userId", userDetails._id)

    formdata.append("postId", postId)

    try {
      const response = await fetch('/api/post-feed/bookmark', {
        method: 'POST',
        body: formdata
      })
      const data = await response.json();

      if (data.status === 200 || data.status === 201) {

        if (data.status === 200 || data.status === 201) {

          setPosts(prevPosts =>
            prevPosts.map(post =>
              post._id === postId ? { ...post, bookmarked: !post.bookmarked } : post
            )
          );
        }
      }


    } catch (error) {
      console.error(error);
    }


  }



  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!userDetails || !userDetails._id) {
      toast.error("Please login first to create a post");
      return;
    }
    
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
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || post.status === filter;
    return matchesSearch && matchesFilter;
  });


  const onLike = async (postId) => {
    // Check if user is logged in
    if (!userDetails || !userDetails._id) {
      toast.error("Please login first to like a post");
      return;
    }
    
    try {
      const post = posts.find((post) => post._id === postId);
      const isLiked = post?.liked || false;

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

        // setPosts(posts.map(post =>
        //   post._id === postId
        //     ? { ...post, likes: post.likes + 1, liked: true }
        //     : post

        // ));
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
  const toggleDiv = () => {
    // Check if user is logged in before showing the form
    if (!isVisible && (!userDetails || !userDetails._id)) {
      toast.error("Please login first to create a post");
      return;
    }
    setIsVisible(prev => !prev)
  }

  return (
    <div className="w-full pb-4 pt-2">
      {/* Wrapper for consistent alignment */}
      <div className="w-full">
        {/* Modern Header Section */}
        <div className="mb-3">
          <div className="mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Community Posts</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Connect, share, and learn together</p>
          </div>

          {/* Search and Action Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2.5 sm:p-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts, users, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
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
                  {loading ? (
                    <GlobalSkeletonLoader
                      count={5}
                      width="100%"
                      height="80px"
                      textLineCount={2}
                      textWidths={["80%", "60%"]}
                    />
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                        <Search className="w-7 h-7 text-gray-400" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1.5">No posts found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search or create a new post!</p>
                    </div>
                  ) : filteredPosts.map((post) => (
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
                                onClick={() => setDropdownId(dropdownId === post._id ? null : post._id)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>

                              {dropdownId === post._id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                                  <button
                                    onClick={() => handleBookmark(post._id)}
                                    className={`block w-full text-left px-4 py-2 text-sm border rounded ${post.bookmarked
                                      ? 'text-green-600 bg-green-50 hover:bg-green-100'
                                      : 'text-blue-600 hover:bg-gray-100'
                                      }`}
                                  >
                                    {post.bookmarked ? "Bookmarked" : "Bookmark"}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* <button onClick={() => handleBookmark(post._id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                              <MoreHorizontal className="w-5 h-5" />

                            </button> */}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 py-2">
                          <p className="text-gray-800 text-base">{post.content}</p>
                        </div>

                        {/* Image - Facebook style constrained width */}
                       {post.image?.[0] && (
  <div
    className="border-y border-gray-200 cursor-pointer"
    onClick={() => setSelectedImage(post.image[0])}
  >
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

                          </div>
                        </div>

                        {/* Actions - Facebook style buttons */}
                        <div className="px-2 py-1 grid grid-cols-3 text-gray-500 text-sm font-medium">
                          <button
                            onClick={() => onLike(post._id)}
                            className={`flex items-center justify-center gap-1 p-2 rounded hover:bg-gray-100 ${post?.userLiked ? 'text-blue-600' : ''}`}
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



                    ))}
                    
                    {/* Infinite scroll trigger */}
                    <div ref={observerTarget} className="h-16 flex items-center justify-center py-4">
                      {loadingMore && (
                        <div className="flex items-center gap-3 text-gray-500 bg-gray-50 px-6 py-3 rounded-full">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-sm font-medium">Loading more posts...</span>
                        </div>
                      )}
                      {!hasMore && filteredPosts.length > 0 && (
                        <div className="text-center py-6">
                          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                            <div className="w-12 h-px bg-gray-300"></div>
                            <span>You&apos;re all caught up!</span>
                            <div className="w-12 h-px bg-gray-300"></div>
                          </div>
                        </div>
                      )}
                    </div>
        </div>
      </div>
      {/* Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-auto h-auto mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-80"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPosts;
