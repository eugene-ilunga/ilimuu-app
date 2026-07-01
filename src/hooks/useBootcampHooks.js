import { useState, useEffect, useCallback, useMemo } from "react";

export const useBootcampHooks = (currentPage = 1, searchQuery = "", filters = {}) => {
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters.category,
    filters.subcategory,
    filters.bootcampBadge,
    filters.instructor,
    filters.minPrice,
    filters.maxPrice,
    filters.bootcampType,
    filters.status,
    filters.level,
    filters.startDateFrom,
    filters.startDateTo,
  ]);

  const fetchBootcamps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      formdata.set("page", currentPage);
      formdata.set("pagination", 8);
      formdata.set("search", searchQuery);

      // Add filters
      if (memoizedFilters.category) formdata.set("category", memoizedFilters.category);
      if (memoizedFilters.subcategory) formdata.set("subcategory", memoizedFilters.subcategory);
      if (memoizedFilters.bootcampBadge) formdata.set("bootcampBadge", memoizedFilters.bootcampBadge);
      if (memoizedFilters.instructor) formdata.set("instructor", memoizedFilters.instructor);
      if (memoizedFilters.minPrice) formdata.set("minPrice", memoizedFilters.minPrice);
      if (memoizedFilters.maxPrice) formdata.set("maxPrice", memoizedFilters.maxPrice);
      if (memoizedFilters.bootcampType) formdata.set("bootcampType", memoizedFilters.bootcampType);
      if (memoizedFilters.status) formdata.set("status", memoizedFilters.status);
      if (memoizedFilters.level) formdata.set("level", memoizedFilters.level);
      if (memoizedFilters.startDateFrom) formdata.set("startDateFrom", memoizedFilters.startDateFrom);
      if (memoizedFilters.startDateTo) formdata.set("startDateTo", memoizedFilters.startDateTo);

      const res = await fetch("/api/bootcamp", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 200) {
        setBootcamps(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      setError("Failed to fetch bootcamps");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, memoizedFilters, refreshTrigger]);

  useEffect(() => {
    fetchBootcamps();
  }, [fetchBootcamps]);

  return {
    bootcamps,
    loading,
    totalPages,
    total,
    error,
    refetch: () => setRefreshTrigger(prev => prev + 1),
  };
};

export const useBootcampDetails = (bootcampId) => {
  const [bootcamp, setBootcamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchBootcampDetails = useCallback(async () => {
    if (!bootcampId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      formdata.set("bootcampId", bootcampId);

      const res = await fetch("/api/bootcamp/details", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 200) {
        setBootcamp(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching bootcamp details:", error);
      setError("Failed to fetch bootcamp details");
    } finally {
      setLoading(false);
    }
  }, [bootcampId, refreshTrigger]);

  useEffect(() => {
    fetchBootcampDetails();
  }, [fetchBootcampDetails]);

  return {
    bootcamp,
    loading,
    error,
    refetch: () => setRefreshTrigger(prev => prev + 1),
  };
};

export const useBootcampEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enrollInBootcamp = async (bootcampId, applicationData) => {
    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      formdata.set("bootcampId", bootcampId);
      formdata.set("motivation_letter", applicationData.motivation_letter);
      formdata.set("experience_level", applicationData.experience_level);
      formdata.set("goals", applicationData.goals);
      formdata.set("availability", applicationData.availability);
      
      if (applicationData.portfolio_url) {
        formdata.set("portfolio_url", applicationData.portfolio_url);
      }
      if (applicationData.linkedin_url) {
        formdata.set("linkedin_url", applicationData.linkedin_url);
      }
      if (applicationData.github_url) {
        formdata.set("github_url", applicationData.github_url);
      }

      const res = await fetch("/api/bootcamp/enroll", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 201) {
        return { success: true, data: data.data };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error enrolling in bootcamp:", error);
      const errorMessage = "Failed to enroll in bootcamp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (bootcampId) => {
    try {
      const res = await fetch(`/api/bootcamp/enroll?bootcampId=${bootcampId}`);
      const data = await res.json();
      
      if (data.status === 200) {
        return { success: true, data: data.data, isEnrolled: data.is_enrolled };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error checking enrollment status:", error);
      return { success: false, error: "Failed to check enrollment status" };
    }
  };

  return {
    enrollInBootcamp,
    checkEnrollmentStatus,
    loading,
    error,
  };
};

export const useBootcampCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckout = async (bootcampId, paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      formdata.set("bootcampId", bootcampId);
      formdata.set("paymentMethod", paymentData.paymentMethod);
      
      if (paymentData.paymentPlan) {
        formdata.set("paymentPlan", paymentData.paymentPlan);
      }
      if (paymentData.installments) {
        formdata.set("installments", paymentData.installments);
      }

      const res = await fetch("/api/bootcamp/checkout", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 200) {
        return { success: true, data: data.data };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      const errorMessage = "Failed to create checkout";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getCheckoutHistory = async (page = 1, limit = 10, status = null) => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/bootcamp/checkout?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === 200) {
        return { success: true, data: data.data, pagination: data.pagination };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error fetching checkout history:", error);
      const errorMessage = "Failed to fetch checkout history";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    getCheckoutHistory,
    loading,
    error,
  };
};

// Hook for bootcamp management (admin/instructor)
export const useBootcampManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBootcamp = async (bootcampData) => {
    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      
      // Basic fields
      Object.keys(bootcampData).forEach(key => {
        if (bootcampData[key] !== null && bootcampData[key] !== undefined) {
          if (Array.isArray(bootcampData[key]) || typeof bootcampData[key] === 'object') {
            formdata.set(key, JSON.stringify(bootcampData[key]));
          } else {
            formdata.set(key, bootcampData[key]);
          }
        }
      });

      const res = await fetch("/api/bootcamp/add-new", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 201) {
        return { success: true, data: data.data };
      } else {
        setError(data.message);
        return { success: false, error: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error("Error creating bootcamp:", error);
      const errorMessage = "Failed to create bootcamp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateBootcamp = async (bootcampId, bootcampData) => {
    try {
      setLoading(true);
      setError(null);

      const formdata = new FormData();
      formdata.set("bootcampId", bootcampId);
      
      Object.keys(bootcampData).forEach(key => {
        if (bootcampData[key] !== null && bootcampData[key] !== undefined) {
          if (Array.isArray(bootcampData[key]) || typeof bootcampData[key] === 'object') {
            formdata.set(key, JSON.stringify(bootcampData[key]));
          } else {
            formdata.set(key, bootcampData[key]);
          }
        }
      });

      const res = await fetch("/api/bootcamp/update", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      
      if (data.status === 200) {
        return { success: true, data: data.data };
      } else {
        setError(data.message);
        return { success: false, error: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error("Error updating bootcamp:", error);
      const errorMessage = "Failed to update bootcamp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteBootcamp = async (bootcampId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/bootcamp/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bootcampId }),
      });

      const data = await res.json();
      
      if (data.status === 200) {
        return { success: true, data: data.data };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Error deleting bootcamp:", error);
      const errorMessage = "Failed to delete bootcamp";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    loading,
    error,
  };
};
