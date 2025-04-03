import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

type PackLeaderboardProps = {
  currentUserId?: number;
};

export default function PackLeaderboard({ currentUserId }: PackLeaderboardProps) {
  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard", { limit: 4 }],
  });
  
  // Sample leaderboard for display if no data is available
  const sampleLeaderboard = [
    {
      id: 1,
      fullName: "James Wilson",
      username: "jwilson",
      role: "Alpha",
      points: 328,
      level: 8,
      workouts: 24,
      trending: "up"
    },
    {
      id: 2,
      fullName: "Sofia Chen",
      username: "schen",
      role: "Beta",
      points: 301,
      level: 7,
      workouts: 18,
      trending: "up"
    },
    {
      id: 3,
      fullName: "Alex Morgan",
      username: "amorgan",
      role: "Beta",
      points: 289,
      level: 6,
      workouts: 16,
      trending: "down"
    },
    {
      id: 4,
      fullName: "Michael Torres",
      username: "mtorres",
      role: "Beta",
      points: 245,
      level: 5,
      workouts: 15,
      trending: "down"
    }
  ];
  
  // Use sample data if no leaderboard is available
  const displayLeaderboard = leaderboard?.length ? leaderboard : sampleLeaderboard;
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-montserrat font-bold text-lg text-foreground">Pack Leaderboard</h3>
          <span className="text-sm text-primary font-semibold cursor-pointer">View All</span>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center p-2 rounded-lg hover:bg-slate/5 transition-colors">
                <div className="w-6 text-center font-semibold text-muted-foreground">
                  <Skeleton className="h-6 w-6 mx-auto" />
                </div>
                <Skeleton className="w-10 h-10 ml-2 rounded-full" />
                <div className="ml-3 flex-grow">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-12 ml-2 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            ))
          ) : (
            // Actual leaderboard data
            displayLeaderboard.map((member, index) => {
              const isCurrentUser = member.id === currentUserId;
              const rank = index + 1;
              
              return (
                <div 
                  key={member.id} 
                  className={`flex items-center p-2 rounded-lg ${isCurrentUser ? 'bg-primary/5' : 'hover:bg-slate/5'} transition-colors`}
                >
                  <div className="w-6 text-center font-semibold text-muted-foreground">
                    {rank}
                  </div>
                  <div className="w-10 h-10 ml-2 rounded-full overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={member.profilePicture} alt={member.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex items-center">
                      <h4 className="text-sm font-semibold text-foreground">{member.fullName}</h4>
                      {rank === 1 && (
                        <Badge variant="outline" className="ml-2 px-1.5 py-0.5 text-xs bg-accent/10 text-accent">
                          Alpha
                        </Badge>
                      )}
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.points} pts • {member.workouts || 0} workouts
                    </div>
                  </div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                    ${member.trending === "up" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                  >
                    {member.trending === "up" ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              );
            })
          )}
          
          <div className="mt-4 pt-3 border-t border-slate/10">
            <p className="text-xs text-center text-muted-foreground quote">
              "The strength of the pack is the wolf, and the strength of the wolf is the pack."
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
