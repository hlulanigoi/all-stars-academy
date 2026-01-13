import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useUploadMaterial } from "@/hooks/use-materials";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = ["Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"];
const GRADES = ["8", "9", "10", "11", "12"];

export function UploadMaterialForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const uploadMutation = useUploadMaterial();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      
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

    if (!file || !subject || !grade) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("grade", grade);

    try {
      await uploadMutation.mutateAsync(formData);
      toast({
        title: "Success!",
        description: "Material uploaded successfully",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSubject("");
      setGrade("");
      setFile(null);
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload material",
        variant: "destructive",
      });
    }
  };

  return (
    <Card data-testid="upload-material-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Learning Material
        </CardTitle>
        <CardDescription>
          Share question papers and study materials with students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Grade 10 Mathematics Mid-Year Exam 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-testid="material-title-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this material..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="material-description-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject} required>
                <SelectTrigger data-testid="material-subject-select">
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
                <SelectTrigger data-testid="material-grade-select">
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

          <div className="space-y-2">
            <Label htmlFor="file-upload">PDF File * (Max 10MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                required
                data-testid="material-file-input"
              />
              {file && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploadMutation.isPending}
            data-testid="upload-material-submit-button"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload Material"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
