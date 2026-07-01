"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Switch,
} from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Briefcase,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Monitor,
  Video,
  BookOpen,
  Target,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampSchedulePage() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    days_per_week: 5,
    hours_per_day: 8,
    class_times: [],
    break_times: [],
    timezone: "UTC",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [careerSupport, setCareerSupport] = useState({
    job_placement: false,
    resume_review: false,
    interview_prep: false,
    portfolio_review: false,
    networking_events: false,
    mentorship_program: false,
    career_counseling: false,
    industry_connections: false,
  });
  const [loading, setLoading] = useState(false);
  const [newClassTime, setNewClassTime] = useState({ start: "", end: "", day: "" });
  const [newBreakTime, setNewBreakTime] = useState({ start: "", end: "", description: "" });

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const fetchBootcamps = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.set("pagination", "100");
      
      const res = await fetch("/api/bootcamp", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.status === 200) {
        setBootcamps(data.data);
      } else {
        toast.error("Failed to fetch bootcamps");
      }
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      toast.error("Failed to fetch bootcamps");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async (bootcampId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bootcamp/schedule?bootcampId=${bootcampId}`);
      const data = await res.json();
      
      if (data.status === 200) {
        setSelectedBootcamp({
          bootcampId: data.data.bootcampId,
          title: data.data.title
        });
        // Transform schedule data from model to frontend format
        const scheduleData = data.data.schedule || {};
        setScheduleData({
          days_per_week: scheduleData.days_per_week || 5,
          hours_per_day: scheduleData.hours_per_day || 8,
          class_times: (scheduleData.class_times || []).map(classTime => ({
            day: classTime.day ? classTime.day.charAt(0).toUpperCase() + classTime.day.slice(1) : "",
            start: classTime.start_time || "",
            end: classTime.end_time || "",
          })),
          break_times: (scheduleData.break_times || []).map(breakTime => ({
            start: breakTime.start_time || "",
            end: breakTime.end_time || "",
            description: breakTime.description || "",
          })),
          timezone: scheduleData.timezone || "UTC",
        });
        setDeliveryMethod(data.data.deliveryMethod || "");
        // Transform career support data from model to frontend format
        const careerSupportData = data.data.careerSupport || {};
        setCareerSupport({
          job_placement: careerSupportData.job_placement_assistance || false,
          resume_review: careerSupportData.resume_review || false,
          interview_prep: careerSupportData.interview_preparation || false,
          portfolio_review: careerSupportData.portfolio_building || false,
          networking_events: careerSupportData.networking_events || false,
          mentorship_program: careerSupportData.mentorship_program || false,
          career_counseling: careerSupportData.career_counseling || false,
          industry_connections: careerSupportData.industry_connections || false,
        });
      } else {
        toast.error("Failed to fetch schedule data");
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      toast.error("Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedBootcamp) {
      toast.error("Please select a bootcamp");
      return;
    }

    // Validate required fields
    if (!scheduleData.days_per_week || !scheduleData.hours_per_day) {
      toast.error("Please fill in all required schedule fields");
      return;
    }

    if (!deliveryMethod) {
      toast.error("Please select a delivery method");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("bootcampId", selectedBootcamp.bootcampId);
      formData.set("schedule", JSON.stringify(scheduleData));
      formData.set("deliveryMethod", deliveryMethod);
      formData.set("careerSupport", JSON.stringify(careerSupport));

      const res = await fetch("/api/bootcamp/schedule", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Schedule and support settings saved successfully");
        // Refresh the data to show updated values
        fetchScheduleData(selectedBootcamp.bootcampId);
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const addClassTime = () => {
    if (newClassTime.start && newClassTime.end && newClassTime.day) {
      setScheduleData(prev => ({
        ...prev,
        class_times: [...(prev.class_times || []), { ...newClassTime }]
      }));
      setNewClassTime({ start: "", end: "", day: "" });
    }
  };

  const removeClassTime = (index) => {
    setScheduleData(prev => ({
      ...prev,
      class_times: (prev.class_times || []).filter((_, i) => i !== index)
    }));
  };

  const addBreakTime = () => {
    if (newBreakTime.start && newBreakTime.end) {
      setScheduleData(prev => ({
        ...prev,
        break_times: [...(prev.break_times || []), { ...newBreakTime }]
      }));
      setNewBreakTime({ start: "", end: "", description: "" });
    }
  };

  const removeBreakTime = (index) => {
    setScheduleData(prev => ({
      ...prev,
      break_times: (prev.break_times || []).filter((_, i) => i !== index)
    }));
  };

  const toggleCareerSupport = (key) => {
    setCareerSupport(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
         
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Support</h1>
            <p className="text-gray-600 mt-1">Configure bootcamp schedules and career support services</p>
          </div>
        </div>
        <Button className="text-white" onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bootcamp Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Select Bootcamp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  value={selectedBootcamp?.bootcampId || ""}
                  onValueChange={(value) => {
                    const bootcamp = bootcamps.find(b => b._id === value);
                    if (bootcamp) {
                      fetchScheduleData(bootcamp._id);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bootcamp" />
                  </SelectTrigger>
                  <SelectContent>
                    {bootcamps.map((bootcamp) => (
                      <SelectItem key={bootcamp._id} value={bootcamp._id}>
                        {bootcamp.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedBootcamp && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold">{selectedBootcamp.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Delivery: {deliveryMethod || "Not set"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule & Support Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBootcamp ? (
            <>
              {/* Schedule Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="days-per-week">Days per Week</Label>
                      <Input
                        id="days-per-week"
                        type="number"
                        min="1"
                        max="7"
                        value={scheduleData.days_per_week}
                        onChange={(e) => setScheduleData(prev => ({ 
                          ...prev, 
                          days_per_week: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hours-per-day">Hours per Day</Label>
                      <Input
                        id="hours-per-day"
                        type="number"
                        min="1"
                        max="12"
                        value={scheduleData.hours_per_day}
                        onChange={(e) => setScheduleData(prev => ({ 
                          ...prev, 
                          hours_per_day: parseInt(e.target.value) || 1 
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={scheduleData.timezone}
                        onValueChange={(value) => setScheduleData(prev => ({ 
                          ...prev, 
                          timezone: value 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                          <SelectItem value="CET">Central European Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Class Times */}
                  <div>
                    <Label>Class Times</Label>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <Select
                          value={newClassTime.day}
                          onValueChange={(value) => setNewClassTime(prev => ({ ...prev, day: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="time"
                          value={newClassTime.start}
                          onChange={(e) => setNewClassTime(prev => ({ ...prev, start: e.target.value }))}
                          placeholder="Start time"
                        />
                        <Input
                          type="time"
                          value={newClassTime.end}
                          onChange={(e) => setNewClassTime(prev => ({ ...prev, end: e.target.value }))}
                          placeholder="End time"
                        />
                        <Button onClick={addClassTime} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {scheduleData.class_times && scheduleData.class_times.length > 0 && (
                        <div className="space-y-2">
                          {scheduleData.class_times.map((classTime, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Badge variant="outline">{classTime.day}</Badge>
                              <span className="text-sm">
                                {classTime.start} - {classTime.end}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeClassTime(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Break Times */}
                  <div>
                    <Label>Break Times</Label>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <Input
                          type="time"
                          value={newBreakTime.start}
                          onChange={(e) => setNewBreakTime(prev => ({ ...prev, start: e.target.value }))}
                          placeholder="Start time"
                        />
                        <Input
                          type="time"
                          value={newBreakTime.end}
                          onChange={(e) => setNewBreakTime(prev => ({ ...prev, end: e.target.value }))}
                          placeholder="End time"
                        />
                        <Input
                          value={newBreakTime.description}
                          onChange={(e) => setNewBreakTime(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description"
                        />
                        <Button onClick={addBreakTime} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {scheduleData.break_times && scheduleData.break_times.length > 0 && (
                        <div className="space-y-2">
                          {scheduleData.break_times.map((breakTime, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">
                                {breakTime.start} - {breakTime.end}
                              </span>
                              <span className="text-sm text-gray-600">
                                {breakTime.description}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeBreakTime(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select
                      value={deliveryMethod}
                      onValueChange={setDeliveryMethod}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="self-paced">Self-Paced</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {deliveryMethod && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {deliveryMethod === "online" && <Video className="w-5 h-5 text-blue-500" />}
                          {deliveryMethod === "in-person" && <Users className="w-5 h-5 text-green-500" />}
                          {deliveryMethod === "hybrid" && <Monitor className="w-5 h-5 text-purple-500" />}
                          {deliveryMethod === "self-paced" && <BookOpen className="w-5 h-5 text-orange-500" />}
                          <span className="font-medium capitalize">{deliveryMethod}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Career Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Career Support Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(careerSupport).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {key === "job_placement" && <Briefcase className="w-4 h-4 text-blue-600" />}
                            {key === "resume_review" && <User className="w-4 h-4 text-blue-600" />}
                            {key === "interview_prep" && <Target className="w-4 h-4 text-blue-600" />}
                            {key === "portfolio_review" && <BookOpen className="w-4 h-4 text-blue-600" />}
                            {key === "networking_events" && <Users className="w-4 h-4 text-blue-600" />}
                            {key === "mentorship_program" && <User className="w-4 h-4 text-blue-600" />}
                            {key === "career_counseling" && <Mail className="w-4 h-4 text-blue-600" />}
                            {key === "industry_connections" && <Phone className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                              {key === "job_placement" && "Help students find job opportunities"}
                              {key === "resume_review" && "Professional resume feedback and optimization"}
                              {key === "interview_prep" && "Mock interviews and preparation tips"}
                              {key === "portfolio_review" && "Portfolio review and improvement suggestions"}
                              {key === "networking_events" && "Organize networking events and meetups"}
                              {key === "mentorship_program" && "Connect students with industry mentors"}
                              {key === "career_counseling" && "One-on-one career guidance sessions"}
                              {key === "industry_connections" && "Access to industry professionals and companies"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={() => toggleCareerSupport(key)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a Bootcamp
                </h3>
                <p className="text-gray-600">
                  Choose a bootcamp from the list to configure its schedule and support services
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
