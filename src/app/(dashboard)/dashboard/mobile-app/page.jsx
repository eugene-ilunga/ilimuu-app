"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Smartphone, Plus, Trash2, ImageIcon, MoveUp, MoveDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function MobileAppEditor() {
  const [mobileApp, setMobileApp] = useState({
    heroTitle: "",
    heroDescription: "",
    downloadButtonText: "Download the App",
    downloadLink: "",
    qrCodeImage: "/assets/custom-image/qr-code.png",
    showQRCode: true,
    features: [],
    metaTitle: "Mobile App - ELIMUU",
    metaDescription: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMobileApp()
  }, [])

  const fetchMobileApp = async () => {
    try {
      const response = await fetch("/api/mobile-app")
      if (response.ok) {
        const data = await response.json()
        setMobileApp(data)
      } else {
        toast({
          title: "Erreur",
          description: "Failed to load mobile app content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to load mobile app content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setMobileApp((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const handleImageUpload = async (file, targetField, featureIndex = null) => {
    if (!file) return

    setUploadingImage(targetField)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        
        if (featureIndex !== null) {
          updateFeature(featureIndex, 'image', data.url)
        } else {
          handleInputChange(targetField, data.url)
        }
        
        toast({
          title: "Succès",
          description: "Image uploaded successfully",
        })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Erreur",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(null)
    }
  }

  const addFeature = () => {
    setMobileApp((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          title: "",
          description: "",
          image: "",
          tags: [],
          displayOrder: prev.features.length + 1,
          isActive: true,
        },
      ],
    }))
    setHasChanges(true)
  }

  const removeFeature = (index) => {
    setMobileApp((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const updateFeature = (index, field, value) => {
    setMobileApp((prev) => ({
      ...prev,
      features: prev.features.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
    setHasChanges(true)
  }

  const moveFeature = (index, direction) => {
    const newFeatures = [...mobileApp.features]
    if (direction === 'up' && index > 0) {
      [newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]]
    } else if (direction === 'down' && index < newFeatures.length - 1) {
      [newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]]
    }
    
    // Update display order
    newFeatures.forEach((feature, idx) => {
      feature.displayOrder = idx + 1
    })
    
    setMobileApp((prev) => ({
      ...prev,
      features: newFeatures,
    }))
    setHasChanges(true)
  }

  const addTag = (featureIndex) => {
    const tagInput = prompt("Enter tag name:")
    if (tagInput && tagInput.trim()) {
      updateFeature(featureIndex, 'tags', [...mobileApp.features[featureIndex].tags, tagInput.trim()])
    }
  }

  const removeTag = (featureIndex, tagIndex) => {
    const newTags = mobileApp.features[featureIndex].tags.filter((_, i) => i !== tagIndex)
    updateFeature(featureIndex, 'tags', newTags)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/mobile-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mobileApp),
      })

      if (response.ok) {
        setHasChanges(false)
        toast({
          title: "Succès",
          description: "Mobile app page updated successfully",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Failed to save mobile app content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to save mobile app content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="m-6">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Smartphone className="h-8 w-8" />
              Mobile App Page Editor
            </h1>
            <p className="text-muted-foreground mt-2">Manage your mobile app page content</p>
          </div>
          <Button
            className="min-w-[120px] text-white disabled:opacity-100"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {hasChanges && (
          <Alert className="mb-6">
            <AlertDescription>You have unsaved changes. Don&apos;t forget to save your updates.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Hero Section
              </CardTitle>
              <CardDescription>Main header content and download section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Textarea
                  id="heroTitle"
                  value={mobileApp.heroTitle}
                  onChange={(e) => handleInputChange("heroTitle", e.target.value)}
                  placeholder="Learn anytime anywhere..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea
                  id="heroDescription"
                  value={mobileApp.heroDescription}
                  onChange={(e) => handleInputChange("heroDescription", e.target.value)}
                  placeholder="Access all your courses..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downloadButtonText">Download Button Text</Label>
                  <Input
                    id="downloadButtonText"
                    value={mobileApp.downloadButtonText}
                    onChange={(e) => handleInputChange("downloadButtonText", e.target.value)}
                    placeholder="Download the App"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downloadLink">Download Link</Label>
                  <Input
                    id="downloadLink"
                    type="url"
                    value={mobileApp.downloadLink}
                    onChange={(e) => handleInputChange("downloadLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show QR Code</Label>
                    <p className="text-sm text-muted-foreground">Display QR code for app download</p>
                  </div>
                  <Switch
                    checked={mobileApp.showQRCode}
                    onCheckedChange={(checked) => handleInputChange("showQRCode", checked)}
                  />
                </div>
                {mobileApp.showQRCode && (
                  <div className="space-y-2">
                    <Label htmlFor="qrCodeImage">QR Code Image</Label>
                    <div className="flex items-center gap-4">
                      {mobileApp.qrCodeImage && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                          <Image
                            src={mobileApp.qrCodeImage}
                            alt="QR Code"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id="qrCodeImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files?.[0], 'qrCodeImage')}
                          disabled={uploadingImage === 'qrCodeImage'}
                        />
                        {uploadingImage === 'qrCodeImage' && (
                          <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>App Features</span>
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardTitle>
              <CardDescription>Manage the features and pages showcased in the mobile app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mobileApp.features?.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Smartphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No features added yet</h3>
                  <p className="text-muted-foreground mb-4">Add your first feature to get started</p>
                  <Button onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              ) : (
                mobileApp.features.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Feature {index + 1}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          onClick={() => moveFeature(index, 'up')}
                          size="sm"
                          variant="outline"
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => moveFeature(index, 'down')}
                          size="sm"
                          variant="outline"
                          disabled={index === mobileApp.features.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => removeFeature(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(index, "title", e.target.value)}
                        placeholder="1. Home Page"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, "description", e.target.value)}
                        placeholder="Feature description..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="flex items-center gap-4">
                        {feature.image && (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                            <Image
                              src={feature.image}
                              alt={feature.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files?.[0], `feature-${index}`, index)}
                            disabled={uploadingImage === `feature-${index}`}
                          />
                          {uploadingImage === `feature-${index}` && (
                            <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Tags</Label>
                        <Button
                          type="button"
                          onClick={() => addTag(index)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Tag
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {feature.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-orange-500/20 text-orange-600 px-3 py-1.5 rounded-full text-sm border border-orange-500/30 flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index, tagIndex)}
                              className="hover:text-red-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label>Active Status</Label>
                        <p className="text-sm text-muted-foreground">Show this feature on the page</p>
                      </div>
                      <Switch
                        checked={feature.isActive}
                        onCheckedChange={(checked) => updateFeature(index, "isActive", checked)}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* SEO Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Information</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={mobileApp.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="Mobile App - ELIMUU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={mobileApp.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="Description for search engines..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button at Bottom */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            size="lg"
            className="min-w-[150px] disabled:opacity-100 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

