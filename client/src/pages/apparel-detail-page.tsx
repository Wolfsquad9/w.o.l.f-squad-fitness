import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ApparelUsageInsights from "@/components/apparel/apparel-usage-insights";
import { useAuth } from "@/hooks/use-auth";

export default function ApparelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const numericId = parseInt(id);
  
  // Fetch apparel details
  const { data: apparel, isLoading } = useQuery({
    queryKey: [`/api/apparel/${numericId}`],
    enabled: !!numericId && !!user,
  });
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container py-6 max-w-7xl space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1" 
          onClick={() => setLocation('/profile')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Apparel
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
            <Shirt className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-9 w-48" /> : apparel?.name}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? <Skeleton className="h-5 w-32" /> : apparel?.type}
            </p>
          </div>
        </div>
        
        {/* Usage Insights Component */}
        <ApparelUsageInsights apparelId={numericId} />
      </div>
    </div>
  );
}