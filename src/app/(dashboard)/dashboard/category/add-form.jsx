import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { uploadImage } from "@/utils/upload-image";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";

import toast from "react-hot-toast";

const AddCategory = ({ onCategoryAdded }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
    thumbnail: "",
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const createCategory = async (event) => {
    event.preventDefault();


    const fields = [
      { value: category.categoryName, message: "Category name is required" },
      { value: category.description, message: "Description is required" },
      { value: category.thumbnail, message: "Icon is required" },
      { value: chips.length, message: "At least one subcategory is required" }
    ];
    
    for (const field of fields) {
      if (!field.value) {
        toast.error(field.message);
        return;
    }
  }

    const formData = new FormData(event.target);
    formData.append("categoryName", category.categoryName);
    formData.append("description", category.description);
    formData.append("image", category.thumbnail);
    chips.forEach((chip) => {
      formData.append("subCategory", chip);
    });

    if (!category.categoryName ||   !category.thumbnail) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await fetch("/api/category/add-new", {
        method: "POST",
        headers: {
          agent_name: "web",
        },
        body: formData,
      });

      setSubmitting(false);
      toast.dismiss(toastId); // Dismiss loading toast


      const result = await res.json();
      if(res.status === 201 || res.status === 200){ 
        toast.success("Category added successfully");
        onCategoryAdded(); // Fetch updated category data
        setIsSheetOpen(false); // Close the sheet
      }
      else {
        toast.error(result.message);
      }

  
    } catch (error) {
      toast.dismiss(toastId); // Dismiss loading toast
      console.error("Failed to create category: ", error);
      setSubmitting(false);
    }
  };


  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append(
  //     "upload_preset",
  //     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET
  //   ); // Replace with your Cloudinary upload preset
  //   formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  //   try {
  //     setUploading(true);
  //     const xhr = new XMLHttpRequest();
  //     xhr.open(
  //       "POST",
  //       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}/image/upload`
  //     );

  //     xhr.upload.onprogress = (event) => {
  //       if (event.lengthComputable) {
  //         const percentComplete = (event.loaded / event.total) * 100;
  //         setUploadProgress(percentComplete);
  //       }
  //     };

  //     xhr.onload = () => {
  //       if (xhr.status === 200) {
  //         const data = JSON.parse(xhr.responseText);
  //         setCategory({ ...category, image: data.secure_url });
  //         setUploading(false);
  //         setUploadProgress(0); // Reset progress bar
  //       } else {
  //         console.error("Image upload failed: ", xhr.responseText);
  //         setUploading(false);
  //       }
  //     };

  //     xhr.onerror = () => {
  //       console.error("Image upload failed.");
  //       setUploading(false);
  //     };

  //     xhr.send(formData);
  //   } catch (error) {
  //     console.error("Image upload failed: ", error);
  //     setUploading(false);
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file, setUploading, setUploadProgress, setCategory, category);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault(); // Prevent default form submission

      setChips([...chips, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete) => {
    setChips(chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="sm"
            className="h-8 gap-1 text-white"
            onClick={() => setIsSheetOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Category
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Category</SheetTitle>
            <SheetDescription>
              Add course category here. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={createCategory} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Category
              </Label>
              <Input
                id="categoryName"
                required
                value={category.categoryName}
                onChange={(e) =>
                  setCategory({ ...category, categoryName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                required
                value={category.description}
                onChange={(e) =>
                  setCategory({ ...category, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill">Subcategory</Label>
              <div className="flex col-span-3 text-sm flex-wrap items-center border p-2 rounded">
                {chips.map((chip, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-1 bg-black text-white rounded-full mr-2 mb-2"
                  >
                    <span>{chip}</span>
                    <button
                      className="ml-2 bg-dark hover:bg-blue-800 text-white rounded-full p-1"
                      onClick={() => handleDelete(chip)}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <input
                  className="flex-grow  col-span-3 w-full first-line:text-sm px-2 py-1 border-none focus:ring-0 outline-none"
                  type="text"
                  id="expartise"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  fontSize="sm"
                  placeholder="Type and press Enter"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
              Icon
              </Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
                className="col-span-3 aspect-square  border border-dashed"
              />
            </div>
            {uploading && <Progress value={uploadProgress} />}{" "}
            {/* Display progress bar when uploading */}
            <SheetFooter>
              <Button className="text-white" type="submit" disabled={submitting || uploading}>
                {submitting ? "Saving..." : "Save changes"}
              </Button>
              <SheetClose asChild>
                <Button variant="ghost" onClick={() => setIsSheetOpen(false)}>
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddCategory;
