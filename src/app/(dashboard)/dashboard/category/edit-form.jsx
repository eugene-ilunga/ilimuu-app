import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/20/solid";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import toast from "react-hot-toast";
import { uploadImage } from "@/utils/upload-image";
import Image from "next/image";

const EditCategory = ({
  categoryData,
  onCategoryAdded,
  isEditOpen,
  onClose,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [chips, setChips] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [category, setCategory] = useState({
    categoryName: categoryData.categoryName,
    description: categoryData.description,
    image: categoryData.image,
    subCategory: categoryData.subCategory,  
  });
  

    useEffect(() => {
    // Populate chips with subCategory data when categoryData changes
    if (categoryData.subCategory) {
      setChips(categoryData.subCategory);
    }
  }, [categoryData]);

  const createCategory = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("id", categoryData._id);
    formData.append("categoryName", category.categoryName);
    formData.append("description", category.description);
    formData.append("image", category.image);
    formData.append("subCategory", chips);

    setSubmitting(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await fetch("/api/category/update", {
        method: "POST",
        headers: {
          agent_name: "web",
        },
        body: formData,
      });

      setSubmitting(false);

      toast.dismiss(toastId); // Dismiss loading toast

      if (!res.ok) {
        throw new Error(res.status);
      }

      toast.success("Category updated successfully");
      onCategoryAdded(); // Fetch updated category data
      onClose(); // Close the sheet
    } catch (error) {
      toast.dismiss(toastId); // Dismiss loading toast
      toast.error("Failed to update category");
      console.error("Failed to create category: ", error);
      setSubmitting(false);
    }
  };

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
    <Sheet open={isEditOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>
            Edit your category details here. Click save when you&aposre done.
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-center">
          <Image
            width={100}
            height={100}
            alt="Course image"
            className="aspect-square justify-center w-20 h-20 rounded-md object-cover"
            src={category.image ? category.image : "/assets/placeholder.jpg"}
           
          />
          </div>
        <form onSubmit={createCategory} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryName" className="text-right">
              Name
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
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditCategory;