import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AppCard from "@/components/integrations/app-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Smartphone, Activity, Watch } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function IntegrationsPage() {
  // Fetch user integrations
  const { data: userIntegrations, isLoading } = useQuery({
    queryKey: ["/api/integrations"],
  });
  
  // Connect app mutation
  const connectAppMutation = useMutation({
    mutationFn: async ({ appName, accessToken }: { appName: string; accessToken: string }) => {
      const res = await apiRequest("POST", `/api/integrations/${appName}`, { accessToken });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
    },
  });
  
  // Disconnect app mutation
  const disconnectAppMutation = useMutation({
    mutationFn: async (appName: string) => {
      await apiRequest("DELETE", `/api/integrations/${appName}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
    },
  });
  
  // Mock app data (in production this would come from the server)
  const availableApps = [
    {
      id: "strava",
      name: "Strava",
      description: "Sync your runs & rides automatically",
      icon: <Activity className="h-6 w-6 text-primary" />,
    },
    {
      id: "apple-health",
      name: "Apple Health",
      description: "Import health & activity data",
      icon: <Smartphone className="h-6 w-6 text-primary" />,
    },
    {
      id: "fitbit",
      name: "Fitbit",
      description: "Sync sleep & heart rate data",
      icon: <Watch className="h-6 w-6 text-muted-foreground" />,
    },
  ];
  
  // Helper to check if an app is connected
  const isAppConnected = (appId: string) => {
    if (!userIntegrations) return false;
    return userIntegrations.some((app: any) => app.appName === appId && app.connected);
  };
  
  // Helper to get mock access token (in production, this would be a proper OAuth flow)
  const getMockAccessToken = (appId: string) => {
    return `mock-token-${appId}-${Date.now()}`;
  };
  
  // Handle connect/disconnect
  const handleToggleConnection = (appId: string, isConnected: boolean) => {
    if (isConnected) {
      disconnectAppMutation.mutate(appId);
    } else {
      const accessToken = getMockAccessToken(appId);
      connectAppMutation.mutate({ appName: appId, accessToken });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connected Apps</h1>
          <p className="text-muted-foreground">Integrate with your favorite fitness apps to sync your data.</p>
        </div>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>For Demonstration Purposes</AlertTitle>
          <AlertDescription>
            In a production environment, these integrations would use proper OAuth flows for secure authorization.
            For now, they simulate the connection experience.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Integrations</CardTitle>
              <Button>Add Integration</Button>
            </div>
            <CardDescription>
              Connect your W.O.L.F Squad account with third-party fitness apps and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="ml-4 flex-grow">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                availableApps.map((app) => {
                  const isConnected = isAppConnected(app.id);
                  return (
                    <AppCard
                      key={app.id}
                      app={app}
                      isConnected={isConnected}
                      isLoading={
                        (connectAppMutation.isPending || disconnectAppMutation.isPending) &&
                        (
                          (connectAppMutation.variables as any)?.appName === app.id ||
                          disconnectAppMutation.variables === app.id
                        )
                      }
                      onToggleConnection={() => handleToggleConnection(app.id, isConnected)}
                    />
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Integration Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Centralized Data</h3>
                  <p className="text-muted-foreground">
                    Combine workout data from all your fitness apps in one place for a complete view of your progress.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Seamless Sync</h3>
                  <p className="text-muted-foreground">
                    Automatically sync your workouts, achievements, and health data across all platforms.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Watch className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Enhanced Insights</h3>
                  <p className="text-muted-foreground">
                    Get deeper analytics and personalized recommendations based on your combined fitness data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
