import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutSocket } from "@/hooks/use-workout-socket";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useParams, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Timer, Dumbbell, Flame, ArrowRight, PauseCircle, PlayCircle } from "lucide-react";

type Apparel = {
  id: number;
  name: string;
  type: string;
};

export default function LiveWorkoutTracker() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [notes, setNotes] = useState("");
  const [workoutType, setWorkoutType] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedApparelId, setSelectedApparelId] = useState<number | null>(null);
  const [shareProgress, setShareProgress] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [apparelItems, setApparelItems] = useState<Apparel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Socket connection for real-time updates
  const { isConnected, sendWorkoutUpdate } = useWorkoutSocket();
  
  // Fetch user's apparel items
  useEffect(() => {
    const fetchApparel = async () => {
      try {
        const res = await apiRequest("GET", "/api/apparel");
        const data = await res.json();
        setApparelItems(data);
      } catch (error) {
        console.error("Error fetching apparel:", error);
      }
    };
    
    fetchApparel();
  }, []);
  
  // Handle timer functionality
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          
          // If sharing is enabled, broadcast workout updates every 30 seconds
          if (shareProgress && newDuration % 30 === 0 && user) {
            const selectedApparel = apparelItems.find(item => item.id === selectedApparelId);
            
            sendWorkoutUpdate({
              userId: user.id,
              username: user.username,
              type: workoutType,
              duration: newDuration,
              calories: Math.round(newDuration * 0.1 * 5), // Simple estimation
              apparelName: selectedApparel?.name,
              apparelType: selectedApparel?.type
            });
          }
          
          // Update calories estimation (very simple formula)
          setCalories(Math.round(newDuration * 0.1 * 5));
          
          return newDuration;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, shareProgress, user, workoutType, selectedApparelId, apparelItems, sendWorkoutUpdate]);
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setDuration(0);
    setCalories(0);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleCompleteWorkout = async () => {
    if (duration < 10) {
      toast({
        title: "Workout too short",
        description: "Workout must be at least 10 seconds long to save.",
        variant: "destructive"
      });
      return;
    }
    
    if (!workoutType) {
      toast({
        title: "Workout type required",
        description: "Please select a workout type before saving.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const workoutData = {
        type: workoutType,
        duration,
        calories,
        notes: notes || null,
        apparelId: selectedApparelId
      };
      
      const response = await apiRequest("POST", "/api/workouts", workoutData);
      
      if (response.ok) {
        toast({
          title: "Workout saved!",
          description: `Your ${workoutType} workout has been recorded.`,
          variant: "default"
        });
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
        queryClient.invalidateQueries({ queryKey: ["/api/workouts/stats"] });
        
        if (selectedApparelId) {
          queryClient.invalidateQueries({ 
            queryKey: [`/api/apparel/${selectedApparelId}/stats`] 
          });
          queryClient.invalidateQueries({ 
            queryKey: [`/api/apparel/${selectedApparelId}/workouts`] 
          });
        }
        
        // Navigate back to dashboard
        navigate("/");
      } else {
        throw new Error("Failed to save workout");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Error saving workout",
        description: "There was a problem saving your workout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Live Workout Tracker</CardTitle>
        <CardDescription>
          Track your workout in real-time and share your progress with the pack
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer display */}
        <div className="text-center">
          <div className="text-5xl font-bold font-mono mb-2">{formatTime(duration)}</div>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTimer}
              disabled={isLoading}
            >
              {isRunning ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={resetTimer}
              disabled={isRunning || isLoading}
            >
              <Timer className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Duration</div>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {Math.floor(duration / 60)} min {duration % 60} sec
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Calories</div>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {calories} cal
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Workout details form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="workout-type">Workout Type</Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger id="workout-type" disabled={isLoading}>
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Weightlifting">Weightlifting</SelectItem>
                <SelectItem value="HIIT">HIIT</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="CrossFit">CrossFit</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="apparel-select">Apparel Used (Optional)</Label>
            <Select 
              value={selectedApparelId?.toString() || ""} 
              onValueChange={(value) => setSelectedApparelId(value ? parseInt(value) : null)}
            >
              <SelectTrigger id="apparel-select" disabled={isLoading}>
                <SelectValue placeholder="Select apparel (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {apparelItems.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name} ({item.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about your workout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="share-progress" 
              checked={shareProgress} 
              onCheckedChange={setShareProgress}
              disabled={isLoading}
            />
            <Label htmlFor="share-progress">
              Share progress with the pack {isConnected ? 
                <span className="text-xs text-green-500">(connected)</span> : 
                <span className="text-xs text-red-500">(disconnected)</span>
              }
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleCompleteWorkout}
          disabled={duration < 10 || !workoutType || isLoading}
        >
          {isLoading ? "Saving..." : "Complete Workout"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}