import { useState } from "react";
import { format } from "date-fns";
import { Download, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { downloadSubmission, useGradeSubmission } from "@/hooks/use-submissions";
import { useToast } from "@/hooks/use-toast";
import { type Assignment } from "@shared/schema";

interface SubmissionsViewProps {
  assignment: Assignment;
  submissions: any[];
}

export function SubmissionsView({ assignment, submissions }: SubmissionsViewProps) {
  const [gradingSubmission, setGradingSubmission] = useState<any>(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const gradeMutation = useGradeSubmission();
  const { toast } = useToast();

  const handleDownload = (id: number, fileName: string) => {
    downloadSubmission(id, fileName);
  };

  const openGrading = (submission: any) => {
    setGradingSubmission(submission);
    setMarks(submission.marks?.toString() || "");
    setFeedback(submission.feedback || "");
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const marksValue = parseInt(marks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > assignment.totalMarks) {
      toast({
        title: "Invalid marks",
        description: `Marks must be between 0 and ${assignment.totalMarks}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await gradeMutation.mutateAsync({
        id: gradingSubmission.id,
        marks: marksValue,
        feedback: feedback || undefined,
      });
      toast({
        title: "Success!",
        description: "Submission graded successfully",
      });
      setGradingSubmission(null);
      setMarks("");
      setFeedback("");
    } catch (error: any) {
      toast({
        title: "Grading failed",
        description: error.message || "Could not grade submission",
        variant: "destructive",
      });
    }
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4" data-testid="submissions-view">
        {submissions.map((submission: any) => (
          <Card key={submission.id} data-testid="teacher-submission-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {submission.studentName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {submission.studentEmail}
                  </p>
                </div>
                <Badge 
                  variant={submission.status === "graded" ? "default" : "secondary"}
                  data-testid="teacher-submission-status"
                >
                  {submission.status === "graded" ? "Graded" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{format(new Date(submission.submittedAt), "MMM dd, yyyy h:mm a")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">File</p>
                    <p className="font-medium text-xs">{submission.fileName}</p>
                  </div>
                </div>
                
                {submission.status === "graded" && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Marks</p>
                        <p className="text-xl font-bold text-primary" data-testid="teacher-submission-marks">
                          {submission.marks}/{assignment.totalMarks}
                        </p>
                      </div>
                      {submission.feedback && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                          <p className="text-sm" data-testid="teacher-submission-feedback">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(submission.id, submission.fileName)}
                    variant="outline"
                    className="flex-1"
                    data-testid="teacher-download-submission-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => openGrading(submission)}
                        className="flex-1"
                        data-testid="grade-submission-button"
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {submission.status === "graded" ? "Edit Grade" : "Grade"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent data-testid="grade-submission-dialog">
                      <DialogHeader>
                        <DialogTitle>Grade Submission</DialogTitle>
                        <DialogDescription>
                          {submission.studentName} - {assignment.title}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGrade} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="marks">Marks (out of {assignment.totalMarks}) *</Label>
                          <Input
                            id="marks"
                            type="number"
                            min="0"
                            max={assignment.totalMarks}
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                            required
                            data-testid="grade-marks-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feedback">Feedback (Optional)</Label>
                          <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Provide feedback to the student..."
                            rows={4}
                            data-testid="grade-feedback-input"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={gradeMutation.isPending}
                          data-testid="grade-submit-button"
                        >
                          {gradeMutation.isPending ? "Saving..." : "Save Grade"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
