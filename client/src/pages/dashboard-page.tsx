import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import StatsCards from "@/components/dashboard/stats-cards";
import ActivityChart from "@/components/dashboard/activity-chart";
import RecentScans from "@/components/dashboard/recent-scans";
import QRCodeDisplay from "@/components/dashboard/qr-code-display";
import AchievementsList from "@/components/dashboard/achievements-list";
import PackLeaderboard from "@/components/dashboard/pack-leaderboard";
import ApparelInsights from "@/components/dashboard/apparel-insights";
import LiveActivityFeed from "@/components/dashboard/live-activity-feed";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ActivityFeed } from "@/components/real-time/activity-feed";

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  
  // Fetch stats data for the dashboard
  const { data: statsData, isLoading: statsLoading } = useQuery<{
    totalWorkouts: number;
    totalCalories: number;
    avgProgress: number;
  }>({
    queryKey: ["/api/workouts/stats"],
  });
  
  // Fetch recent workouts
  const { data: workouts, isLoading: workoutsLoading } = useQuery<any[]>({
    queryKey: ["/api/workouts", { limit: 3 }],
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content area */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Your Dashboard</h2>
                  <div className="flex items-center gap-3">
                    <Link href="/demo">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        Try WebSocket Demo
                      </Button>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="bg-muted px-3 py-1 rounded-lg border border-border/20 w-[180px]">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">Last 7 Days</SelectItem>
                          <SelectItem value="30days">Last 30 Days</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Stats cards */}
                <StatsCards stats={statsData as any} isLoading={statsLoading} />
                
                {/* Activity chart */}
                <ActivityChart timeRange={timeRange} />
                
                {/* Recent scans/workouts */}
                <RecentScans workouts={workouts as any} isLoading={workoutsLoading} />
                
                {/* Smart apparel insights */}
                <div className="mt-6">
                  <ApparelInsights />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3">
            {/* QR Code section */}
            <QRCodeDisplay userId={user?.id} />
            
            {/* Live Activity Feed */}
            <div className="mt-4">
              <LiveActivityFeed />
            </div>
            
            {/* Achievements section */}
            <div className="mt-4">
              <AchievementsList />
            </div>
            
            {/* Pack leaderboard */}
            <div className="mt-4">
              <PackLeaderboard currentUserId={user?.id} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Global Real-time Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
