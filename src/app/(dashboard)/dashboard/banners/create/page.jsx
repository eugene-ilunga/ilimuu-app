import React from "react";
import {AddEditBannerForm} from "@/components/BannerForm";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {Badge} from "@/components/ui/badge";


const createBanner = () => {
  return (
    <div className="p-5">
        <div className="flex items-center gap-4  mb-6">
              <Link href="/dashboard/banners">
                <Button variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>

              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Add New Banner
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                New
              </Badge>
             
            </div>
      <AddEditBannerForm />
    </div>
  );
};

export default createBanner;
