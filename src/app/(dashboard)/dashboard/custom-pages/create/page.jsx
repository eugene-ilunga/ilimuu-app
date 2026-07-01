"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreateCustomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    showInFooter: true,
    isActive: true,
    order: 0,
    metaDescription: "",
    metaKeywords: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title") {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        slug: autoSlug,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Title, slug, and content are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("showInFooter", formData.showInFooter);
      formDataToSend.append("isActive", formData.isActive);
      formDataToSend.append("order", formData.order);
      formDataToSend.append("metaDescription", formData.metaDescription);
      formDataToSend.append("metaKeywords", formData.metaKeywords);

      const response = await fetch("/api/custom-pages/add-new", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.status === 200) {
        toast({
          title: "Succès",
          description: "Custom page created successfully",
        });
        router.push("/dashboard/custom-pages");
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Failed to create page",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Failed to create page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="m-6">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/custom-pages">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <FileText className="h-8 w-8" />
                  Create New Page
                </h1>
                <p className="text-muted-foreground mt-2">
                  Create a custom page that will appear in your footer
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the title and URL slug for your page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Page Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Privacy Policy, Terms of Service"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    URL Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="e.g., privacy-policy"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    URL: {typeof window !== 'undefined' ? window.location.origin : ''}/page/{formData.slug || "your-slug"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower numbers appear first in the footer
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>
                  Write and format your page content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => handleInputChange("content", value)}
                    placeholder="Start writing your page content here..."
                  />
                  <p className="text-sm text-muted-foreground">
                    Use the toolbar to format your text. The content will be saved as HTML automatically.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>
                  Configure how and where this page appears
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show in Footer</Label>
                    <p className="text-sm text-muted-foreground">
                      Display this page in the footer useful links section
                    </p>
                  </div>
                  <Switch
                    checked={formData.showInFooter}
                    onCheckedChange={(checked) =>
                      handleInputChange("showInFooter", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this page visible to users
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                </div>
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
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleInputChange("metaDescription", e.target.value)
                    }
                    placeholder="Brief description for search engines (150-160 characters)"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) =>
                      handleInputChange("metaKeywords", e.target.value)
                    }
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Link href="/dashboard/custom-pages">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[150px] disabled:opacity-100 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Page
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

