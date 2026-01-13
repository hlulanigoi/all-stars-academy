import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Home } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
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

          {/* Welcome Card */}
          <Card data-testid="welcome-card">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back, {user?.name}!</CardTitle>
              <CardDescription>
                You are successfully logged in to All Stars Excellency Academy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium" data-testid="user-name">{user?.name}</p>
                    <p className="text-sm text-muted-foreground" data-testid="user-email">{user?.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card data-testid="quick-links-card">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Explore our services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => setLocation("/subjects")}
                  data-testid="subjects-link"
                >
                  <span className="font-semibold">Subjects</span>
                  <span className="text-sm text-muted-foreground">View available subjects</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => setLocation("/pricing")}
                  data-testid="pricing-link"
                >
                  <span className="font-semibold">Pricing</span>
                  <span className="text-sm text-muted-foreground">Check our pricing plans</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => setLocation("/schedule")}
                  data-testid="schedule-link"
                >
                  <span className="font-semibold">Schedule</span>
                  <span className="text-sm text-muted-foreground">View class schedules</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  onClick={() => setLocation("/contact")}
                  data-testid="contact-link"
                >
                  <span className="font-semibold">Contact</span>
                  <span className="text-sm text-muted-foreground">Get in touch with us</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card data-testid="info-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  Your account is now active. You can browse all our services and contact us for enrollment.
                </p>
                <p className="text-muted-foreground">
                  This is a secure area. Your session will remain active for 7 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
