import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useCreateAssignment } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SUBJECTS = ["Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"];
const GRADES = ["8", "9", "10", "11", "12"];

export function CreateAssignmentForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  
  const { user } = useAuth();
  const createMutation = useCreateAssignment();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !grade || !dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        title,
        description,
        subject,
        grade,
        dueDate: new Date(dueDate),
        totalMarks: parseInt(totalMarks),
        createdBy: user!.id,
      });
      
      toast({
        title: "Success!",
        description: "Assignment created successfully",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSubject("");
      setGrade("");
      setDueDate("");
      setTotalMarks("100");
    } catch (error: any) {
      toast({
        title: "Failed to create assignment",
        description: error.message || "Could not create assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card data-testid="create-assignment-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Create New Assignment
        </CardTitle>
        <CardDescription>
          Create an assignment for students to submit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Algebra Practice Problems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="assignment-title-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Assignment instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="assignment-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger data-testid="assignment-subject-select">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Select value={grade} onValueChange={setGrade} required>
                <SelectTrigger data-testid="assignment-grade-select">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g} value={g}>
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                data-testid="assignment-due-date-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                type="number"
                min="1"
                max="1000"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                required
                data-testid="assignment-total-marks-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createMutation.isPending}
            data-testid="create-assignment-submit-button"
          >
            {createMutation.isPending ? "Creating..." : "Create Assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
