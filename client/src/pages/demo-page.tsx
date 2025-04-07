import { useState } from 'react';
import { useWorkoutSocket } from '@/hooks/use-workout-socket';
import { useAuth } from '@/hooks/use-auth';
import { ActivityFeed } from '@/components/real-time/activity-feed';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DemoPage() {
  const { user } = useAuth();
  const [workoutType, setWorkoutType] = useState('running');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(300);
  const [apparelName, setApparelName] = useState('Nike Running Shoes');
  const [apparelType, setApparelType] = useState('shoes');
  const [achievementName, setAchievementName] = useState('Early Riser');
  const [achievementDescription, setAchievementDescription] = useState('Complete a workout before 7AM');
  
  const { sendWorkoutUpdate, sendAchievementNotification, isConnected } = useWorkoutSocket();
  
  const handleSendWorkoutUpdate = () => {
    if (!user) return;
    
    sendWorkoutUpdate({
      userId: user.id,
      username: user.username,
      type: workoutType,
      duration,
      calories,
      apparelName,
      apparelType
    });
  };
  
  const handleSendAchievementNotification = () => {
    if (!user) return;
    
    sendAchievementNotification({
      userId: user.id,
      username: user.username,
      achievementName,
      achievementDescription
    });
  };
  
  if (!user) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <p>Please log in to access the WebSocket demo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">WebSocket Notification Demo</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Workout Update</CardTitle>
            <CardDescription>
              Simulate sending a workout notification to all connected users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Workout Type</label>
              <Select value={workoutType} onValueChange={setWorkoutType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="cycling">Cycling</SelectItem>
                  <SelectItem value="swimming">Swimming</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Duration (minutes)</label>
              <div className="flex items-center space-x-4">
                <Slider 
                  value={[duration]} 
                  min={5} 
                  max={120} 
                  step={5}
                  onValueChange={(value) => setDuration(value[0])} 
                  className="flex-1" 
                />
                <span className="w-12 text-center">{duration}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Calories Burned</label>
              <div className="flex items-center space-x-4">
                <Slider 
                  value={[calories]} 
                  min={50} 
                  max={1000} 
                  step={10}
                  onValueChange={(value) => setCalories(value[0])} 
                  className="flex-1" 
                />
                <span className="w-12 text-center">{calories}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Apparel Name</label>
              <Input 
                value={apparelName} 
                onChange={(e) => setApparelName(e.target.value)}
                placeholder="e.g. Nike Running Shoes" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Apparel Type</label>
              <Select value={apparelType} onValueChange={setApparelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select apparel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="shorts">Shorts</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="jacket">Jacket</SelectItem>
                  <SelectItem value="headwear">Headwear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSendWorkoutUpdate} 
              disabled={!isConnected}
              className="w-full"
            >
              Send Workout Update
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Send Achievement Notification</CardTitle>
            <CardDescription>
              Simulate a user unlocking an achievement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Achievement Name</label>
              <Input 
                value={achievementName} 
                onChange={(e) => setAchievementName(e.target.value)}
                placeholder="e.g. Early Riser" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Achievement Description</label>
              <Input 
                value={achievementDescription} 
                onChange={(e) => setAchievementDescription(e.target.value)}
                placeholder="e.g. Complete a workout before 7AM" 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSendAchievementNotification} 
              disabled={!isConnected}
              className="w-full"
              variant="secondary"
            >
              Send Achievement Notification
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 p-4 border border-border rounded-lg bg-card/50">
        <h3 className="text-lg font-semibold mb-2">WebSocket Status</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {isConnected 
            ? 'Your browser is successfully connected to the WebSocket server. Notifications will appear in real-time.' 
            : 'Not connected to the WebSocket server. Notifications may not appear in real-time.'}
        </p>
      </div>
      
      {/* Activity Feed Component */}
      <ActivityFeed />
    </div>
  );
}