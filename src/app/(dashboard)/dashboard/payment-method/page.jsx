"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { usePaymentMethod } from "@/hooks/usePaymentMethod";
import { ScrollArea } from "@/components/ui/scroll-area";
import NextImage from 'next/image';

import toast from "react-hot-toast";
import { uploadImage } from "@/utils/upload-image";
import { Progress } from "@/components/ui/progress";

const PaymentMethodPage = () => {
  const { paymentMethods, fetchPaymentMethods } = usePaymentMethod();

  const [newMethodName, setNewMethodName] = useState({
    name: "",
    image: null,
    description: "",
    codeName: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMethodId, setCurrentMethodId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

  const toggleActive = async (id) => {
    const formData = new FormData();
    formData.append("paymentMethodId", id);
    formData.append(
      "active",
      !paymentMethods.find((method) => method._id === id).active
    );
    const res = await fetch("/api/payment-method/update-status/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.status === 200) {
      toast.success(data.message);
      fetchPaymentMethods();
    } else {
      toast.error(data.message);
    }
  };

  const addNewMethod = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (isEditMode) {
      formData.append("paymentMethodId", currentMethodId);
    }
    formData.append("name", newMethodName.name);
    formData.append("image", newMethodName.thumbnail || null);
    formData.append("description", newMethodName.description);
    formData.append("codeName", newMethodName.codeName);
    let res;
    if (isEditMode) {
      res = await fetch("/api/payment-method/update", {
        method: "POST",
        body: formData,
      });
    } else {
      res = await fetch("/api/payment-method/add-new", {
        method: "POST",
        body: formData,
      });
    }

    const data = await res.json();

    if (data.status === 201 || data.status === 200) {
      toast.success(data.message);
      fetchPaymentMethods();
    } else {
      toast.error(data.message);
    }

    setIsDialogOpen(false);
    setNewMethodName({ name: "", icon: null, description: "" }); // Reset the form
  };

  const openEditDialog = (method) => {
    setNewMethodName({
      name: method.name,
      icon: null, //Handle icon separately if needed
      description: method.description,
      codeName: method.codeName,
    });
    setCurrentMethodId(method._id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (below 200 KB)
      if (file.size > 200 * 1024) {
        alert("File size must be less than 200 KB.");
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;

       uploadImage(file, setUploading, setUploadProgress, setNewMethodName, newMethodName);

      };

      reader.readAsDataURL(file);
    }
  };

  const openAddDialog = () => {
    setIsEditMode(false);
    setNewMethodName({
      name: "",
      icon: null,
      description: "",
      codeName: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="m-6">
      <div className="mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-5">Payment Methods</h1>
        <p className="text-sm text-muted-foreground mb-5">
          Manage your payment methods here. User can checkout using these
          payment methods.
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-end">
              <Button className="mb-4 text-white" onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add New Method
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Payment Method" : "Add New Payment Method"}
              </DialogTitle>
            </DialogHeader>
<form onSubmit={addNewMethod} className="space-y-6">
  <div className="grid gap-4">
    {/* Name */}
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="name" className="text-right font-medium">
        Name <span className="text-red-500">*</span>
      </label>
      <Input
        id="name"
        value={newMethodName.name}
        placeholder="e.g. Stripe"
        onChange={(e) =>
          setNewMethodName({ ...newMethodName, name: e.target.value })
        }
        className="col-span-3"
        required
      />
    </div>

    {/* Description */}
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="description" className="text-right font-medium">
        Description <span className="text-red-500">*</span>
      </label>
      <Input
        id="description"
        maxLength={50}
        value={newMethodName.description}
        placeholder="Short description (max 50 chars)"
        onChange={(e) =>
          setNewMethodName({
            ...newMethodName,
            description: e.target.value,
          })
        }
        className="col-span-3"
        required
      />
    </div>

    {/* Code Name */}
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="codeName" className="text-right font-medium">
        Code Name <span className="text-red-500">*</span>
      </label>
      <Input
        id="codeName"
        maxLength={50}
        value={newMethodName.codeName}
        placeholder="e.g. stripe, razorpay"
        onChange={(e) =>
          setNewMethodName({
            ...newMethodName,
            codeName: e.target.value,
          })
        }
        className="col-span-3"
        required
      />
    </div>

    {/* Icon */}
    <div className="grid grid-cols-4 items-center gap-4">
      <label htmlFor="icon" className="text-right font-medium">
        Icon <span className="text-red-500">*</span>
      </label>
      <div className="col-span-3 space-y-2">
        <Input
          type="file"
          id="icon"
          accept="image/*"
          onChange={handleFileChange}
          className="col-span-3"
          required
        />
        <sub className="text-gray-500">
          File size: 150x150px | Max: 200kb
        </sub>
        {uploading && <Progress value={uploadProgress} />}
      </div>
    </div>
  </div>

  {/* Button aligned right */}
  <div className="flex justify-end pt-4">
    <Button className=" text-white " type="submit">
      {isEditMode ? "Update Method" : "Add Method"}
    </Button>
  </div>
</form>

          </DialogContent>
        </Dialog>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Status</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods?.map((method) => {
                return (
                  <TableRow key={method._id}>
                    <TableCell>
                      {method.image && (
                        <NextImage
                          src={method.image}
                          alt={method.name}
                          className="rounded-sm"
                          width={80}
                          height={80}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={method.active}
                        onCheckedChange={() => toggleActive(method._id)}
                        aria-label={`Toggle ${method.name} active status`}
                      />
                    </TableCell>

                    <TableCell className="text-right">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(method)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
