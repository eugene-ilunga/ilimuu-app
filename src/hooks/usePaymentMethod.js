//get payment method hook

import { useEffect, useState } from "react";

export const usePaymentMethod = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPaymentMethods = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payment-method/list");
            const data = await res.json();
            setPaymentMethods(data.paymentMethods);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return { paymentMethods, fetchPaymentMethods, loading };

}
