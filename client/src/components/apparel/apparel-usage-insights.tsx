import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Activity, 
  AlertCircle, 
  Award, 
  Calendar, 
  Clock, 
  Flame, 
  Shirt, 
  Timer,
  TrendingUp
} from "lucide-react";

type ApparelUsageInsightsProps = {
  apparelId: number;
};

export default function ApparelUsageInsights({ apparelId }: ApparelUsageInsightsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch apparel details
  const { data: apparel, isLoading: isLoadingApparel } = useQuery({
    queryKey: [`/api/apparel/${apparelId}`],
    enabled: !!apparelId,
  });
  
  // Fetch apparel usage stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/apparel/${apparelId}/stats`],
    enabled: !!apparelId,
  });
  
  // Fetch apparel workouts
  const { data: workouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: [`/api/apparel/${apparelId}/workouts`],
    enabled: !!apparelId,
  });
  
  const isLoading = isLoadingApparel || isLoadingStats || isLoadingWorkouts;
  
  // Generate performance rating level
  const getPerformanceLevel = (rating: number) => {
    if (rating >= 80) return { level: "Outstanding", color: "success" };
    if (rating >= 60) return { level: "Great", color: "primary" };
    if (rating >= 40) return { level: "Good", color: "primary" };
    if (rating >= 20) return { level: "Fair", color: "warning" };
    return { level: "Needs Improvement", color: "destructive" };
  };
  
  // Format date for display
  const formatDate = (date: string | null) => {
    if (!date) return "Never used";
    return new Date(date).toLocaleDateString();
  };
  
  // Prepare data for workout types chart
  const getWorkoutTypeData = () => {
    if (!workouts || workouts.length === 0) return [];
    
    const typeCounts: Record<string, number> = {};
    
    workouts.forEach(workout => {
      typeCounts[workout.type] = (typeCounts[workout.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };
  
  // Prepare data for workout duration chart
  const getWorkoutDurationData = () => {
    if (!workouts || workouts.length === 0) return [];
    
    return workouts
      .slice(0, 10)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(workout => ({
        date: new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        duration: workout.duration,
        calories: workout.calories
      }));
  };
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shirt className="mr-2 h-5 w-5 text-primary" />
          {isLoading ? <Skeleton className="h-7 w-48" /> : apparel?.name}
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="h-5 w-64" /> : `Usage insights and performance metrics for your ${apparel?.type}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-1">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Activity className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Total Workouts</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">{stats?.totalWorkouts || 0}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Timer className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Total Hours</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">{Math.round((stats?.totalDuration || 0) / 60)}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Avg Duration</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">{stats?.averageDuration || 0} <span className="text-sm font-normal">min</span></span>
                    )}
                  </div>
                  
                  <div className="flex flex-col p-4 border rounded-lg">
                    <div className="flex items-center mb-2">
                      <Flame className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Total Calories</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">{stats?.totalCalories || 0}</span>
                    )}
                  </div>
                </div>
                
                {/* Last Used */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Last Used</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    <span className="text-lg">{formatDate(stats?.lastUsed)}</span>
                  )}
                </div>
                
                {/* Workout Types */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm font-medium">Workout Types</span>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : getWorkoutTypeData().length > 0 ? (
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getWorkoutTypeData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {getWorkoutTypeData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      No workout data available
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                {/* Performance Rating */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Performance Rating</span>
                  </div>
                  
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl font-bold mr-2">{stats?.performanceRating || 0}</span>
                        <Badge variant="outline">
                          {getPerformanceLevel(stats?.performanceRating || 0).level}
                        </Badge>
                      </div>
                      <Progress value={stats?.performanceRating || 0} className="h-2" />
                    </>
                  )}
                </div>
                
                {/* Workout Duration Trend */}
                <div className="p-4 border rounded-lg flex-grow">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Workout Duration Trend</span>
                  </div>
                  
                  {isLoading ? (
                    <Skeleton className="h-40 w-full" />
                  ) : getWorkoutDurationData().length > 0 ? (
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={getWorkoutDurationData()}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="duration" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorDuration)" 
                            name="Duration (min)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Not enough workout data to show trends
                    </div>
                  )}
                </div>
                
                {/* Calories Burned Trend */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <Flame className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Calories Burned</span>
                  </div>
                  
                  {isLoading ? (
                    <Skeleton className="h-40 w-full" />
                  ) : getWorkoutDurationData().length > 0 ? (
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getWorkoutDurationData()}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Bar dataKey="calories" fill="#FF8042" name="Calories" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Not enough workout data to show calories burned
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Performance Level */}
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Performance Rating</h3>
                  
                  {isLoading ? (
                    <Skeleton className="h-8 w-32 mb-4" />
                  ) : (
                    <div className="flex items-center mb-4">
                      <span className="text-5xl font-bold mr-3">{stats?.performanceRating || 0}</span>
                      <div className="flex flex-col">
                        <Badge className="mb-1 w-max">
                          {getPerformanceLevel(stats?.performanceRating || 0).level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Based on workout intensity
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Beginner</span>
                      <span>Advanced</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-2 w-full" />
                    ) : (
                      <Progress value={stats?.performanceRating || 0} className="h-2" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    This rating is calculated based on your workout intensity, duration, and calories burned while wearing this apparel.
                  </p>
                </div>
                
                {/* Usage Efficiency */}
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Usage Efficiency</h3>
                  
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-full mb-6" />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl font-semibold mr-2">
                          {stats?.totalWorkouts ? Math.round(stats.totalCalories / stats.totalWorkouts) : 0}
                        </span>
                        <span className="text-sm text-muted-foreground">calories per workout</span>
                      </div>
                      <div className="mb-6">
                        <Progress 
                          value={Math.min(
                            stats?.totalWorkouts 
                              ? Math.round((stats.totalCalories / stats.totalWorkouts) / 8) 
                              : 0, 
                            100
                          )} 
                          className="h-2" 
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Average Duration</div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        <div className="text-xl font-semibold">{stats?.averageDuration || 0}<span className="text-sm ml-1">min</span></div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Total Calories</div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        <div className="text-xl font-semibold">{stats?.totalCalories || 0}</div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">Total Workouts</div>
                      {isLoading ? (
                        <Skeleton className="h-6 w-16 mx-auto" />
                      ) : (
                        <div className="text-xl font-semibold">{stats?.totalWorkouts || 0}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="overflow-hidden rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Duration</th>
                      <th className="h-10 px-4 text-left align-middle font-medium">Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4 align-middle"><Skeleton className="h-5 w-24" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-5 w-20" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-5 w-16" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-5 w-16" /></td>
                        </tr>
                      ))
                    ) : workouts && workouts.length > 0 ? (
                      workouts.map((workout) => (
                        <tr key={workout.id} className="border-b hover:bg-muted/50">
                          <td className="p-4 align-middle">{new Date(workout.date).toLocaleDateString()}</td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline">{workout.type}</Badge>
                          </td>
                          <td className="p-4 align-middle">{workout.duration} min</td>
                          <td className="p-4 align-middle">{workout.calories}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                          No workout history found for this apparel
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}