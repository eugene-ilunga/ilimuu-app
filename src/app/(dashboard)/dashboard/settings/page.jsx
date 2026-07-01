"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Settings, DollarSign, Bell, Wrench, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"



export default function SettingsPage() {
  const [settings, setSettings] = useState(

    {
      platformName: "ELIMUU",
      platformCurrency: "USD",
      platformServiceFee: 5,
      taxRate: 0,
      minimumWithdrawalAmount: 0,
      payoutProcessingTime: 0,
      referralBonus: 0,
      courseCommissionRate: 10,
      mentorshipCommissionRate: 10,
      minCoursePrice: 0,
      maxCoursePrice: 0,
      maxMentorshipPrice: 0,
      courseApprovalRequired: false,
      enableMentorshipPlans: false,
      enableReferralProgram: false,
      enableTaxDeduction: false,
      enableEmailNotifications: false,
      enableSMSNotifications: false,
      enableChatbot: true,
      maintenanceMode: false,
      maintenanceMessage: "",
      supportEmail: "",
      supportPhone: "",
      supportAddress: "",
      facebookLink: "",
      instagramLink: "",
      linkedinLink: "",
      youtubeLink: "",
      twitterLink: "",
    }
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/setttings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast({
          title: "Erreur",
          description: "Échec du chargement des paramètres",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec du chargement des paramètres",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (field, value) => {
    if (!settings) return;

    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch("/api/setttings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setHasChanges(false)
        toast({
          title: "Succès",
          description: "Settings saved successfully",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Failed to save settings",
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

  if (!settings) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Failed to load settings. Please try refreshing the page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="m-6">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Platform Settings
            </h1>
            <p className="text-muted-foreground mt-2">Configure your platform settings and preferences</p>
          </div>
          {/* <Button className="w-full sm:w-auto text-white">
            Add Payout Account
          </Button> */}
          <Button className="min-w-[120px] text-white disabled:opacity-100" onClick={handleSave} disabled={!hasChanges || saving}  >
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
            <AlertDescription>You have unsaved changes. Don&apos;t forget to save your settings.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Platform Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Information
              </CardTitle>
              <CardDescription>Basic platform configuration and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleInputChange("platformName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformCurrency">Platform Currency</Label>
                  <Input
                    id="platformCurrency"
                    value={settings.platformCurrency}
                    onChange={(e) => handleInputChange("platformCurrency", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Settings
              </CardTitle>
              <CardDescription>Configure pricing, fees, and financial parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformServiceFee">Platform Service Fee (%)</Label>
                  <Input
                    id="platformServiceFee"
                    type="number"
                    value={settings.platformServiceFee}
                    onChange={(e) => handleInputChange("platformServiceFee", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleInputChange("taxRate", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumWithdrawalAmount">Minimum Withdrawal Amount</Label>
                  <Input
                    id="minimumWithdrawalAmount"
                    type="number"
                    value={settings.minimumWithdrawalAmount}
                    onChange={(e) => handleInputChange("minimumWithdrawalAmount", Number(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payoutProcessingTime">Payout Processing Time (days)</Label>
                  <Input
                    id="payoutProcessingTime"
                    type="number"
                    value={settings.payoutProcessingTime}
                    onChange={(e) => handleInputChange("payoutProcessingTime", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralBonus">Referral Bonus</Label>
                  <Input
                    id="referralBonus"
                    type="number"
                    value={settings.referralBonus}
                    onChange={(e) => handleInputChange("referralBonus", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commission & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Commission & Pricing</CardTitle>
              <CardDescription>Set commission rates and price limits for courses and mentorship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Course Settings</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="courseCommissionRate">Commission Rate (%)</Label>
                      <Input
                        id="courseCommissionRate"
                        type="number"
                        value={settings.courseCommissionRate}
                        onChange={(e) => handleInputChange("courseCommissionRate", Number(e.target.value))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="minCoursePrice">Min Price</Label>
                        <Input
                          id="minCoursePrice"
                          type="number"
                          value={settings.minCoursePrice}
                          onChange={(e) => handleInputChange("minCoursePrice", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxCoursePrice">Max Price</Label>
                        <Input
                          id="maxCoursePrice"
                          type="number"
                          value={settings.maxCoursePrice}
                          onChange={(e) => handleInputChange("maxCoursePrice", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Mentorship Settings</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="mentorshipCommissionRate">Commission Rate (%)</Label>
                      <Input
                        id="mentorshipCommissionRate"
                        type="number"
                        value={settings.mentorshipCommissionRate}
                        onChange={(e) => handleInputChange("mentorshipCommissionRate", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxMentorshipPrice">Max Price</Label>
                      <Input
                        id="maxMentorshipPrice"
                        type="number"
                        value={settings.maxMentorshipPrice}
                        onChange={(e) => handleInputChange("maxMentorshipPrice", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Toggles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Feature Settings
              </CardTitle>
              <CardDescription>Enable or disable platform features and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Platform Features</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Course Approval Required</Label>
                        <p className="text-sm text-muted-foreground">Require admin approval for new courses</p>
                      </div>
                      <Switch
                        checked={settings.courseApprovalRequired}
                        onCheckedChange={(checked) => handleInputChange("courseApprovalRequired", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mentorship Plans</Label>
                        <p className="text-sm text-muted-foreground">Enable mentorship functionality</p>
                      </div>
                      <Switch
                        checked={settings.enableMentorshipPlans}
                        onCheckedChange={(checked) => handleInputChange("enableMentorshipPlans", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Referral Program</Label>
                        <p className="text-sm text-muted-foreground">Enable user referral system</p>
                      </div>
                      <Switch
                        checked={settings.enableReferralProgram}
                        onCheckedChange={(checked) => handleInputChange("enableReferralProgram", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tax Deduction</Label>
                        <p className="text-sm text-muted-foreground">Enable tax deduction features</p>
                      </div>
                      <Switch
                        checked={settings.enableTaxDeduction}
                        onCheckedChange={(checked) => handleInputChange("enableTaxDeduction", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Chatbot</Label>
                        <p className="text-sm text-muted-foreground">Enable chatbot assistant on home page</p>
                      </div>
                      <Switch
                        checked={settings.enableChatbot ?? true}
                        onCheckedChange={(checked) => handleInputChange("enableChatbot", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                      </div>
                      <Switch
                        checked={settings.enableEmailNotifications}
                        onCheckedChange={(checked) => handleInputChange("enableEmailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send SMS notifications to users</p>
                      </div>
                      <Switch
                        checked={settings.enableSMSNotifications}
                        onCheckedChange={(checked) => handleInputChange("enableSMSNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Settings
              </CardTitle>
              <CardDescription>Configure maintenance mode and messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable maintenance mode for the platform</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                  {settings.maintenanceMode && <Badge variant="destructive">Active</Badge>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                  placeholder="Enter the message to display during maintenance"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Support Information
              </CardTitle>
              <CardDescription>Configure support contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Support Email
                  </Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Support Phone
                  </Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => handleInputChange("supportPhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Support Address
                </Label>
                <Input
                  id="supportAddress"
                  value={settings.supportAddress}
                  onChange={(e) => handleInputChange("supportAddress", e.target.value)}
                  placeholder="Enter your business address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>Configure your social media profile links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookLink" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook Link
                  </Label>
                  <Input
                    id="facebookLink"
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    value={settings.facebookLink}
                    onChange={(e) => handleInputChange("facebookLink", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramLink" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram Link
                  </Label>
                  <Input
                    id="instagramLink"
                    type="url"
                    placeholder="https://instagram.com/yourpage"
                    value={settings.instagramLink}
                    onChange={(e) => handleInputChange("instagramLink", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinLink" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Link
                  </Label>
                  <Input
                    id="linkedinLink"
                    type="url"
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={settings.linkedinLink}
                    onChange={(e) => handleInputChange("linkedinLink", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeLink" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4" />
                    YouTube Link
                  </Label>
                  <Input
                    id="youtubeLink"
                    type="url"
                    placeholder="https://youtube.com/@yourchannel"
                    value={settings.youtubeLink}
                    onChange={(e) => handleInputChange("youtubeLink", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitterLink" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter/X Link
                  </Label>
                  <Input
                    id="twitterLink"
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    value={settings.twitterLink}
                    onChange={(e) => handleInputChange("twitterLink", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button at Bottom */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={!hasChanges || saving} size="lg" className="min-w-[150px] disabled:opacity-100 text-white">
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
