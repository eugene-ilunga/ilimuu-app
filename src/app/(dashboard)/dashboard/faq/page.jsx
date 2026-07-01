"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, HelpCircle, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const FAQ_CATEGORIES = [
  "Général",
  "Account",
  "Cours",
  "Paiement",
  "Technical",
  "Support",
  "Other"
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [filterCategory, setFilterCategory] = useState("Tous")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Général",
    displayOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    fetchFaqs()
  }, [filterCategory])

  const fetchFaqs = async () => {
    try {
      let url = "/api/faq"
      if (filterCategory && filterCategory !== "Tous") {
        url += `?category=${filterCategory}`
      }
      
      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        setFaqs(result.data || [])
      } else {
        toast({
          title: "Erreur",
          description: "Failed to load FAQs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to load FAQs",
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

  const openAddDialog = () => {
    setEditingFaq(null)
    setFormData({
      question: "",
      answer: "",
      category: "Général",
      displayOrder: faqs.length,
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (faq) => {
    setEditingFaq(faq)
    setFormData(faq)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: "Erreur",
        description: "Question and answer are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const method = editingFaq ? "PUT" : "POST"
      const url = "/api/faq"
      
      const dataToSend = editingFaq 
        ? { ...formData, _id: editingFaq._id }
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
        fetchFaqs()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Failed to save FAQ",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to save FAQ",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) {
      return
    }

    try {
      const response = await fetch(`/api/faq?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Succès",
          description: "FAQ deleted successfully",
        })
        fetchFaqs()
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Failed to delete FAQ",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Failed to delete FAQ",
        variant: "destructive",
      })
    }
  }

  const filteredFaqs = filterCategory === "Tous" 
    ? faqs 
    : faqs.filter(faq => faq.category === filterCategory)

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
              <HelpCircle className="h-8 w-8" />
              FAQ Management
            </h1>
            <p className="text-muted-foreground mt-2">Manage frequently asked questions</p>
          </div>
          <Button className="text-white" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All FAQs</CardTitle>
                <CardDescription>
                  {filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? 's' : ''} total
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="filter-category">Filter by Category:</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]" id="filter-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">All Categories</SelectItem>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No FAQs yet</h3>
                <p className="text-muted-foreground mb-4">Get started by adding your first FAQ</p>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaqs.map((faq) => (
                    <TableRow key={faq._id}>
                      <TableCell className="font-medium max-w-md">
                        <div className="truncate">{faq.question}</div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {faq.category}
                        </span>
                      </TableCell>
                      <TableCell>{faq.displayOrder}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          faq.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(faq)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(faq._id)}
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
              {editingFaq ? "Edit FAQ" : "Add FAQ"}
            </DialogTitle>
            <DialogDescription>
              {editingFaq 
                ? "Update FAQ information" 
                : "Add a new frequently asked question"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {FAQ_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange("question", e.target.value)}
                placeholder="What is your question?"
                required
              />
            </div>

            {/* Answer */}
            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => handleInputChange("answer", e.target.value)}
                placeholder="Provide a detailed answer..."
                rows={6}
                required
              />
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
                  Show this FAQ on the website
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

