import { useState } from "react";
import { AssignmentCard } from "@/components/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAssignments, useDeleteAssignment } from "@/hooks/use-assignments";
import { useMySubmissions } from "@/hooks/use-submissions";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";
import { type Assignment } from "@shared/schema";

const SUBJECTS = ["All", "Mathematics", "Physical Sciences", "English", "Life Sciences", "Accounting"];
const GRADES = ["All", "8", "9", "10", "11", "12"];

interface AssignmentsListProps {
  isTeacher?: boolean;
  onViewSubmissions?: (assignment: Assignment) => void;
  onSubmit?: (assignment: Assignment) => void;
}

export function AssignmentsList({ isTeacher, onViewSubmissions, onSubmit }: AssignmentsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  
  const { data: assignments, isLoading, error } = useAssignments();
  const { data: mySubmissions } = useMySubmissions();
  const deleteMutation = useDeleteAssignment();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assignment? This will delete all student submissions.")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete assignment",
        variant: "destructive",
      });
    }
  };

  const filteredAssignments = assignments?.filter((assignment: Assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === "All" || assignment.subject === subjectFilter;
    const matchesGrade = gradeFilter === "All" || assignment.grade === gradeFilter;
    return matchesSearch && matchesSubject && matchesGrade;
  });

  const submittedAssignmentIds = new Set(mySubmissions?.map((s: any) => s.assignmentId) || []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="assignments-list">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="assignments-search-input"
          />
        </div>
        <div className="flex gap-2">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]" data-testid="assignments-subject-filter">
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
            <SelectTrigger className="w-[150px]" data-testid="assignments-grade-filter">
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

      {/* Assignments Grid */}
      {filteredAssignments && filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onDelete={isTeacher ? handleDelete : undefined}
              onViewSubmissions={isTeacher ? onViewSubmissions : undefined}
              onSubmit={!isTeacher ? onSubmit : undefined}
              isTeacher={isTeacher}
              hasSubmitted={submittedAssignmentIds.has(assignment.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">
            {assignments?.length === 0
              ? "No assignments created yet"
              : "No assignments match your filters"}
          </p>
        </div>
      )}
    </div>
  );
}
