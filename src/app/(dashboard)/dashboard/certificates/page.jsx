"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import toast from "react-hot-toast";
import {
  Download,
  Eye,
  RefreshCcw,
  Award,
  CalendarDays,
  ShieldCheck,
  User,
  Palette,
  Sparkles,
  FileText,
  CheckCircle2,
  Building2,
  Image as ImageIcon,
  PenTool,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const DEFAULT_FORM_STATE = {
  userName: "",
  userEmail: "",
  bootcampName: "",
  certificateLevel: "A",
  score: "90",
  issueDate: new Date().toISOString().split("T")[0],
  certificateNumber: "",
  verificationCode: "",
  organizationName: "ELIMUU",
  organizationTagline: "Empowering Future Professionals",
  logoUrl: "",
  watermarkText: "ELIMUU",
  signatureLeftName: "Program Director",
  signatureLeftTitle: "Program Director",
  signatureLeftImage: "",
  signatureRightName: "Chief Learning Officer",
  signatureRightTitle: "Chief Learning Officer",
  signatureRightImage: "",
};

export default function CertificateGeneratorPage() {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState([]);
  const [preview, setPreview] = useState(null);

  const previewUrl = useMemo(() => {
    if (!preview?.base64) return null;
    
    // Convert base64 to blob URL for better browser compatibility
    try {
      const byteCharacters = atob(preview.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating blob URL:', error);
      // Fallback to data URI
      return `data:application/pdf;base64,${preview.base64}`;
    }
  }, [preview]);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const certificateLevelCopy = useMemo(
    () => ({
      A: "Level A • Elite Distinction",
      B: "Level B • Advanced Merit",
      C: "Level C • Certified Graduate",
    }),
    []
  );

  const formattedIssueDate = useMemo(() => {
    if (!formData.issueDate) {
      return "Not set";
    }
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(formData.issueDate));
    } catch {
      return formData.issueDate;
    }
  }, [formData.issueDate]);

  const quickStats = useMemo(
    () => [
      {
        label: "Learner",
        value: formData.userName?.trim() || "Awaiting input",
        icon: User,
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-50 to-cyan-50",
      },
      {
        label: "Recognition level",
        value:
          certificateLevelCopy[formData.certificateLevel] ||
          formData.certificateLevel ||
          "Not set",
        icon: Award,
        gradient: "from-amber-500 to-orange-500",
        bgGradient: "from-amber-50 to-orange-50",
      },
      {
        label: "Achievement score",
        value: formData.score ? `${formData.score}%` : "Not set",
        icon: ShieldCheck,
        gradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-50 to-teal-50",
      },
      {
        label: "Issuance date",
        value: formattedIssueDate,
        icon: CalendarDays,
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-50 to-pink-50",
      },
    ],
    [
      certificateLevelCopy,
      formData.certificateLevel,
      formData.score,
      formData.userName,
      formattedIssueDate,
    ]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneratePreview = async (event) => {
    event.preventDefault();
    setApiErrors([]);
    setIsLoading(true);
    setPreview(null);

    try {
      const response = await fetch("/api/admin/certificates/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          userEmail: formData.userEmail,
          bootcampName: formData.bootcampName,
          certificateLevel: formData.certificateLevel,
          score: Number(formData.score),
          issueDate: formData.issueDate,
          certificateNumber: formData.certificateNumber,
          verificationCode: formData.verificationCode,
          organizationName: formData.organizationName,
          organizationTagline: formData.organizationTagline,
          logoUrl: formData.logoUrl,
          watermarkText: formData.watermarkText,
          signatureLeftName: formData.signatureLeftName,
          signatureLeftTitle: formData.signatureLeftTitle,
          signatureLeftImage: formData.signatureLeftImage,
          signatureRightName: formData.signatureRightName,
          signatureRightTitle: formData.signatureRightTitle,
          signatureRightImage: formData.signatureRightImage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        const validationErrors = data?.errors || [];
        setApiErrors(validationErrors);
        toast.error(
          data?.message || "Failed to generate certificate preview."
        );
        return;
      }

      setPreview(data);
      toast.success("Certificate preview generated successfully!");
    } catch (error) {
      console.error("Certificate preview error:", error);
      toast.error("Something went wrong while generating the certificate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl || !preview?.fileName) return;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = preview.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Certificate downloaded successfully!");
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_STATE);
    setPreview(null);
    setApiErrors([]);
    toast.success("Form reset to default values");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className="mb-2 rounded-full border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 shadow-sm"
                  >
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Certificate Studio
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    Certificate Generator
                  </h1>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                Create professional, branded certificates with live previews, custom branding, and digital signatures. 
                Design and download in seconds.
              </p>
            </div>
            {preview && (
              <Badge className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Preview Ready
              </Badge>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((item) => (
              <Card
                key={item.label}
                className="group relative overflow-hidden border-0 bg-white/80 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-slate-200/50"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <CardContent className="relative flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-slate-200/50 transition-transform duration-300 group-hover:scale-110`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate text-base font-bold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr] xl:grid-cols-[1.3fr_0.85fr]">
          {/* Form Section */}
          <Card className="border-0 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <PenTool className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Certificate Details
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    Fill in the information below to generate your certificate
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleGeneratePreview}>
                <Tabs defaultValue="details" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1.5">
                    <TabsTrigger
                      value="details"
                      className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Learner
                    </TabsTrigger>
                    <TabsTrigger
                      value="branding"
                      className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Branding
                    </TabsTrigger>
                    <TabsTrigger
                      value="signatures"
                      className="rounded-lg text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Signatures
                    </TabsTrigger>
                  </TabsList>

                  {/* Learner Tab */}
                  <TabsContent value="details" className="space-y-5 rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <User className="h-4 w-4 text-blue-600" />
                      Learner Information
                    </div>
                    
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="userName" className="text-sm font-semibold text-slate-700">
                          Student Name *
                        </Label>
                        <Input
                          id="userName"
                          name="userName"
                          placeholder="Jane Doe"
                          value={formData.userName}
                          onChange={handleInputChange}
                          required
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500">
                          This will appear prominently on the certificate
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail" className="text-sm font-semibold text-slate-700">
                          Student Email *
                        </Label>
                        <Input
                          id="userEmail"
                          name="userEmail"
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.userEmail}
                          onChange={handleInputChange}
                          required
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bootcampName" className="text-sm font-semibold text-slate-700">
                          Program or Course *
                        </Label>
                        <Input
                          id="bootcampName"
                          name="bootcampName"
                          placeholder="Full Stack Bootcamp"
                          value={formData.bootcampName}
                          onChange={handleInputChange}
                          required
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certificateLevel" className="text-sm font-semibold text-slate-700">
                          Certificate Level *
                        </Label>
                        <Select
                          value={formData.certificateLevel}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              certificateLevel: value,
                            }))
                          }
                        >
                          <SelectTrigger id="certificateLevel" className="h-11 border-slate-200 bg-white">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Level A • Elite Distinction</SelectItem>
                            <SelectItem value="B">Level B • Advanced Merit</SelectItem>
                            <SelectItem value="C">Level C • Certified Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                          {certificateLevelCopy[formData.certificateLevel] || "Choose the recognition tier"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="score" className="text-sm font-semibold text-slate-700">
                          Score (%) *
                        </Label>
                        <Input
                          id="score"
                          name="score"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={formData.score}
                          onChange={handleInputChange}
                          required
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500">
                          Used in the summary band beneath the badge
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueDate" className="text-sm font-semibold text-slate-700">
                          Issue Date *
                        </Label>
                        <Input
                          id="issueDate"
                          name="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={handleInputChange}
                          required
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="certificateNumber" className="text-sm font-semibold text-slate-700">
                          Certificate Number
                          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                        </Label>
                        <Input
                          id="certificateNumber"
                          name="certificateNumber"
                          placeholder="CERT-2025-0001"
                          value={formData.certificateNumber}
                          onChange={handleInputChange}
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode" className="text-sm font-semibold text-slate-700">
                          Verification Code
                          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                        </Label>
                        <Input
                          id="verificationCode"
                          name="verificationCode"
                          placeholder="VER-ABC12345"
                          value={formData.verificationCode}
                          onChange={handleInputChange}
                          className="h-11 border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Branding Tab */}
                  <TabsContent value="branding" className="space-y-5 rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50/30 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Palette className="h-4 w-4 text-purple-600" />
                      Brand Identity
                    </div>
                    <p className="text-xs text-slate-500">
                      Customize your organization's branding elements for the certificate
                    </p>
                    
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="organizationName" className="text-sm font-semibold text-slate-700">
                          <Building2 className="mr-1.5 inline h-3.5 w-3.5" />
                          Organization Name
                        </Label>
                        <Input
                          id="organizationName"
                          name="organizationName"
                          placeholder="ELIMUU"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          readOnly={true}
                          className="h-11 border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organizationTagline" className="text-sm font-semibold text-slate-700">
                          Organization Tagline
                        </Label>
                        <Input
                          id="organizationTagline"
                          name="organizationTagline"
                          placeholder="Empowering Future Professionals"
                          value={formData.organizationTagline}
                          onChange={handleInputChange}
                          className="h-11 border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl" className="text-sm font-semibold text-slate-700">
                          <ImageIcon className="mr-1.5 inline h-3.5 w-3.5" />
                          Logo Image URL
                          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                        </Label>
                        <Input
                          id="logoUrl"
                          name="logoUrl"
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={formData.logoUrl}
                          onChange={handleInputChange}
                          className="h-11 border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500"
                        />
                        <p className="text-xs text-slate-500">
                          Transparent PNGs work best for a refined finish
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkText" className="text-sm font-semibold text-slate-700">
                          Watermark Text
                          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                        </Label>
                        <Input
                          id="watermarkText"
                          name="watermarkText"
                          readOnly={true}
                          placeholder="ELIMUU"
                          value={formData.watermarkText}
                          onChange={handleInputChange}
                          className="h-11 border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Signatures Tab */}
                  <TabsContent value="signatures" className="space-y-5 rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <PenTool className="h-4 w-4 text-emerald-600" />
                      Digital Signatures
                    </div>
                    <p className="text-xs text-slate-500">
                      Add optional digital signatures to reinforce authenticity
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          Left Signature
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="signatureLeftName" className="text-xs font-semibold text-slate-600">
                              Name
                            </Label>
                            <Input
                              id="signatureLeftName"
                              name="signatureLeftName"
                              placeholder="Program Director"
                              value={formData.signatureLeftName}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signatureLeftTitle" className="text-xs font-semibold text-slate-600">
                              Title
                            </Label>
                            <Input
                              id="signatureLeftTitle"
                              name="signatureLeftTitle"
                              placeholder="Program Director"
                              value={formData.signatureLeftTitle}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signatureLeftImage" className="text-xs font-semibold text-slate-600">
                              Signature Image URL
                              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                            </Label>
                            <Input
                              id="signatureLeftImage"
                              name="signatureLeftImage"
                              type="url"
                              placeholder="https://example.com/signature-left.png"
                              value={formData.signatureLeftImage}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          Right Signature
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor="signatureRightName" className="text-xs font-semibold text-slate-600">
                              Name
                            </Label>
                            <Input
                              id="signatureRightName"
                              name="signatureRightName"
                              placeholder="Chief Learning Officer"
                              value={formData.signatureRightName}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signatureRightTitle" className="text-xs font-semibold text-slate-600">
                              Title
                            </Label>
                            <Input
                              id="signatureRightTitle"
                              name="signatureRightTitle"
                              placeholder="Chief Learning Officer"
                              value={formData.signatureRightTitle}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="signatureRightImage" className="text-xs font-semibold text-slate-600">
                              Signature Image URL
                              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
                            </Label>
                            <Input
                              id="signatureRightImage"
                              name="signatureRightImage"
                              type="url"
                              placeholder="https://example.com/signature-right.png"
                              value={formData.signatureRightImage}
                              onChange={handleInputChange}
                              className="h-10 border-slate-200 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {apiErrors.length > 0 && (
                  <div className="rounded-xl border-2 border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm">
                    <p className="font-semibold">Validation Errors:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {apiErrors.map((error, idx) => (
                        <li key={idx} className="text-xs">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator className="bg-slate-200" />
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    <Zap className="mr-1.5 inline h-3.5 w-3.5" />
                    Preview generates a high-fidelity PDF in seconds
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4 animate-pulse" />
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Generate Preview
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <Card className="border-0 bg-gradient-to-br from-white via-white to-slate-50/50 shadow-2xl shadow-slate-300/30 backdrop-blur-sm">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">
                        Live Preview
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {preview
                          ? "Review and download your certificate"
                          : "Generate a preview to see the result"}
                      </CardDescription>
                    </div>
                  </div>
                  {preview && (
                    <Badge className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ready
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                {previewUrl ? (
                  <>
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <object
                        data={previewUrl}
                        type="application/pdf"
                        className="h-[500px] w-full"
                        aria-label="Certificate preview"
                      >
                        <iframe
                          title="Certificate preview"
                          src={previewUrl}
                          className="h-[500px] w-full"
                        />
                      </object>
                    </div>
                    
                    <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Palette className="h-4 w-4 text-purple-600" />
                        Certificate Details
                      </div>
                      <div className="grid gap-3 text-sm">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Organization:</span>
                          <span className="font-semibold text-slate-900">
                            {preview?.meta?.organizationName || formData.organizationName || "ELIMUU"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Certificate #:</span>
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {preview?.meta?.certificateNumber}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Verification Code:</span>
                          <span className="font-mono text-xs font-semibold text-slate-900">
                            {preview?.meta?.verificationCode}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Student:</span>
                          <span className="font-semibold text-slate-900">
                            {preview?.meta?.userName}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Program:</span>
                          <span className="font-semibold text-slate-900">
                            {preview?.meta?.bootcampName}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                          <span className="font-medium text-slate-600">Score:</span>
                          <span className="font-semibold text-slate-900">
                            {preview?.meta?.score}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-slate-600">Issued:</span>
                          <span className="font-semibold text-slate-900">
                            {formattedIssueDate}
                          </span>
                        </div>
                      </div>
                    </Card>
                    
                    <Button 
                      onClick={handleDownload} 
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download PDF Certificate
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/30 p-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                      <Eye className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="mb-2 text-base font-bold text-slate-700">
                      No Preview Yet
                    </p>
                    <p className="text-sm text-slate-500">
                      Complete the form and click "Generate Preview" to see your certificate
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
