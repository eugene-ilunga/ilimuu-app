
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export const useCartHooks = (watch = true) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const res = await fetch("/api/cart/all", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setCartData(data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (watch) fetchCart();
  }, [watch]);

  return { cartData, fetchCart, loading };
};
