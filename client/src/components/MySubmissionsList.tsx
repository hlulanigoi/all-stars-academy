import { format } from "date-fns";
import { Download, FileText, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { downloadSubmission } from "@/hooks/use-submissions";

interface MySubmissionsListProps {
  submissions: any[];
}

export function MySubmissionsList({ submissions }: MySubmissionsListProps) {
  const handleDownload = (id: number, fileName: string) => {
    downloadSubmission(id, fileName);
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="my-submissions-list">
      {submissions.map((submission: any) => (
        <Card key={submission.id} data-testid="submission-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {submission.assignmentTitle}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {submission.subject} - Grade {submission.grade}
                </p>
              </div>
              <Badge 
                variant={submission.status === "graded" ? "default" : "secondary"}
                data-testid="submission-status"
              >
                {submission.status === "graded" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {submission.status === "graded" ? "Graded" : "Submitted"}
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
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{format(new Date(submission.dueDate), "MMM dd, yyyy")}</p>
                </div>
              </div>
              
              {submission.status === "graded" && (
                <div className="bg-muted p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Marks</p>
                      <p className="text-2xl font-bold text-primary" data-testid="submission-marks">
                        {submission.marks}/{submission.totalMarks}
                      </p>
                    </div>
                    {submission.feedback && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Feedback</p>
                        <p className="text-sm" data-testid="submission-feedback">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleDownload(submission.id, submission.fileName)}
                variant="outline"
                className="w-full"
                data-testid="download-submission-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Your Submission
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
