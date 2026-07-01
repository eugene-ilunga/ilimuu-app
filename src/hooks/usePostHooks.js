import { useState, useEffect } from "react";

export const usePostHooks = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (page = 1, search = "", statusFilter = "all", append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const formData = new FormData();
      formData.append("page", page);
      formData.append("pagination", 10); // Increased page size for better infinite scroll
      formData.append("search", search);
      //formData.append("type", statusFilter);

      const response = await fetch("/api/post-feed/list", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const newPosts = data.data || [];
      const total = data.total || 0;
      const totalPagesCount = Math.ceil(total / 10);

      if (append) {
        // Append new posts to existing ones
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      } else {
        // Replace posts (for initial load or search)
        setPosts(newPosts);
        setCurrentPage(1);
      }

      setTotalPages(totalPagesCount);
      setHasMore(page < totalPagesCount);

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage, searchTerm, filter, true);
    }
  };

  useEffect(() => {
    // Reset and fetch when search or filter changes
    setHasMore(true);
    fetchPosts(1, searchTerm, filter, false);
  }, [searchTerm, filter]);

  return {
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
  };
};
