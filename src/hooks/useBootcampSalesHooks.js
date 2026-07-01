
import { useState, useEffect } from "react";
export const useBootcampSalesHooks = () => {
    const [salesSummeryData, setSalesSummeryData] = useState(null);
  
    const fetchBootcampSalesSummery = async () => {
      try {
        const formData = new FormData();
        const res = await fetch("/api/bootcamp/sales-summery", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        console.log("Bootcamp Sales data:", data);
        setSalesSummeryData(data);
      } catch (error) {
        console.error("Error fetching bootcamp sales data:", error);
      }
    };
  
    useEffect(() => {
        fetchBootcampSalesSummery();
    }, []);
  
    return { salesSummeryData, fetchBootcampSalesSummery };

}
