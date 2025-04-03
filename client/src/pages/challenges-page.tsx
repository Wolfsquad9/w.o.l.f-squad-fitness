import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ChallengeCard from "@/components/challenges/challenge-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Trophy, Users2, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch challenges
  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });
  
  // Fetch user challenges
  const { data: userChallenges, isLoading: userChallengesLoading } = useQuery({
    queryKey: ["/api/user/challenges"],
  });
  
  // Join challenge mutation
  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId: number) => {
      const res = await apiRequest("POST", `/api/challenges/${challengeId}/join`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/challenges"] });
    },
  });
  
  // Helper to check if user has joined a challenge
  const hasJoinedChallenge = (challengeId: number) => {
    if (!userChallenges) return false;
    return userChallenges.some((uc: any) => uc.challengeId === challengeId);
  };
  
  // Helper to get progress for a challenge
  const getChallengeProgress = (challengeId: number) => {
    if (!userChallenges) return 0;
    const challenge = userChallenges.find((uc: any) => uc.challengeId === challengeId);
    return challenge ? challenge.progress : 0;
  };
  
  // Filter challenges based on active tab
  const getFilteredChallenges = () => {
    if (!challenges) return [];
    
    switch (activeTab) {
      case "joined":
        if (!userChallenges) return [];
        return challenges.filter((c: any) => hasJoinedChallenge(c.id));
      case "upcoming":
        return challenges.filter((c: any) => new Date(c.startDate) > new Date());
      case "active":
        const now = new Date();
        return challenges.filter(
          (c: any) => 
            new Date(c.startDate) <= now && 
            new Date(c.endDate) >= now
        );
      default:
        return challenges;
    }
  };
  
  const filteredChallenges = getFilteredChallenges();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Challenges</h1>
          <p className="text-muted-foreground">Push your limits, compete, and earn rewards.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>W.O.L.F. Challenges</CardTitle>
                </div>
                <CardDescription>
                  Join fitness challenges to push your limits and compete with the pack
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="joined">Joined</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {challengesLoading || userChallengesLoading ? (
                      <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="h-[300px] rounded-xl overflow-hidden border">
                            <Skeleton className="h-40 w-full" />
                            <div className="p-6">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-full mb-4" />
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-10 w-20" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredChallenges.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No challenges found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md">
                          {activeTab === "joined" 
                            ? "You haven't joined any challenges yet. Explore available challenges to get started!"
                            : "No challenges available at the moment. Check back soon for new opportunities!"}
                        </p>
                        {activeTab === "joined" && (
                          <Button onClick={() => setActiveTab("all")}>
                            Explore Challenges
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredChallenges.map((challenge: any) => (
                          <ChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            isJoined={hasJoinedChallenge(challenge.id)}
                            progress={getChallengeProgress(challenge.id)}
                            onJoin={() => joinChallengeMutation.mutate(challenge.id)}
                            isJoining={joinChallengeMutation.isPending}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Your Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Challenges</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                {userChallengesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-4 w-24" />
                        <Separator className="my-3" />
                      </div>
                    ))}
                  </div>
                ) : !userChallenges || userChallenges.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't joined any challenges yet.
                    </p>
                    <Button size="sm" onClick={() => setActiveTab("all")}>
                      Explore Challenges
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userChallenges.map((userChallenge: any) => (
                      <div key={userChallenge.id}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{userChallenge.challenge.name}</h4>
                          <Badge variant={userChallenge.completed ? "default" : "outline"}>
                            {userChallenge.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <Progress value={userChallenge.progress} className="h-2 mb-1" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{userChallenge.progress}% complete</span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(userChallenge.challenge.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Separator className="my-3" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Earn Rewards</h4>
                      <p className="text-sm text-muted-foreground">Complete challenges to earn exclusive in-app badges and real rewards.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Boost Motivation</h4>
                      <p className="text-sm text-muted-foreground">Stay motivated with structured goals and friendly competition.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Build Community</h4>
                      <p className="text-sm text-muted-foreground">Connect with others who share your fitness goals and interests.</p>
                    </div>
                  </div>
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
