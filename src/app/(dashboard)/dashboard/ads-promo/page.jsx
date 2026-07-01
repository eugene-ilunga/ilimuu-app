'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@radix-ui/react-progress'
import { ImagePlus, Loader2, Trash2, X, Edit2 } from 'lucide-react'
import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadImagePromised } from '@/utils/upload-image'
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdsPromo = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newPromo, setNewPromo] = useState({ title: "", buttonLink: "", buttonText: "", description: "", image: null })
  const [promos, setPromos] = useState([]);
  const [editingPromo, setEditingPromo] = useState(null);
  const [editPromo, setEditPromo] = useState({ title: "", buttonLink: "", buttonText: "", description: "", image: null });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    fetchPromos();
  }, [])
  const fetchPromos = async () => {
    const res = await fetch('/api/ads-promo');
    const data = await res.json();
    if (data.success) {
      setPromos(data.data)
    }
  }


  const toggleActive = async (id, currentStatus) => {

    try {
      const res = await fetch('/api/ads-promo', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus
        })
      })

      const data = await res.json();
      if (data.success) {
        toast.success('Status Updated Successfully')
        fetchPromos();
      } else {
        toast.error("update failed")
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error);
    }



  }


  const handleCreate = async (e) => {

    e.preventDefault();
    if (isSubmitting) return;
    if (!newPromo.title.trim()) return;
    if (!newPromo.buttonLink.trim()) return;
    if (!newPromo.buttonText.trim()) return;
    // if (!newPromo.image.trim()) return;
    if (!newPromo.image) {
      toast.error("Image is required");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    let uploadedImageUrl = null;

    if (newPromo.image) {
      try {
        const uploadResult = await uploadImagePromised(newPromo.image, setUploading, setUploadProgress);
        // Handle new format: {url, type} or old format: string (for backward compatibility)
        uploadedImageUrl = typeof uploadResult === 'object' && uploadResult.url ? uploadResult.url : uploadResult;
      } catch (error) {
        console.log('Image upload failed, ', error);

        toast.error("Image upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", newPromo.title);
    formData.append("buttonLink", newPromo.buttonLink);
    formData.append("buttonText", newPromo.buttonText);
    formData.append("description", newPromo.description);


    if (uploadedImageUrl) {
      //formData.append("image", JSON.stringify([uploadedImageUrl])); 
      formData.append("image", uploadedImageUrl);
    }
    try {
      const res = await fetch("/api/ads-promo", {
        method: "POST",
        body: formData
      })

      const data = await res.json();
      if (data.success) {
        toast.success('Successfully created');
        setNewPromo({ title: "", buttonLink: "", buttonText: "", description: "", image: null })
      } else {
        toast.error("error occured");
      }
      setIsSubmitting(false);

    } catch (error) {
      console.error(error)
      toast.error("error occured")
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }


  }

  const handleDeletePromo = async (id) => {

    try {
      const res = await fetch('/api/ads-promo', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      const data = await res.json();
      if (data.success) {
        toast.success("Deleted Successfully");
        setPromos(promos.filter(prom => prom._id !== id))
      } else {
        toast.error('Failed to Delete')
      }

    } catch (error) {
      console.error(error);

    }
  }

  const handleEditClick = (promo) => {
    setEditingPromo(promo._id);
    setEditPromo({
      title: promo.title || "",
      buttonLink: promo.buttonLink || "",
      buttonText: promo.buttonText || "",
      description: promo.description || "",
      image: null, // Don't pre-fill image, user can upload new one
    });
    setIsEditDialogOpen(true);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isEditing) return;
    if (!editPromo.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editPromo.buttonLink.trim()) {
      toast.error("Button Link is required");
      return;
    }
    if (!editPromo.buttonText.trim()) {
      toast.error("Button Text is required");
      return;
    }

    setIsEditing(true);

    let uploadedImageUrl = null;

    // Only upload if a new image is provided
    if (editPromo.image) {
      try {
        const uploadResult = await uploadImagePromised(editPromo.image, setUploading, setUploadProgress);
        uploadedImageUrl = typeof uploadResult === 'object' && uploadResult.url ? uploadResult.url : uploadResult;
      } catch (error) {
        console.log('Image upload failed, ', error);
        toast.error("Image upload failed. Please try again.");
        setIsEditing(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", editingPromo);
    formData.append("title", editPromo.title);
    formData.append("buttonLink", editPromo.buttonLink);
    formData.append("buttonText", editPromo.buttonText);
    formData.append("description", editPromo.description);

    if (uploadedImageUrl) {
      formData.append("image", uploadedImageUrl);
    }

    try {
      const res = await fetch("/api/ads-promo", {
        method: "PUT",
        body: formData
      })

      const data = await res.json();
      if (data.success) {
        toast.success('Promo updated successfully');
        setIsEditDialogOpen(false);
        setEditingPromo(null);
        setEditPromo({ title: "", buttonLink: "", buttonText: "", description: "", image: null });
        fetchPromos();
      } else {
        toast.error("Failed to update promo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while updating");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <div className='m-6'>
      <h1 className="text-3xl font-bold mb-6">Admin Ads-Promo</h1>
      <Tabs defaultValue='allPost'>
        <TabsList>
          <TabsTrigger value='allPost'>Manage Promo</TabsTrigger>
          <TabsTrigger value='post'>Create Promo</TabsTrigger>

        </TabsList>

        <TabsContent value='post'>
          <Card className="w-full mx-auto mb-5">

            <CardHeader>
              <h2 className="text-2xl font-bold text-center">
                Create New Promo
              </h2>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreate}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-lg font-medium">
                      Title:
                    </Label>
                    <Input
                      id="title"
                      value={newPromo.title}
                      onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                      placeholder="Enter post title..."


                      className="mt-1 h-10 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonLink" className="text-lg font-medium">
                      Button Link:
                    </Label>
                    <Input
                      id="buttonLink"
                      value={newPromo.buttonLink}
                      onChange={(e) => setNewPromo({ ...newPromo, buttonLink: e.target.value })}
                      placeholder="Enter button link..."

                      className="mt-1 h-10 resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buttonText" className="text-lg font-medium">
                      Button Text:
                    </Label>
                    <Input
                      id="buttonText"
                      value={newPromo.buttonText}
                      onChange={(e) => setNewPromo({ ...newPromo, buttonText: e.target.value })}
                      placeholder="Enter button text here..."

                      className="mt-1 h-10 resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-lg font-medium">
                      Description(Optional):
                    </Label>

                    <Textarea
                      id="description"
                      value={newPromo.description}
                      onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                      placeholder="Description"

                      className="mt-1 h-32 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-lg font-medium">
                      Add Photo:
                    </Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Label
                        htmlFor="image"
                        className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                      >
                        {newPromo.image ? (
                          <div className="relative w-full h-full">
                            {newPromo.image.type.startsWith("image/") && (
                              <Image
                                src={URL.createObjectURL(newPromo.image)}
                                alt="Aperçu"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1"
                              onClick={() =>
                                setNewPromo({ ...newPromo, image: null })
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <ImagePlus className="w-6 h-6 text-gray-600" />
                            <span className="font-medium text-gray-600">
                              Click to upload
                            </span>
                          </span>
                        )}
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setNewPromo({ ...newPromo, image: file })
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                </div>
                <div className='flex justify-center pt-5'>
                  <Button
                    type="submit"
                    className="w-1/2 text-white"

                  >
                    Create Promo

                  </Button>
                </div>
              </form>
            </CardContent>

          </Card>
        </TabsContent>
        <TabsContent value='allPost'>
          <Card className="p-4 space-y-4">
            <h2 className="text-xl font-bold">All Promos</h2>
            {
              promos.map((promo) => {
                return <div key={promo._id} className="border p-3 rounded flex justify-between items-center">
                  <div className='flex-shrink-0 w-28 h-28 overflow-hidden'>
                    <Image src={promo.image} width={500} height={500} alt='image' className='h-full w-full object-contain'></Image>

                  </div>

                  <div className='flex-1 text-center'><p className="font-semibold">{promo.title}</p>
                    <p className="text-sm text-gray-500">{promo.buttonText}</p>
                  </div>


                  <div className='flex items-end gap-6'>
                    <Button
                      className={`${promo.isActive ? 'text-white' : 'text-black'} rounded-full`}
                      variant={promo.isActive ? "default" : "secondary"}
                      onClick={() => toggleActive(promo._id, promo.isActive)}>
                      {promo.isActive ? 'Deactive' : 'Actif'}
                      {console.log(promo.isActive.length)}
                    </Button>

                    <Dialog open={isEditDialogOpen && editingPromo === promo._id} onOpenChange={(open) => {
                      if (!open) {
                        setIsEditDialogOpen(false);
                        setEditingPromo(null);
                        setEditPromo({ title: "", buttonLink: "", buttonText: "", description: "", image: null });
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditClick(promo)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Promo</DialogTitle>
                          <DialogDescription>
                            Update the promo details below. Leave image empty to keep the current image.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate}>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="edit-title" className="text-lg font-medium">
                                Title:
                              </Label>
                              <Input
                                id="edit-title"
                                value={editPromo.title}
                                onChange={(e) => setEditPromo({ ...editPromo, title: e.target.value })}
                                placeholder="Enter promo title..."
                                className="mt-1 h-10"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-buttonLink" className="text-lg font-medium">
                                Button Link:
                              </Label>
                              <Input
                                id="edit-buttonLink"
                                value={editPromo.buttonLink}
                                onChange={(e) => setEditPromo({ ...editPromo, buttonLink: e.target.value })}
                                placeholder="Enter button link..."
                                className="mt-1 h-10"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-buttonText" className="text-lg font-medium">
                                Button Text:
                              </Label>
                              <Input
                                id="edit-buttonText"
                                value={editPromo.buttonText}
                                onChange={(e) => setEditPromo({ ...editPromo, buttonText: e.target.value })}
                                placeholder="Enter button text here..."
                                className="mt-1 h-10"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-description" className="text-lg font-medium">
                                Description(Optional):
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={editPromo.description}
                                onChange={(e) => setEditPromo({ ...editPromo, description: e.target.value })}
                                placeholder="Description"
                                className="mt-1 h-32 resize-none"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-image" className="text-lg font-medium">
                                Update Photo (Optional - leave empty to keep current):
                              </Label>
                              <div className="mt-1 flex items-center space-x-2">
                                <Label
                                  htmlFor="edit-image"
                                  className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                                >
                                  {editPromo.image ? (
                                    <div className="relative w-full h-full">
                                      {editPromo.image.type.startsWith("image/") && (
                                        <Image
                                          src={URL.createObjectURL(editPromo.image)}
                                          alt="Aperçu"
                                          width={100}
                                          height={100}
                                          className="w-full h-full object-cover rounded-md"
                                        />
                                      )}
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1"
                                        onClick={() =>
                                          setEditPromo({ ...editPromo, image: null })
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                                      <Image
                                        src={promo.image}
                                        alt="Current"
                                        width={100}
                                        height={100}
                                        className="mx-auto h-20 w-auto object-contain rounded-md"
                                      />
                                      <p className="text-xs text-gray-400 mt-2">Click to upload new image</p>
                                    </div>
                                  )}
                                </Label>
                                <Input
                                  id="edit-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      setEditPromo({ ...editPromo, image: file })
                                    }
                                  }}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditDialogOpen(false);
                                setEditingPromo(null);
                                setEditPromo({ title: "", buttonLink: "", buttonText: "", description: "", image: null });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isEditing}
                            >
                              {isEditing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                'Update Promo'
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this promo? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePromo(promo._id)}
                          >
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </div>
              })
            }
          </Card>
        </TabsContent>
      </Tabs>



    </div>
  )
}

export default AdsPromo
