import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Zap, BarChart2, Users } from "lucide-react";

type StatsCardsProps = {
  stats: {
    totalWorkouts: number;
    totalCalories: number;
    avgProgress: number;
  } | undefined;
  isLoading: boolean;
};

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-montserrat font-semibold text-lg">Workout Summary</h3>
        <span className="text-sm text-primary font-semibold cursor-pointer">View All</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Workouts Card */}
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="text-primary mb-1">
            <Clock className="w-6 h-6" />
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalWorkouts || 0}
              </div>
              <div className="text-sm text-muted-foreground">Workouts</div>
            </>
          )}
        </div>
        
        {/* Calories Card */}
        <div className="bg-accent/10 p-4 rounded-lg">
          <div className="text-accent mb-1">
            <Zap className="w-6 h-6" />
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">
                {stats?.totalCalories ? (
                  stats.totalCalories >= 1000 
                    ? `${(stats.totalCalories / 1000).toFixed(1)}k` 
                    : stats.totalCalories
                ) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Calories</div>
            </>
          )}
        </div>
        
        {/* Progress Card */}
        <div className="bg-[#2ECC71]/10 p-4 rounded-lg">
          <div className="text-[#2ECC71] mb-1">
            <BarChart2 className="w-6 h-6" />
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">
                {stats?.avgProgress || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </>
          )}
        </div>
        
        {/* Pack Members Card */}
        <div className="bg-[#2C3E50]/10 p-4 rounded-lg">
          <div className="text-[#2C3E50] mb-1">
            <Users className="w-6 h-6" />
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Pack Members</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
