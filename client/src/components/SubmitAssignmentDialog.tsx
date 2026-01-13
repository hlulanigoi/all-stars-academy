import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileText } from "lucide-react";
import { useSubmitAssignment } from "@/hooks/use-submissions";
import { useToast } from "@/hooks/use-toast";
import { type Assignment } from "@shared/schema";

interface SubmitAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitAssignmentDialog({ assignment, open, onOpenChange }: SubmitAssignmentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const submitMutation = useSubmitAssignment();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !assignment) {
      toast({
        title: "Missing information",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitMutation.mutateAsync({ assignmentId: assignment.id, file });
      toast({
        title: "Success!",
        description: "Assignment submitted successfully",
      });
      
      // Reset and close
      setFile(null);
      const fileInput = document.getElementById("submission-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Could not submit assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="submit-assignment-dialog">
        <DialogHeader>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogDescription>
            {assignment?.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submission-file">Upload Your Work (Max 10MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="submission-file"
                type="file"
                onChange={handleFileChange}
                required
                data-testid="submission-file-input"
              />
              {file && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Accepted: PDF, DOC, DOCX, images, etc.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
            data-testid="submit-assignment-confirm-button"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Assignment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
