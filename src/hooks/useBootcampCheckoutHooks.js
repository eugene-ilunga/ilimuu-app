
import { useState, useEffect } from "react";

export const useBootcampCheckoutHooks = (currentPage, searchQuery, setSelectedOrder, paymentStatus = "", dateRange = "") => {
  const [checkoutData, setcheckoutData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBootcampCheckout = async () => {
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

        const res = await fetch("/api/bootcamp/checkout/list", {
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
        console.error("Error fetching bootcamp checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBootcampCheckout();
  }, [currentPage, searchQuery, paymentStatus, dateRange]);

  return {
    checkoutData,
    totalPages,
    totalItems,
    loading,
  };
};
