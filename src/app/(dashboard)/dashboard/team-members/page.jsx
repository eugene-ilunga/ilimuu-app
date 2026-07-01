"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Users, Plus, Edit, Trash2, Facebook, Linkedin, Twitter, Instagram, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "/assets/placeholder.jpg",
    bio: "",
    email: "",
    phone: "",
    facebookLink: "",
    linkedinLink: "",
    twitterLink: "",
    instagramLink: "",
    displayOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team-member")
      if (response.ok) {
        const result = await response.json()
        setTeamMembers(result.data || [])
      } else {
        toast({
          title: "Erreur",
          description: "Failed to load team members",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to load team members",
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
        handleInputChange('image', data.url)
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

  const openAddDialog = () => {
    setEditingMember(null)
    setFormData({
      name: "",
      position: "",
      image: "/assets/placeholder.jpg",
      bio: "",
      email: "",
      phone: "",
      facebookLink: "",
      linkedinLink: "",
      twitterLink: "",
      instagramLink: "",
      displayOrder: teamMembers.length,
      isActive: true,
    })
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (member) => {
    setEditingMember(member)
    setFormData(member)
    setImagePreview(member.image)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.position) {
      toast({
        title: "Erreur",
        description: "Name and position are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const method = editingMember ? "PUT" : "POST"
      const url = "/api/team-member"
      
      const dataToSend = editingMember 
        ? { ...formData, _id: editingMember._id }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: result.message,
        })
        setIsDialogOpen(false)
        fetchTeamMembers()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Failed to save team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to save team member",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return
    }

    try {
      const response = await fetch(`/api/team-member?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "Team member deleted successfully",
        })
        fetchTeamMembers()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Failed to delete team member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to delete team member",
        variant: "destructive",
      })
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
              <Users className="h-8 w-8" />
              Team Members
            </h1>
            <p className="text-muted-foreground mt-2">Manage your team members</p>
          </div>
          <Button className="text-white" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Team Members</CardTitle>
            <CardDescription>
              {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
                <p className="text-muted-foreground mb-4">Get started by adding your first team member</p>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={member.image || "/assets/placeholder.jpg"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.email || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember 
                ? "Update team member information" 
                : "Add a new team member to your team"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="image"
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

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Software Engineer"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Brief description about the team member..."
                rows={3}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Social Media Links</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="facebookLink" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Label>
                  <Input
                    id="facebookLink"
                    value={formData.facebookLink}
                    onChange={(e) => handleInputChange("facebookLink", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinLink" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={(e) => handleInputChange("linkedinLink", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterLink" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitterLink"
                    value={formData.twitterLink}
                    onChange={(e) => handleInputChange("twitterLink", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramLink" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagramLink"
                    value={formData.instagramLink}
                    onChange={(e) => handleInputChange("instagramLink", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleInputChange("displayOrder", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Show this member on the about page
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="text-white">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

