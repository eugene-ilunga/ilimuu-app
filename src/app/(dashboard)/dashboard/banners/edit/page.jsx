"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AddEditBannerForm } from "@/components/BannerForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const EditBannerContent = () => {
  const searchParams = useSearchParams();
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      setBannerData(JSON.parse(decodeURIComponent(data)));
    }
  }, [searchParams]);

  return bannerData ? (
    <AddEditBannerForm bannerData={bannerData} />
  ) : (
    <p>Loading...</p>
  );
};

const EditBanner = () => (
  <Suspense fallback={<p>Loading banner details...</p>}>
    <div className="p-5">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/banners">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>

        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Update Banner
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          Update
        </Badge>
      </div>
      <EditBannerContent />
    </div>
  </Suspense>
);

export default EditBanner;
