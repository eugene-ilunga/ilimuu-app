"use client";
import { useCallback, useState } from "react";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BookOpen } from "lucide-react"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


import Image from "next/image";
export default function AllCategory() {


  const router = useRouter();
  const [catagoryData, setCatagoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = useCallback(async () => {
    try {
      const formdata = new FormData();
      
      const res = await fetch("/api/category", {
        cache: "no-store",
        method: "GET",
     
      });

      const data = await res.json();
      setCatagoryData(data.data);
      setTotalPages(Math.ceil(data.total / 5)); // Assuming total items count is returned in the response
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


const bgGradients = [
  "bg-gradient-to-br from-yellow-50 to-amber-100",
  "bg-gradient-to-br from-amber-50 to-yellow-100",
  "bg-gradient-to-br from-cyan-50 to-blue-100",
  "bg-gradient-to-br from-blue-50 to-sky-100",
  "bg-gradient-to-br from-pink-50 to-rose-100",
  "bg-gradient-to-br from-emerald-50 to-green-100",
  "bg-gradient-to-br from-purple-50 to-fuchsia-100",
  "bg-gradient-to-br from-red-50 to-orange-100",
  "bg-gradient-to-br from-lime-50 to-green-100",
  "bg-gradient-to-br from-indigo-50 to-violet-100",
];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <p className="text-sm font-medium tracking-wider text-purple-600 uppercase mb-2">CATEGORIES</p>
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight mb-4">Browse By Categories</h1>
        <p className="text-gray-600 text-sm md:text-lg">
          Discover our collection of {catagoryData.total} courses across {catagoryData.length} categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catagoryData.map((category,index) => (
          <Link
                key={category._id}
                href={`/courselist?category=${category._id}`}
                className={`${
                  bgGradients[index % bgGradients.length]
                } rounded-xl overflow-hidden transition-all hover:shadow-lg group`}
              >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 mr-4 shadow-sm">
                  <span className="text-2xl">
                    <Image 
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg"
                    />

                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold group-hover:text-purple-700 transition-colors">
                    {category.categoryName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">{category.courseCount} courses</span>
                </div>
                <div className="bg-white/70 py-1 px-3 rounded-full text-sm font-medium text-purple-700 shadow-sm">
                  Explore
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

       
    </div>
  );
}


