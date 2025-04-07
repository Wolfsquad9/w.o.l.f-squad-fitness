import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Pages
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CommunityPage from "@/pages/community-page";
import ChallengesPage from "@/pages/challenges-page";
import IntegrationsPage from "@/pages/integrations-page";
import ProfilePage from "@/pages/profile-page";
import ScanPage from "@/pages/scan-page";
import ApparelDetailPage from "@/pages/apparel-detail-page";
import WorkoutTrackerPage from "@/pages/workout-tracker-page";
import LandingPage from "@/pages/landing-page";
import DemoPage from "@/pages/demo-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <ProtectedRoute path="/challenges" component={ChallengesPage} />
      <ProtectedRoute path="/integrations" component={IntegrationsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/scan" component={ScanPage} />
      <ProtectedRoute path="/workout" component={WorkoutTrackerPage} />
      <ProtectedRoute path="/apparel/:id" component={ApparelDetailPage} />
      <ProtectedRoute path="/demo" component={DemoPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
