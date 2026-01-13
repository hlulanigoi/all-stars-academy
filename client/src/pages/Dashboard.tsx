import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Home, Upload, BookOpen, ClipboardList, FileCheck } from "lucide-react";
import { UploadMaterialForm } from "@/components/UploadMaterialForm";
import { MaterialsList } from "@/components/MaterialsList";
import { CreateAssignmentForm } from "@/components/CreateAssignmentForm";
import { AssignmentsList } from "@/components/AssignmentsList";
import { SubmitAssignmentDialog } from "@/components/SubmitAssignmentDialog";
import { MySubmissionsList } from "@/components/MySubmissionsList";
import { SubmissionsView } from "@/components/SubmissionsView";
import { useMySubmissions } from "@/hooks/use-submissions";
import { useAssignmentSubmissions } from "@/hooks/use-submissions";
import { type Assignment } from "@shared/schema";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<Assignment | null>(null);
  
  const { data: mySubmissions } = useMySubmissions();
  const { data: assignmentSubmissions } = useAssignmentSubmissions(viewingSubmissions?.id || null);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitDialogOpen(true);
  };

  const handleViewSubmissions = (assignment: Assignment) => {
    setViewingSubmissions(assignment);
  };

  const isTeacher = user?.role === "teacher";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-primary" data-testid="dashboard-title">
                {isTeacher ? "Teacher" : "Student"} Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                data-testid="dashboard-home-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                data-testid="dashboard-logout-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* User Info Card */}
          <Card data-testid="user-info-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium" data-testid="user-name">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium" data-testid="user-email">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize" data-testid="user-role">{user?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Management System */}
          <Card data-testid="lms-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Materials
              </CardTitle>
              <CardDescription>
                {isTeacher
                  ? "Upload and manage question papers and study materials"
                  : "Browse and download study materials"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTeacher ? (
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="upload" data-testid="upload-tab">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="manage" data-testid="manage-tab">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-6">
                    <UploadMaterialForm />
                  </TabsContent>
                  <TabsContent value="manage" className="mt-6">
                    <MaterialsList isTeacher={true} />
                  </TabsContent>
                </Tabs>
              ) : (
                <MaterialsList isTeacher={false} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
