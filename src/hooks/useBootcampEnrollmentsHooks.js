import { useState, useEffect } from "react";

export const useBootcampEnrollmentsHooks = () => {
  const [bootcampEnrollments, setBootcampEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBootcampEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/bootcamp/my-enrollments", {
        method: "GET",
      });
      
      const data = await response.json();
      
      if (data.status === 200) {
        setBootcampEnrollments(data.data || []);
      } else {
        setError(data.message || "Failed to fetch bootcamp enrollments");
      }
    } catch (err) {
      console.error("Error fetching bootcamp enrollments:", err);
      setError("Failed to fetch bootcamp enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcampEnrollments();
  }, []);

  return {
    bootcampEnrollments,
    loading,
    error,
    refetch: fetchBootcampEnrollments,
  };
};
