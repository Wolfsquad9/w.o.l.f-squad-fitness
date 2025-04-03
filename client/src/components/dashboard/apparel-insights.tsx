import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shirt, ChevronRight } from "lucide-react";

export default function ApparelInsights() {
  const [, setLocation] = useLocation();
  
  // Fetch most used apparel
  const { data: mostUsedApparel, isLoading: isLoadingMostUsed } = useQuery({
    queryKey: ["/api/apparel/insights/most-used"],
  });
  
  // Fetch best performing apparel
  const { data: bestPerformingApparel, isLoading: isLoadingBestPerforming } = useQuery({
    queryKey: ["/api/apparel/insights/best-performing"],
  });
  
  const isLoading = isLoadingMostUsed || isLoadingBestPerforming;
  
  const navigateToApparelDetail = (id: number) => {
    setLocation(`/apparel/${id}`);
  };
  
  // Helper to format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never used";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Shirt className="h-5 w-5 mr-2 text-primary" />
          Smart Apparel Insights
        </CardTitle>
        <CardDescription>
          Performance analytics for your W.O.L.F gear
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {/* Most Used Apparel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Most Used</h3>
            {mostUsedApparel && mostUsedApparel.length > 0 && (
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs" 
                onClick={() => setLocation("/profile")}
              >
                View all
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
          
          {isLoadingMostUsed ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Shirt className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          ) : mostUsedApparel && mostUsedApparel.length > 0 ? (
            mostUsedApparel.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigateToApparelDetail(item.id)}
              >
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Shirt className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Last used: {formatDate(item.lastUsed)}
                  </p>
                </div>
                <Badge className="ml-auto">
                  {item.usageCount || 0} uses
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <p>No apparel data available yet</p>
              <Button variant="link" onClick={() => setLocation("/profile")}>
                Add your first apparel
              </Button>
            </div>
          )}
        </div>
        
        {/* Best Performing Apparel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Best Performing</h3>
            {bestPerformingApparel && bestPerformingApparel.length > 0 && (
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs" 
                onClick={() => setLocation("/profile")}
              >
                View all
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
          
          {isLoadingBestPerforming ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Shirt className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          ) : bestPerformingApparel && bestPerformingApparel.length > 0 ? (
            bestPerformingApparel.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => navigateToApparelDetail(item.id)}
              >
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <Shirt className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <Badge className="ml-auto" variant="outline">
                  {item.performanceRating || 0}/100
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              <p>Add more workouts to see performance</p>
              <Button variant="link" onClick={() => setLocation("/scan")}>
                Log a workout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}