'use client'


import { X, Trash } from 'lucide-react';
import Image from "next/image"

import { useCartHooks } from '@/hooks/useCartHooks';

import { Button } from '@/components/ui/button';

import { useRouter } from "next/navigation";


const CartPage = () => {

    const router = useRouter();
    const { cartData } = useCartHooks();

    const routeCheckout = () => {
        // setCartOpen(false);
        router.push("/checkout");
    };

    return (
        <div className="container border p-10 m-10 mx-auto">
            <h4 className='text-2xl font-semibold mb-3 pl-0'>Cart list</h4>
            <div className='lg:grid lg:grid-cols-5 lg:gap-4 space-y-3 lg:space-y-0'>
                {
                    cartData?.data?.items?.map(cart => {
                        return (

                            <div key={cart._id} className="border p-3 rounded-md items-center ">
                                <div className="pb-5">
                                    <Image height={100} width={200} className="lg:h-20 lg:w-28 h-30 w-full p-1 rounded-md" src={cart.course.thumbnail} alt="" />
                                    <div className="text-start">
                                        <h4 className="lg:text-lg text-base font-semibold">{cart.course.title}</h4>
                                        <p className="lg:text-sm text-sm">Quantity: {cart.quantity} </p>
                                    </div>
                                </div>

                                <div className="flex fex-row gap-10 justify-between">
                                    <h5>${cart.course.price}</h5>
                                    <Trash className="w-6 h-6 text-end bg-red-100 p-1 text-red-500 rounded-xl ml-5" />
                                </div>
                                <div>
                                    <Button
                                        onClick={routeCheckout}
                                        className="mt-4 space-x-4 bg-orange-300 hover:bg-primary text-black rounded-full px-4 py-2"
                                    >
                                        Checkout ${cartData.totalAmount}
                                    </Button>

                                </div>
                            </div>

                        )

                    }
                    )

                }
            </div>



        </div>
    )
}

export default CartPage
