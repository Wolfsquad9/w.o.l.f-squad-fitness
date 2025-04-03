import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Users } from "lucide-react";

export default function AchievementsList() {
  // Fetch achievements data
  const { data: userAchievements, isLoading } = useQuery({
    queryKey: ["/api/achievements"],
  });
  
  // Get achievement icon based on its name
  const getAchievementIcon = (name: string, color: string) => {
    switch (name.toLowerCase()) {
      case "alpha consistency":
        return <Award className={`w-6 h-6 text-${color}`} />;
      case "power surge":
        return <Zap className={`w-6 h-6 text-${color}`} />;
      case "pack leader":
        return <Users className={`w-6 h-6 text-${color}`} />;
      default:
        return <Award className={`w-6 h-6 text-${color}`} />;
    }
  };
  
  // Sample achievements for display if no data is available
  const sampleAchievements = [
    {
      id: 1,
      achievement: {
        name: "Alpha Consistency",
        description: "Complete workouts 5 days in a row",
        icon: "award",
        color: "amber"
      },
      progress: 100,
      completed: true,
      status: "Unlocked"
    },
    {
      id: 2,
      achievement: {
        name: "Power Surge",
        description: "Burn 10,000 calories in a month",
        icon: "zap",
        color: "blue"
      },
      progress: 75,
      completed: false,
      status: "In Progress"
    },
    {
      id: 3,
      achievement: {
        name: "Pack Leader",
        description: "Invite 5 friends to join your pack",
        icon: "users",
        color: "slate"
      },
      progress: 20,
      completed: false,
      status: "Coming Soon"
    }
  ];
  
  // Use sample data if no achievements are available
  const displayAchievements = userAchievements?.length ? userAchievements : sampleAchievements;
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-montserrat font-bold text-lg text-foreground">Achievements</h3>
          <span className="text-sm text-primary font-semibold cursor-pointer">View All</span>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-1.5 w-full mt-1" />
                </div>
              </div>
            ))
          ) : (
            // Actual achievement data
            displayAchievements.map((item) => {
              const achievement = item.achievement;
              const color = achievement.color || "primary";
              const statusColor = item.completed 
                ? "success" 
                : item.progress > 50 
                ? "amber" 
                : "slate";
                
              return (
                <div key={item.id} className="flex items-center">
                  <div className={`h-12 w-12 rounded-full bg-${color} flex items-center justify-center`}>
                    {getAchievementIcon(achievement.name, "white")}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-montserrat font-semibold text-foreground">
                        {achievement.name}
                      </h4>
                      <Badge 
                        variant="outline"
                        className={`bg-${statusColor}/10 text-${statusColor}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    <Progress 
                      value={item.progress} 
                      className="w-full h-1.5 mt-1"
                      indicatorColor={color === "amber" ? "bg-amber" : color === "blue" ? "bg-primary" : "bg-slate"}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
