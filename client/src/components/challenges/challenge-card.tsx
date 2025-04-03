import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";

type ChallengeCardProps = {
  challenge: {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    image?: string;
    type: string;
    criteria: string;
  };
  isJoined: boolean;
  progress: number;
  onJoin: () => void;
  isJoining: boolean;
};

export default function ChallengeCard({ 
  challenge, 
  isJoined, 
  progress, 
  onJoin, 
  isJoining 
}: ChallengeCardProps) {
  // Calculate days remaining if challenge is in the future
  const now = new Date();
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  const isUpcoming = startDate > now;
  const isActive = startDate <= now && endDate >= now;
  const isExpired = endDate < now;
  
  const daysUntilStart = isUpcoming ? 
    Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  const daysRemaining = isActive ? 
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Generate placeholder participants
  const participants = 42;
  
  // Generate badges based on challenge type
  const getBadge = () => {
    if (isUpcoming) {
      return <Badge className="absolute top-0 left-0 bg-primary text-white px-3 py-1 rounded-br-lg">Starts in {daysUntilStart} days</Badge>;
    } else if (isActive) {
      return <Badge className="absolute top-0 left-0 bg-success text-white px-3 py-1 rounded-br-lg">Active • {daysRemaining} days left</Badge>;
    } else if (isExpired) {
      return <Badge className="absolute top-0 left-0 bg-muted text-muted-foreground px-3 py-1 rounded-br-lg">Completed</Badge>;
    }
    
    // Fallback based on type
    switch (challenge.type.toLowerCase()) {
      case 'featured':
        return <Badge className="absolute top-0 left-0 bg-accent text-white px-3 py-1 rounded-br-lg">Featured</Badge>;
      case 'team':
        return <Badge className="absolute top-0 left-0 bg-slate text-white px-3 py-1 rounded-br-lg">Team Challenge</Badge>;
      default:
        return <Badge className="absolute top-0 left-0 bg-primary text-white px-3 py-1 rounded-br-lg">New Challenge</Badge>;
    }
  };
  
  // Default image if none is provided
  const placeholderImage = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=300&q=80";
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
      {getBadge()}
      
      <div className="h-40 w-full bg-muted overflow-hidden">
        {/* Use a solid color with overlay instead of storing images */}
        <div 
          className={`h-full w-full bg-${challenge.type === 'featured' ? 'accent' : challenge.type === 'team' ? 'slate' : 'primary'}/30`}
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8
          }}
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-montserrat font-bold text-lg text-foreground mb-2">{challenge.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
        
        {isJoined && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>{progress}% complete</span>
              <span className="flex items-center text-xs text-muted-foreground">
                <Clock className="inline-block mr-1 h-3 w-3" />
                Ends {new Date(challenge.endDate).toLocaleDateString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex -space-x-2">
              {/* Avatar placeholders for participants */}
              {[...Array(3)].map((_, i) => (
                <Avatar key={i} className="border-2 border-background w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {String.fromCharCode(65 + i)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-xs text-white">
                +{participants - 3}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{participants} participants</p>
          </div>
          
          {isJoined ? (
            <Button variant="outline" className="px-3 py-1.5" disabled={isExpired}>
              {progress === 100 ? "Completed" : isExpired ? "Ended" : "View Details"}
            </Button>
          ) : (
            <Button 
              className="px-3 py-1.5" 
              onClick={onJoin} 
              disabled={isJoining || isExpired}
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : isExpired ? (
                "Ended"
              ) : (
                "Join"
              )}
            </Button>
          )}
        </div>
        
        <div className="mt-4 pt-2 border-t border-border/30 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
          </div>
          <Badge variant="outline" className="text-[10px]">
            {challenge.type}
          </Badge>
        </div>
      </div>
    </div>
  );
}
