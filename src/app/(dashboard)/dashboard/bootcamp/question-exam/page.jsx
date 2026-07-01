"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  X,
  CheckCircle,
  FileText,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";

export default function BootcampQuestionExamPage() {
  const [bootcamps, setBootcamps] = useState([]);
  const [selectedBootcamp, setSelectedBootcamp] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBootcamps, setLoadingBootcamps] = useState(true);
  const [showMCQDialog, setShowMCQDialog] = useState(false);
  const [editingMCQ, setEditingMCQ] = useState(null);
  const [activeTab, setActiveTab] = useState("questions");

  // MCQ Form State
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [points, setPoints] = useState(1);
  const [level, setLevel] = useState("medium");
  const [explanation, setExplanation] = useState("");

  // Fetch bootcamps
  useEffect(() => {
    fetchBootcamps();
  }, []);

  // Fetch MCQs when bootcamp is selected
  useEffect(() => {
    if (selectedBootcamp) {
      fetchMCQs();
      fetchExamResults();
    }
  }, [selectedBootcamp]);

  const fetchBootcamps = async () => {
    setLoadingBootcamps(true);
    try {
      // Use POST method to get all bootcamps (like the manage page)
      const formdata = new FormData();
      formdata.set("page", "1");
      formdata.set("pagination", "100"); // Get a large number to fetch all
      
      const response = await fetch("/api/bootcamp", {
        method: "POST",
        body: formdata,
      });
      
      const data = await response.json();
      if (data.status === 200) {
        setBootcamps(data.data || []);
        if (data.data && data.data.length === 0) {
          toast.error("No bootcamps found");
        }
      } else {
        console.error("Failed to fetch bootcamps:", data.message);
        toast.error(data.message || "Failed to fetch bootcamps");
      }
    } catch (error) {
      console.error("Error fetching bootcamps:", error);
      toast.error("Failed to fetch bootcamps");
    } finally {
      setLoadingBootcamps(false);
    }
  };

  const fetchMCQs = async () => {
    if (!selectedBootcamp) return;
    setLoading(true);
    try {
      // Include inactive MCQs so admin can see and manage all questions
      const response = await fetch(
        `/api/bootcamp/mcq?bootcampId=${selectedBootcamp}&includeInactive=true`
      );
      const data = await response.json();
      if (data.status === 200) {
        setMcqs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
      toast.error("Failed to fetch MCQ questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchExamResults = async () => {
    if (!selectedBootcamp) return;
    try {
      const response = await fetch(
        `/api/bootcamp/exam/results?bootcampId=${selectedBootcamp}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setExamResults(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
      toast.error("Failed to fetch exam results");
    }
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "", isCorrect: false }]);
    } else {
      toast.error("Maximum 5 options allowed");
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      toast.error("Minimum 2 options required");
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    if (field === "isCorrect") {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setPoints(1);
    setLevel("medium");
    setExplanation("");
    setEditingMCQ(null);
  };

  const handleOpenDialog = (mcq = null) => {
    if (mcq) {
      setEditingMCQ(mcq);
      setQuestion(mcq.question);
      setOptions(mcq.options);
      setPoints(mcq.points);
      setLevel(mcq.level || "medium");
      setExplanation(mcq.explanation || "");
    } else {
      resetForm();
    }
    setShowMCQDialog(true);
  };

  const handleSaveMCQ = async () => {
    // Validation
    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (options.some((opt) => !opt.text.trim())) {
      toast.error("All options must have text");
      return;
    }
    if (!options.some((opt) => opt.isCorrect)) {
      toast.error("Please mark one option as correct");
      return;
    }
    if (!selectedBootcamp) {
      toast.error("Please select a bootcamp");
      return;
    }

    try {
      const url = editingMCQ
        ? `/api/bootcamp/mcq/${editingMCQ._id}`
        : "/api/bootcamp/mcq";
      const method = editingMCQ ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bootcamp: selectedBootcamp,
          question,
          options,
          points,
          level,
          explanation,
        }),
      });

      const data = await response.json();
      if (data.status === 200 || data.status === 201) {
        toast.success(
          editingMCQ
            ? "MCQ question updated successfully"
            : "MCQ question created successfully"
        );
        setShowMCQDialog(false);
        resetForm();
        fetchMCQs();
      } else {
        toast.error(data.message || "Failed to save MCQ question");
      }
    } catch (error) {
      console.error("Error saving MCQ:", error);
      toast.error("Failed to save MCQ question");
    }
  };

  const handleDeleteMCQ = async (mcqId) => {
    if (!confirm("Are you sure you want to delete this MCQ question?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bootcamp/mcq/${mcqId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success("MCQ question deleted successfully");
        fetchMCQs();
      } else {
        toast.error(data.message || "Failed to delete MCQ question");
      }
    } catch (error) {
      console.error("Error deleting MCQ:", error);
      toast.error("Failed to delete MCQ question");
    }
  };

  const handleToggleActive = async (mcq) => {
    try {
      const response = await fetch(`/api/bootcamp/mcq/${mcq._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !mcq.isActive,
        }),
      });

      const data = await response.json();
      if (data.status === 200) {
        toast.success(
          mcq.isActive
            ? "MCQ question deactivated"
            : "MCQ question activated"
        );
        fetchMCQs();
      } else {
        toast.error(data.message || "Failed to update MCQ question");
      }
    } catch (error) {
      console.error("Error updating MCQ:", error);
      toast.error("Failed to update MCQ question");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bootcamp Question & Exam
          </h1>
          <p className="text-gray-600 mt-1">
            Manage MCQ questions and view exam results
          </p>
        </div>
      </div>

      {/* Bootcamp Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Bootcamp</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBootcamps ? (
            <div className="text-center py-4">Loading bootcamps...</div>
          ) : (
            <Select value={selectedBootcamp} onValueChange={setSelectedBootcamp}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a bootcamp" />
              </SelectTrigger>
              <SelectContent>
                {bootcamps.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No bootcamps available
                  </div>
                ) : (
                  bootcamps.map((bootcamp) => (
                    <SelectItem key={bootcamp._id} value={bootcamp._id}>
                      {bootcamp.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedBootcamp && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="questions">
              <FileText className="w-4 h-4 mr-2" />
              MCQ Questions
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="w-4 h-4 mr-2" />
              Exam Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">MCQ Questions</h2>
                <p className="text-sm text-gray-600">
                  Total: {mcqs.length} questions
                </p>
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add MCQ Question
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : mcqs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No MCQ questions found. Add your first question!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mcqs.map((mcq) => (
                  <Card key={mcq._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{mcq.question}</CardTitle>
                        <div className="flex gap-2">
                          <Badge
                            variant={mcq.isActive ? "default" : "secondary"}
                          >
                            {mcq.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          <Badge
                            variant={
                              mcq.level === "easy"
                                ? "default"
                                : mcq.level === "medium"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              mcq.level === "easy"
                                ? "bg-green-500"
                                : mcq.level === "medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }
                          >
                            {mcq.level ? mcq.level.charAt(0).toUpperCase() + mcq.level.slice(1) : "Medium"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(mcq)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(mcq)}
                          >
                            {mcq.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMCQ(mcq._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mcq.options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded ${
                              option.isCorrect
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <span className="font-medium w-8">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="flex-1">{option.text}</span>
                            {option.isCorrect && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        ))}
                        <div className="mt-2 text-sm text-gray-600">
                          Points: {mcq.points} | Level: {mcq.level ? mcq.level.charAt(0).toUpperCase() + mcq.level.slice(1) : "Medium"} | Explanation:{" "}
                          {mcq.explanation || "Aucun"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Exam Results</h2>
              <p className="text-sm text-gray-600">
                Total: {examResults.length} submissions
              </p>
            </div>

            {examResults.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No exam results found yet.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Correct/Total</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Time Spent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {examResults.map((result) => (
                        <TableRow key={result._id}>
                          <TableCell>
                            {result.student?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {result.obtainedPoints}/{result.totalPoints}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                result.percentage >= 70
                                  ? "default"
                                  : result.percentage >= 50
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {result.percentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {result.correctAnswers}/{result.totalQuestions}
                          </TableCell>
                          <TableCell>
                            {new Date(result.submittedAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* MCQ Dialog */}
      <Dialog open={showMCQDialog} onOpenChange={setShowMCQDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMCQ ? "Edit MCQ Question" : "Add MCQ Question"}
            </DialogTitle>
            <DialogDescription>
              Create a multiple choice question with 2-5 options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Options * (Select one as correct)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={options.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="font-medium w-8">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={option.isCorrect ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handleOptionChange(index, "isCorrect", true)
                      }
                    >
                      {option.isCorrect ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "Mark Correct"
                      )}
                    </Button>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="level">Difficulty Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this answer is correct..."
                rows={2}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMCQDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMCQ}>
              {editingMCQ ? "Mettre à jour" : "Create"} Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

