"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Target,
  Clock,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BootcampPhasesPage() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [phaseForm, setPhaseForm] = useState({
    title: "",
    description: "",
    duration_weeks: 1,
    learning_objectives: [],
    projects: [],
  });
  const [newObjective, setNewObjective] = useState("");
  const [newProject, setNewProject] = useState({ title: "", description: "", due_date: "" });

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

  const fetchPhases = async (bootcampId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bootcamp/phases?bootcampId=${bootcampId}`);
      const data = await res.json();
      
      if (data.status === 200) {
        setPhases(data.data.phases || []);
        setSelectedBootcamp({
          bootcampId: data.data.bootcampId,
          title: data.data.title
        });
      } else {
        toast.error("Failed to fetch phases");
      }
    } catch (error) {
      console.error("Error fetching phases:", error);
      toast.error("Failed to fetch phases");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhase = async () => {
    if (!phaseForm.title || !selectedBootcamp) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("bootcampId", selectedBootcamp.bootcampId);
      formData.set("title", phaseForm.title);
      formData.set("description", phaseForm.description);
      formData.set("duration_weeks", phaseForm.duration_weeks.toString());
      formData.set("learning_objectives", JSON.stringify(phaseForm.learning_objectives));
      formData.set("projects", JSON.stringify(phaseForm.projects));

      const res = await fetch("/api/bootcamp/phases", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Phase added successfully");
        setPhases([...phases, data.data]);
        setShowAddPhase(false);
        resetPhaseForm();
      } else {
        toast.error(data.message || "Failed to add phase");
      }
    } catch (error) {
      console.error("Error adding phase:", error);
      toast.error("Failed to add phase");
    }
  };

  const handleUpdatePhases = async () => {
    if (!selectedBootcamp) {
      toast.error("Please select a bootcamp");
      return;
    }

    try {
      const formData = new FormData();
      formData.set("bootcampId", selectedBootcamp.bootcampId);
      formData.set("phases", JSON.stringify(phases));

      const res = await fetch("/api/bootcamp/phases", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Phases updated successfully");
        setPhases(data.data);
      } else {
        toast.error(data.message || "Failed to update phases");
      }
    } catch (error) {
      console.error("Error updating phases:", error);
      toast.error("Failed to update phases");
    }
  };

  const handleDeletePhase = async (phaseNumber) => {
    if (!selectedBootcamp) {
      toast.error("Please select a bootcamp");
      return;
    }

    try {
      const res = await fetch(
        `/api/bootcamp/phases?bootcampId=${selectedBootcamp.bootcampId}&phaseNumber=${phaseNumber}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Phase deleted successfully");
        setPhases(data.data);
      } else {
        toast.error(data.message || "Failed to delete phase");
      }
    } catch (error) {
      console.error("Error deleting phase:", error);
      toast.error("Failed to delete phase");
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setPhaseForm(prev => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, newObjective.trim()]
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index) => {
    setPhaseForm(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    if (newProject.title.trim()) {
      setPhaseForm(prev => ({
        ...prev,
        projects: [...prev.projects, { ...newProject, due_date: newProject.due_date || null }]
      }));
      setNewProject({ title: "", description: "", due_date: "" });
    }
  };

  const removeProject = (index) => {
    setPhaseForm(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const resetPhaseForm = () => {
    setPhaseForm({
      title: "",
      description: "",
      duration_weeks: 1,
      learning_objectives: [],
      projects: [],
    });
    setNewObjective("");
    setNewProject({ title: "", description: "", due_date: "" });
  };

  const startEditingPhase = (phase) => {
    setEditingPhase(phase);
    setPhaseForm({
      title: phase.title,
      description: phase.description,
      duration_weeks: phase.duration_weeks,
      learning_objectives: phase.learning_objectives || [],
      projects: phase.projects || [],
    });
  };

  const updatePhase = async () => {
    if (!editingPhase || !selectedBootcamp) return;

    try {
      const updatedPhases = phases.map(phase => 
        phase.phase_number === editingPhase.phase_number 
          ? { ...phase, ...phaseForm }
          : phase
      );

      const formData = new FormData();
      formData.set("bootcampId", selectedBootcamp.bootcampId);
      formData.set("phases", JSON.stringify(updatedPhases));

      const res = await fetch("/api/bootcamp/phases", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === 200) {
        toast.success("Phase updated successfully");
        setPhases(data.data);
        setEditingPhase(null);
        resetPhaseForm();
      } else {
        toast.error(data.message || "Failed to update phase");
      }
    } catch (error) {
      console.error("Error updating phase:", error);
      toast.error("Failed to update phase");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Phases & Curriculum</h1>
            <p className="text-gray-600 mt-1">Manage bootcamp phases and learning objectives</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bootcamp Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
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
                      fetchPhases(bootcamp._id);
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
                      {phases.length} phases configured
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phases Management */}
        <div className="lg:col-span-2">
          {selectedBootcamp ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Bootcamp Phases
                  </CardTitle>
                  <div className="flex gap-2">
                    <Dialog open={showAddPhase} onOpenChange={setShowAddPhase}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Phase
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Phase</DialogTitle>
                          <DialogDescription>
                            Create a new phase for the bootcamp curriculum
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Phase Title *</Label>
                            <Input
                              id="title"
                              value={phaseForm.title}
                              onChange={(e) => setPhaseForm(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Foundation Phase"
                            />
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={phaseForm.description}
                              onChange={(e) => setPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Describe what students will learn in this phase"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="duration">Duration (weeks)</Label>
                            <Input
                              id="duration"
                              type="number"
                              min="1"
                              value={phaseForm.duration_weeks}
                              onChange={(e) => setPhaseForm(prev => ({ ...prev, duration_weeks: parseInt(e.target.value) || 1 }))}
                            />
                          </div>

                          <div>
                            <Label>Learning Objectives</Label>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={newObjective}
                                  onChange={(e) => setNewObjective(e.target.value)}
                                  placeholder="Add learning objective"
                                  onKeyPress={(e) => e.key === "Enter" && addObjective()}
                                />
                                <Button onClick={addObjective} size="sm">
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-1">
                                {phaseForm.learning_objectives.map((objective, index) => (
                                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm flex-1">{objective}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeObjective(index)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Projects</Label>
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                  value={newProject.title}
                                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Project title"
                                />
                                <Input
                                  value={newProject.description}
                                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Description"
                                />
                                <Input
                                  type="date"
                                  value={newProject.due_date}
                                  onChange={(e) => setNewProject(prev => ({ ...prev, due_date: e.target.value }))}
                                />
                              </div>
                              <Button onClick={addProject} size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Project
                              </Button>
                              <div className="space-y-1">
                                {phaseForm.projects.map((project, index) => (
                                  <div key={index} className="p-2 bg-gray-50 rounded">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-sm">{project.title}</p>
                                        <p className="text-xs text-gray-600">{project.description}</p>
                                        {project.due_date && (
                                          <p className="text-xs text-gray-500">
                                            Due: {new Date(project.due_date).toLocaleDateString()}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeProject(index)}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAddPhase(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddPhase}>
                            <Save className="w-4 h-4 mr-2" />
                            Add Phase
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={handleUpdatePhases} variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {phases.length > 0 ? (
                  <div className="space-y-4">
                    {phases.map((phase) => (
                      <div key={phase.phase_number} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Phase {phase.phase_number}: {phase.title}
                            </h3>
                            <p className="text-gray-600">{phase.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {phase.duration_weeks} weeks
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingPhase(phase)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletePhase(phase.phase_number)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {phase.learning_objectives && phase.learning_objectives.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-medium mb-2">Learning Objectives:</h4>
                            <ul className="space-y-1">
                              {phase.learning_objectives.map((objective, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {phase.projects && phase.projects.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Projects:</h4>
                            <div className="space-y-2">
                              {phase.projects.map((project, index) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                  <p className="font-medium">{project.title}</p>
                                  <p className="text-gray-600">{project.description}</p>
                                  {project.due_date && (
                                    <p className="text-gray-500">
                                      Due: {new Date(project.due_date).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Phases Configured
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add phases to structure your bootcamp curriculum
                    </p>
                    <Button onClick={() => setShowAddPhase(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Phase
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select a Bootcamp
                </h3>
                <p className="text-gray-600">
                  Choose a bootcamp from the list to manage its phases and curriculum
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Phase Dialog */}
      {editingPhase && (
        <Dialog open={!!editingPhase} onOpenChange={() => setEditingPhase(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Phase</DialogTitle>
              <DialogDescription>
                Update the phase details and learning objectives
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Phase Title *</Label>
                <Input
                  id="edit-title"
                  value={phaseForm.title}
                  onChange={(e) => setPhaseForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={phaseForm.description}
                  onChange={(e) => setPhaseForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-duration">Duration (weeks)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="1"
                  value={phaseForm.duration_weeks}
                  onChange={(e) => setPhaseForm(prev => ({ ...prev, duration_weeks: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPhase(null)}>
                Cancel
              </Button>
              <Button onClick={updatePhase}>
                <Save className="w-4 h-4 mr-2" />
                Update Phase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
