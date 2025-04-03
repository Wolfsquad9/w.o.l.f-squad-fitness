import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ActivityChartProps = {
  timeRange: string;
};

export default function ActivityChart({ timeRange }: ActivityChartProps) {
  const [activeRange, setActiveRange] = useState<"weekly" | "monthly">("weekly");
  
  // Update range when timeRange prop changes
  useEffect(() => {
    if (timeRange === "30days" || timeRange === "year") {
      setActiveRange("monthly");
    } else {
      setActiveRange("weekly");
    }
  }, [timeRange]);
  
  // Fetch workouts data
  const { data: workouts, isLoading } = useQuery({
    queryKey: ["/api/workouts"],
  });
  
  // Create data for the chart
  const generateChartData = () => {
    if (!workouts || !Array.isArray(workouts)) return [];
    
    if (activeRange === "weekly") {
      // Generate weekly data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      
      // In a real application, this would process actual workout data
      // For demo, we'll create sample data that matches the design
      return days.map(day => {
        let workoutCount = 0;
        
        // Show a pattern similar to the design
        switch (day) {
          case "Mon": workoutCount = 3; break;
          case "Tue": workoutCount = 5; break;
          case "Wed": workoutCount = 8; break; // highlighted day
          case "Thu": workoutCount = 6; break;
          case "Fri": workoutCount = 4; break;
          case "Sat": workoutCount = 2; break;
          case "Sun": workoutCount = 6; break; // highlighted day
          default: workoutCount = 0;
        }
        
        return {
          day,
          workouts: workoutCount,
          isHighlighted: day === "Wed" || day === "Sun"
        };
      });
    } else {
      // Generate monthly data
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      
      return weeks.map(week => ({
        day: week,
        workouts: Math.floor(Math.random() * 10) + 5,
        isHighlighted: week === "Week 3"
      }));
    }
  };
  
  const chartData = generateChartData();
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-foreground text-white text-xs py-1 px-2 rounded">
          {payload[0].value} workouts
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-montserrat font-semibold text-lg">Activity Tracking</h3>
        <div className="flex space-x-2 text-sm">
          <Button 
            size="sm"
            variant={activeRange === "weekly" ? "default" : "ghost"}
            onClick={() => setActiveRange("weekly")}
            className="px-3 py-1 rounded-full"
          >
            Weekly
          </Button>
          <Button 
            size="sm"
            variant={activeRange === "monthly" ? "default" : "ghost"}
            onClick={() => setActiveRange("monthly")}
            className="px-3 py-1 rounded-full"
          >
            Monthly
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4 h-64">
          {isLoading ? (
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between mb-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-8" />
                ))}
              </div>
              <div className="flex-grow">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8' }} 
                />
                <YAxis 
                  hide 
                  domain={[0, 'dataMax + 2']} 
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar 
                  dataKey="workouts" 
                  fill={(entry) => entry.isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.2)'}
                  radius={[4, 4, 0, 0]}
                  barSize={activeRange === "weekly" ? 30 : 50}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
