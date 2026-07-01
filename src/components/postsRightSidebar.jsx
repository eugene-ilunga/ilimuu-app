'use client'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export const PostsRightSidebar = () => {

    const [promos, setPromos] = useState([]);
    useEffect(() => {
        fetch('/api/ads-promo').then(res => res.json()).then(result => setPromos(result.data)).catch(error => console.error(error))
    }, [])


    return (
        <div className="w-full space-y-4">
                {
                    promos.filter(prom => prom.isActive).map(prom => {
                        return <div key={prom._id} className="relative h-[280px] rounded-2xl overflow-hidden border border-gray-200 shadow-md group text-white">

                            <Image
                                width={600}
                                height={600}
                                src={prom.image}
                                alt="Cours"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Simplified overlay for better text visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 z-[1]"></div>

                            <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                                <div className="space-y-2 mb-4"> 
                                    <h3 className="text-lg font-bold leading-tight drop-shadow-lg [text-shadow:_1px_1px_4px_rgb(0_0_0_/_0.8)] line-clamp-2">
                                        {prom.title}
                                    </h3>
                                    <p className="text-sm text-white/90 leading-relaxed drop-shadow-md [text-shadow:_1px_1px_3px_rgb(0_0_0_/_0.7)] line-clamp-2">
                                        {prom.description}
                                    </p>
                                </div>

                                <Link href={prom.buttonLink} className="w-full">
                                    <button className="w-full bg-white/95 hover:bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200">
                                        {prom.buttonText}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    }
                    )
                }
        </div>
    )
}