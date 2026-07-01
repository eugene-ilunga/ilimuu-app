
import { useState, useEffect } from "react";

export const useCourseCheckoutHooks = (currentPage, searchQuery, setSelectedOrder, paymentStatus = "", dateRange = "") => {
  const [checkoutData, setcheckoutData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseCheckout = async () => {
      setLoading(true);
      try {
        const formdata = new FormData();
        formdata.set("page", currentPage);
        formdata.set("pagination", 10);
        formdata.set("search", searchQuery);
        if (paymentStatus) {
          formdata.set("paymentStatus", paymentStatus);
        }
        if (dateRange) {
          formdata.set("dateRange", dateRange);
        }

        const res = await fetch("/api/course/checkout/list", {
          cache: "no-store",
          method: "POST",
          body: formdata,
        });
        const data = await res.json();
        setcheckoutData(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedOrder(data.data[0]);
        }
        setTotalItems(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / 10));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseCheckout();
  }, [currentPage, searchQuery, paymentStatus, dateRange]);

  return {
    checkoutData,
    totalPages,
    totalItems,
    loading,
  };
};
