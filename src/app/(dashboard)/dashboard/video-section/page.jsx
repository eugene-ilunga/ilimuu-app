"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Video, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VideoSectionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    _id: null,
    badge: "",
    title: "",
    description: "",
    videoUrl: "",
    button1Text: "",
    button1Link: "",
    button2Text: "",
    button2Link: "",
    isActive: true,
  })

  useEffect(() => {
    fetchVideoSection()
  }, [])

  const fetchVideoSection = async () => {
    try {
      const response = await fetch("/api/video-section")
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setFormData(result.data)
        }
      } else {
        toast({
          title: "Erreur",
          description: "Failed to load video section data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to load video section data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.videoUrl) {
      toast({
        title: "Erreur",
        description: "Title, description, and video URL are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/video-section", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: result.message,
        })
        fetchVideoSection()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Failed to save video section",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to save video section",
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
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Video className="h-8 w-8" />
              Video Section Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage the video section content on your homepage
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Section Content</CardTitle>
            <CardDescription>
              Update the promotional video section displayed on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Badge */}
            <div className="space-y-2">
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={formData.badge}
                onChange={(e) => handleInputChange("badge", e.target.value)}
                placeholder="Our about us"
              />
              <p className="text-xs text-muted-foreground">
                Small text displayed above the title
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="🎉 40% OFF for the First 100 Customers!"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter a compelling description..."
                rows={4}
                required
              />
            </div>

            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL *</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                placeholder="https://youtu.be/6lwh_jfLn2g"
                required
              />
              <p className="text-xs text-muted-foreground">
                YouTube or Vimeo video URL
              </p>
            </div>

            {/* Button 1 */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Button 1</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button1Text">Button 1 Text</Label>
                  <Input
                    id="button1Text"
                    value={formData.button1Text}
                    onChange={(e) => handleInputChange("button1Text", e.target.value)}
                    placeholder="Join With Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button1Link">Button 1 Link</Label>
                  <Input
                    id="button1Link"
                    value={formData.button1Link}
                    onChange={(e) => handleInputChange("button1Link", e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>

            {/* Button 2 */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Button 2</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button2Text">Button 2 Text</Label>
                  <Input
                    id="button2Text"
                    value={formData.button2Text}
                    onChange={(e) => handleInputChange("button2Text", e.target.value)}
                    placeholder="Our Courses"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button2Link">Button 2 Link</Label>
                  <Input
                    id="button2Link"
                    value={formData.button2Link}
                    onChange={(e) => handleInputChange("button2Link", e.target.value)}
                    placeholder="/courselist"
                  />
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show this section on the homepage
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving} className="text-white">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

