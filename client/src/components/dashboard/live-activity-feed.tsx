import { useState, useEffect } from "react";
import { useWorkoutSocket } from "@/hooks/use-workout-socket";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trophy,
  Dumbbell,
  Clock,
  Flame,
  User,
  TShirt,
} from "lucide-react";

type ActivityItem = {
  id: string;
  type: 'workout' | 'achievement';
  timestamp: Date;
  userId: number;
  username: string;
  data: any;
};

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const { isConnected } = useWorkoutSocket({
    onWorkoutUpdate: (data) => {
      const newActivity: ActivityItem = {
        id: `workout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'workout',
        timestamp: new Date(),
        userId: data.userId,
        username: data.username,
        data: {
          type: data.type,
          duration: data.duration,
          calories: data.calories,
          apparelName: data.apparelName,
          apparelType: data.apparelType,
        }
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    },
    onAchievementNotification: (data) => {
      const newActivity: ActivityItem = {
        id: `achievement-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'achievement',
        timestamp: new Date(),
        userId: data.userId,
        username: data.username,
        data: {
          achievementName: data.achievementName,
          achievementDescription: data.achievementDescription,
        }
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    }
  });
  
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m ${seconds % 60}s`;
    }
  };
  
  const renderActivityItem = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'workout':
        return (
          <Card key={activity.id} className="mb-3">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Dumbbell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="font-semibold">{activity.username}</span> is working out
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Badge variant="outline" className="mr-1">
                        {activity.data.type}
                      </Badge>
                      {activity.data.apparelName && (
                        <span className="flex items-center text-xs gap-1 mt-1">
                          <TShirt className="h-3 w-3" />
                          Using {activity.data.apparelName}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(activity.data.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {activity.data.calories} cal
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'achievement':
        return (
          <Card key={activity.id} className="mb-3">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Trophy className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="font-semibold">{activity.username}</span> earned an achievement
                    </p>
                    <p className="text-sm font-medium">
                      {activity.data.achievementName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.data.achievementDescription}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Live Activity Feed</CardTitle>
          <div className="flex items-center">
            <div 
              className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length > 0 ? (
            activities.map(renderActivityItem)
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <User className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                No activity yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Live updates will appear here as pack members start workouts
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}