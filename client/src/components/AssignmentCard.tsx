import { format } from "date-fns";
import { ClipboardList, Trash2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Assignment } from "@shared/schema";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete?: (id: number) => void;
  onViewSubmissions?: (assignment: Assignment) => void;
  onSubmit?: (assignment: Assignment) => void;
  isTeacher?: boolean;
  hasSubmitted?: boolean;
}

export function AssignmentCard({ assignment, onDelete, onViewSubmissions, onSubmit, isTeacher, hasSubmitted }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid="assignment-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              {assignment.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {assignment.description || "No description provided"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" data-testid="assignment-subject">{assignment.subject}</Badge>
          <Badge variant="outline" data-testid="assignment-grade">Grade {assignment.grade}</Badge>
          <Badge variant={isOverdue ? "destructive" : "default"}>
            {assignment.totalMarks} marks
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(dueDate, "MMM dd, yyyy 'at' h:mm a")}</span>
            {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
          </div>
          <p>Created: {format(new Date(assignment.createdAt), "MMM dd, yyyy")}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isTeacher ? (
          <>
            <Button
              onClick={() => onViewSubmissions?.(assignment)}
              className="flex-1"
              data-testid="view-submissions-button"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Submissions
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(assignment.id)}
                data-testid="delete-assignment-button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => onSubmit?.(assignment)}
            className="w-full"
            disabled={hasSubmitted || isOverdue}
            data-testid="submit-assignment-button"
          >
            {hasSubmitted ? "Already Submitted" : isOverdue ? "Overdue" : "Submit Assignment"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
