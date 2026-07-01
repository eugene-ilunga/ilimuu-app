"use client";

import { BannerList } from "@/components/BannerList";
import { AddBannerForm } from "@/components/BannerForm";
import { Button } from "@/components/ui/button";
import { useBannerHooks } from "@/hooks/useBannerHooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function BannerManagement() {
  const router = useRouter();

  const { banners, fetchBanners, currentPage,
    setCurrentPage,
    totalPages, } = useBannerHooks();

  const handleStatusChange = async (id) => {
    const banner = banners.find((banner) => banner._id === id);

    const updatedBanner = {
      ...banner,
      isActive: !banner.isActive,
    };

    const res = await fetch(`/api/banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBanner),
    });

    const data = await res.json();

    if (data.status === 200) {
      fetchBanners();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/banners/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.status === 200) {
      fetchBanners();
    }
  };

  return (
    <div className="m-6 py-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8 pl-2">App Banner</h1>

        <Link href="/dashboard/banners/create">
          <Button className="mb-4 text-white">Add New</Button>
        </Link>
      </div>

      <div className="grid  gap-8">
        <div>
          <BannerList
            banners={banners}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            onStatusChange={(id) => {
              handleStatusChange(id);
            }}
            onEdit={(banner) => {
              const bannerData = encodeURIComponent(JSON.stringify(banner));
              router.push(`/dashboard/banners/edit?data=${bannerData}`);
            }}
            onDelete={(id) => {
              //custom toast for delete confirmation yes and no

              toast.custom((t) => (
                <div
                  className={`bg-white p-4 rounded-md shadow-md transform transition-all ${t.visible ? "animate-enter" : "animate-leave"
                    }`}
                >
                  <h1 className="text-lg font-semibold text-gray-900">
                    Are you sure?
                  </h1>
                  <p className="text-sm text-gray-600 mt-2">
                    Do you really want to delete this banner?
                  </p>
                  <div className="flex justify-end gap-4 mt-4">
                    <Button
                      onClick={() => {
                        handleDelete(id);
                        toast.dismiss(t.id); // Ensure the toast is dismissed using its ID
                      }}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.dismiss(t.id)} // Dismiss the toast cleanly
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      No
                    </Button>
                  </div>
                </div>
              ));
            }}
          />
        </div>
      </div>
    </div>
  );
}
