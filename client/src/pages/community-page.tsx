import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Search, Users, Trophy, MessageSquare } from "lucide-react";

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("points");
  
  // Fetch leaderboard data
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
          <p className="text-muted-foreground">Connect with other members, view the leaderboard, and grow your pack.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>W.O.L.F. Community</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9 pr-4 w-[200px] md:w-[300px]" 
                      placeholder="Search members..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription>
                  Connect, compete, and grow with fellow pack members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span className="hidden sm:inline">Leaderboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="packs" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Packs</span>
                    </TabsTrigger>
                    <TabsTrigger value="discussions" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Discussions</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="leaderboard">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Global Leaderboard</h3>
                      <div>
                        <ToggleGroup type="single" value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
                          <ToggleGroupItem value="points" size="sm">Points</ToggleGroupItem>
                          <ToggleGroupItem value="workouts" size="sm">Workouts</ToggleGroupItem>
                          <ToggleGroupItem value="level" size="sm">Level</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-2">
                        {leaderboardLoading ? (
                          // Skeleton loading state
                          Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center p-3 rounded-lg bg-card border">
                              <div className="w-6 text-center font-semibold text-muted-foreground">
                                <Skeleton className="h-6 w-6" />
                              </div>
                              <Skeleton className="h-10 w-10 rounded-full ml-3" />
                              <div className="ml-3 flex-grow">
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          ))
                        ) : (
                          leaderboard?.map((member, index) => (
                            <div
                              key={member.id}
                              className={`flex items-center p-3 rounded-lg hover:bg-muted/40 transition-colors
                                ${member.id === user?.id ? 'bg-primary/5 border border-primary/20' : 'border'}`}
                            >
                              <div className="w-6 text-center font-semibold text-muted-foreground">
                                {index + 1}
                              </div>
                              <Avatar className="h-10 w-10 ml-2">
                                <AvatarImage src={member.profilePicture} alt={member.fullName} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {member.fullName?.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3 flex-grow">
                                <div className="flex items-center">
                                  <h4 className="text-sm font-semibold">{member.fullName}</h4>
                                  {index < 3 && (
                                    <Badge variant="outline" className="ml-2 bg-accent/10 text-accent">
                                      {index === 0 ? 'Alpha' : 'Beta'}
                                    </Badge>
                                  )}
                                  {member.id === user?.id && (
                                    <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                      You
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {member.points} pts • Level {member.level}
                                </div>
                              </div>
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/10 text-success">
                                <ArrowUp className="h-4 w-4" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="packs">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Users className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Pack Functionality Coming Soon</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Soon you'll be able to create and join packs, compete in team challenges, and achieve more together.
                      </p>
                      <Button variant="outline">Get Notified When Live</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="discussions">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Discussions Coming Soon</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        Community discussions, fitness tips, and experience sharing will be available soon.
                      </p>
                      <Button variant="outline">Get Notified When Live</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* User card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {user?.fullName?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{user?.fullName}</h3>
                  <div className="text-sm text-muted-foreground mb-4">Level {user?.level} • {user?.points} Points</div>
                  
                  <div className="w-full bg-muted rounded-full h-2 mb-6">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(user?.points || 0) % 100}%` }}
                    ></div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Quote Card */}
            <Card>
              <CardContent className="pt-6">
                <p className="quote text-center text-lg text-muted-foreground">
                  "The strength of the pack is the wolf, and the strength of the wolf is the pack."
                </p>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  - Rudyard Kipling
                </div>
              </CardContent>
            </Card>
            
            {/* Upcoming Events Card */}
            <Card>
              <CardHeader>
                <CardTitle>Community Events</CardTitle>
                <CardDescription>Upcoming meetups and virtual events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">Virtual HIIT Session</h4>
                    <p className="text-sm text-muted-foreground mb-2">June 15, 2023 • 6:00 PM</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">24 attending</span>
                      <Button size="sm" variant="outline">Join</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h4 className="font-semibold">Pack Trail Run</h4>
                    <p className="text-sm text-muted-foreground mb-2">June 20, 2023 • 8:00 AM</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">12 attending</span>
                      <Button size="sm" variant="outline">Join</Button>
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
