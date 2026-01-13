import { Download, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Material } from "@shared/schema";
import { downloadMaterial } from "@/hooks/use-materials";
import { format } from "date-fns";

interface MaterialCardProps {
  material: Material;
  onDelete?: (id: number) => void;
  isTeacher?: boolean;
}

export function MaterialCard({ material, onDelete, isTeacher }: MaterialCardProps) {
  const handleDownload = () => {
    downloadMaterial(material.id, material.fileName);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid="material-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {material.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {material.description || "No description provided"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" data-testid="material-subject">{material.subject}</Badge>
          <Badge variant="outline" data-testid="material-grade">Grade {material.grade}</Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Size: {formatFileSize(material.fileSize)}</p>
          <p>Uploaded: {format(new Date(material.createdAt), "MMM dd, yyyy")}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={handleDownload}
          className="flex-1"
          data-testid="download-material-button"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        {isTeacher && onDelete && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(material.id)}
            data-testid="delete-material-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
