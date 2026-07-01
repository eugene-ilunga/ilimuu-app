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
import { Loader2, Save, FileText, Users, Target, Eye, TrendingUp, Plus, Trash2, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function AboutPageEditor() {
  const [aboutPage, setAboutPage] = useState({
    bannerImage: "/assets/custom-image/BannerImageAboutPage.jpg",
    subheading: "About us",
    mainHeading: "About Our Company",
    description: "",
    teamSectionTitle: "Our Team",
    showTeamSection: true,
    showMissionSection: false,
    missionTitle: "Our Mission",
    missionDescription: "",
    showVisionSection: false,
    visionTitle: "Our Vision",
    visionDescription: "",
    showValuesSection: false,
    valuesTitle: "Our Values",
    values: [],
    showStatsSection: false,
    stats: [],
    metaTitle: "About Us - ELIMUU",
    metaDescription: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAboutPage()
  }, [])

  const fetchAboutPage = async () => {
    try {
      const response = await fetch("/api/about-page")
      if (response.ok) {
        const data = await response.json()
        setAboutPage(data)
        setImagePreview(data.bannerImage)
      } else {
        toast({
          title: "Erreur",
          description: "Failed to load about page content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to load about page content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setAboutPage((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload image
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/fileupload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        handleInputChange('bannerImage', data.url)
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
      setUploadingImage(false)
    }
  }

  const addValue = () => {
    setAboutPage((prev) => ({
      ...prev,
      values: [...prev.values, { title: "", description: "", icon: "" }],
    }))
    setHasChanges(true)
  }

  const removeValue = (index) => {
    setAboutPage((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const updateValue = (index, field, value) => {
    setAboutPage((prev) => ({
      ...prev,
      values: prev.values.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
    setHasChanges(true)
  }

  const addStat = () => {
    setAboutPage((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: "", value: "", icon: "" }],
    }))
    setHasChanges(true)
  }

  const removeStat = (index) => {
    setAboutPage((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
    setHasChanges(true)
  }

  const updateStat = (index, field, value) => {
    setAboutPage((prev) => ({
      ...prev,
      stats: prev.stats.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/about-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutPage),
      })

      if (response.ok) {
        setHasChanges(false)
        toast({
          title: "Succès",
          description: "About page updated successfully",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Failed to save about page content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to save about page content",
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
              <FileText className="h-8 w-8" />
              About Page Editor
            </h1>
            <p className="text-muted-foreground mt-2">Manage your about page content</p>
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
                <ImageIcon className="h-5 w-5" />
                Hero Section
              </CardTitle>
              <CardDescription>Main banner and introduction content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bannerImage">Banner Image</Label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="bannerImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && (
                      <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subheading">Subheading</Label>
                <Input
                  id="subheading"
                  value={aboutPage.subheading}
                  onChange={(e) => handleInputChange("subheading", e.target.value)}
                  placeholder="About us"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainHeading">Main Heading</Label>
                <Input
                  id="mainHeading"
                  value={aboutPage.mainHeading}
                  onChange={(e) => handleInputChange("mainHeading", e.target.value)}
                  placeholder="About Our Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={aboutPage.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Write about your company..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Section
              </CardTitle>
              <CardDescription>Configure team display settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Team Section</Label>
                  <p className="text-sm text-muted-foreground">Display team members on about page</p>
                </div>
                <Switch
                  checked={aboutPage.showTeamSection}
                  onCheckedChange={(checked) => handleInputChange("showTeamSection", checked)}
                />
              </div>
              {aboutPage.showTeamSection && (
                <div className="space-y-2">
                  <Label htmlFor="teamSectionTitle">Team Section Title</Label>
                  <Input
                    id="teamSectionTitle"
                    value={aboutPage.teamSectionTitle}
                    onChange={(e) => handleInputChange("teamSectionTitle", e.target.value)}
                    placeholder="Our Team"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mission Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mission Section
              </CardTitle>
              <CardDescription>Define your company mission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Mission Section</Label>
                  <p className="text-sm text-muted-foreground">Display mission statement</p>
                </div>
                <Switch
                  checked={aboutPage.showMissionSection}
                  onCheckedChange={(checked) => handleInputChange("showMissionSection", checked)}
                />
              </div>
              {aboutPage.showMissionSection && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="missionTitle">Mission Title</Label>
                    <Input
                      id="missionTitle"
                      value={aboutPage.missionTitle}
                      onChange={(e) => handleInputChange("missionTitle", e.target.value)}
                      placeholder="Our Mission"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="missionDescription">Mission Description</Label>
                    <Textarea
                      id="missionDescription"
                      value={aboutPage.missionDescription}
                      onChange={(e) => handleInputChange("missionDescription", e.target.value)}
                      placeholder="Describe your mission..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Vision Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Vision Section
              </CardTitle>
              <CardDescription>Define your company vision</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Vision Section</Label>
                  <p className="text-sm text-muted-foreground">Display vision statement</p>
                </div>
                <Switch
                  checked={aboutPage.showVisionSection}
                  onCheckedChange={(checked) => handleInputChange("showVisionSection", checked)}
                />
              </div>
              {aboutPage.showVisionSection && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="visionTitle">Vision Title</Label>
                    <Input
                      id="visionTitle"
                      value={aboutPage.visionTitle}
                      onChange={(e) => handleInputChange("visionTitle", e.target.value)}
                      placeholder="Our Vision"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visionDescription">Vision Description</Label>
                    <Textarea
                      id="visionDescription"
                      value={aboutPage.visionDescription}
                      onChange={(e) => handleInputChange("visionDescription", e.target.value)}
                      placeholder="Describe your vision..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Values Section
              </CardTitle>
              <CardDescription>Define your company values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Values Section</Label>
                  <p className="text-sm text-muted-foreground">Display company values</p>
                </div>
                <Switch
                  checked={aboutPage.showValuesSection}
                  onCheckedChange={(checked) => handleInputChange("showValuesSection", checked)}
                />
              </div>
              {aboutPage.showValuesSection && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="valuesTitle">Values Section Title</Label>
                    <Input
                      id="valuesTitle"
                      value={aboutPage.valuesTitle}
                      onChange={(e) => handleInputChange("valuesTitle", e.target.value)}
                      placeholder="Our Values"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Values List</Label>
                      <Button type="button" onClick={addValue} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Value
                      </Button>
                    </div>
                    {aboutPage.values?.map((value, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Value {index + 1}</Label>
                          <Button
                            type="button"
                            onClick={() => removeValue(index)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          placeholder="Value Title"
                        />
                        <Textarea
                          value={value.description}
                          onChange={(e) => updateValue(index, "description", e.target.value)}
                          placeholder="Value Description"
                          rows={2}
                        />
                        <Input
                          value={value.icon}
                          onChange={(e) => updateValue(index, "icon", e.target.value)}
                          placeholder="Icon name (optional)"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistics Section
              </CardTitle>
              <CardDescription>Display company statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Statistics Section</Label>
                  <p className="text-sm text-muted-foreground">Display company stats</p>
                </div>
                <Switch
                  checked={aboutPage.showStatsSection}
                  onCheckedChange={(checked) => handleInputChange("showStatsSection", checked)}
                />
              </div>
              {aboutPage.showStatsSection && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Statistics List</Label>
                    <Button type="button" onClick={addStat} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Statistic
                    </Button>
                  </div>
                  {aboutPage.stats?.map((stat, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Stat {index + 1}</Label>
                        <Button
                          type="button"
                          onClick={() => removeStat(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={stat.value}
                        onChange={(e) => updateStat(index, "value", e.target.value)}
                        placeholder="Value (e.g., 1000+)"
                      />
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(index, "label", e.target.value)}
                        placeholder="Label (e.g., Students)"
                      />
                      <Input
                        value={stat.icon}
                        onChange={(e) => updateStat(index, "icon", e.target.value)}
                        placeholder="Icon name (optional)"
                      />
                    </div>
                  ))}
                </div>
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
                  value={aboutPage.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="About Us - ELIMUU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={aboutPage.metaDescription}
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

