import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Scroll } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RecentScansProps = {
  workouts: any[] | undefined;
  isLoading: boolean;
};

export default function RecentScans({ workouts, isLoading }: RecentScansProps) {
  // Icons for workout types
  const getWorkoutIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'upper body':
        return (
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
          </div>
        );
      case 'lower body':
        return (
          <div className="h-10 w-10 rounded-md bg-accent/10 flex items-center justify-center text-accent">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
          </div>
        );
      case 'cardio':
        return (
          <div className="h-10 w-10 rounded-md bg-slate/10 flex items-center justify-center text-slate">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Scroll className="w-6 h-6" />
          </div>
        );
    }
  };
  
  // Sample data for display if no workouts are available
  const sampleWorkouts = [
    {
      id: 1,
      item: "Performance Hoodie",
      qrCode: "#QR-2874",
      date: new Date().toLocaleDateString(),
      time: "10:24 AM",
      type: "Upper Body",
      duration: 45,
      progress: 12,
    },
    {
      id: 2,
      item: "Elite Joggers",
      qrCode: "#QR-2752",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "5:45 PM",
      type: "Lower Body",
      duration: 60,
      progress: 8,
    },
    {
      id: 3,
      item: "Training Shirt",
      qrCode: "#QR-2691",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      time: "7:15 AM",
      type: "Cardio",
      duration: 30,
      progress: 3,
    },
  ];
  
  // Use sample data if no workouts are available
  const displayWorkouts = workouts?.length ? workouts : sampleWorkouts;
  
  // Format the date to be more user-friendly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format the time from a date object
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-montserrat font-semibold text-lg">Recent Scans</h3>
        <span className="text-sm text-primary font-semibold cursor-pointer">View All</span>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-slate/10">
        <table className="min-w-full divide-y divide-slate/10">
          <thead className="bg-slate/5">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Apparel</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Workout</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Stats</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate/10">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="ml-4">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>
                </tr>
              ))
            ) : (
              // Actual data
              displayWorkouts.map((workout, index) => (
                <tr key={workout.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getWorkoutIcon(workout.type)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {workout.item || `Workout ${index + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {workout.qrCode || `#WKT-${1000 + index}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {workout.date || formatDate(workout.date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {workout.time || formatTime(workout.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {workout.type}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {workout.duration} mins
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Badge 
                      variant="outline"
                      className={`
                        ${workout.progress >= 10 ? 'bg-[#2ECC71]/10 text-[#2ECC71]' : 
                          workout.progress >= 5 ? 'bg-[#3498DB]/10 text-[#3498DB]' : 
                          'bg-[#F39C12]/10 text-[#F39C12]'}
                      `}
                    >
                      +{workout.progress}% Progress
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
