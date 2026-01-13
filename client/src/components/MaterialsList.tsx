import { useState } from "react";
import { MaterialCard } from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMaterials, useDeleteMaterial } from "@/hooks/use-materials";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";
import { type Material } from "@shared/schema";

const SUBJECTS = ["All", "Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"];
const GRADES = ["All", "8", "9", "10", "11", "12"];

interface MaterialsListProps {
  isTeacher?: boolean;
}

export function MaterialsList({ isTeacher }: MaterialsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  
  const { data: materials, isLoading, error } = useMaterials();
  const deleteMutation = useDeleteMaterial();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete material",
        variant: "destructive",
      });
    }
  };

  const filteredMaterials = materials?.filter((material: Material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "All" || material.subject === subjectFilter;
    const matchesGrade = gradeFilter === "All" || material.grade === gradeFilter;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load materials</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="materials-list">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="materials-search-input"
          />
        </div>
        <div className="flex gap-2">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]" data-testid="materials-subject-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-[150px]" data-testid="materials-grade-filter">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade === "All" ? "All Grades" : `Grade ${grade}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials && filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onDelete={isTeacher ? handleDelete : undefined}
              isTeacher={isTeacher}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {materials?.length === 0
              ? "No materials uploaded yet"
              : "No materials match your filters"}
          </p>
        </div>
      )}
    </div>
  );
}
