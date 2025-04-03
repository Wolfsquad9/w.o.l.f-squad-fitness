import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, User, Eye, Bell, LogOut } from "lucide-react";
import { updatePrivacySettingsSchema, type PrivacySettings } from "@shared/schema";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Fetch user data for profile
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user"],
  });
  
  // Update privacy settings mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: async (data: PrivacySettings) => {
      const res = await apiRequest("PUT", "/api/user/privacy", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update privacy settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Privacy settings form
  const privacyForm = useForm<PrivacySettings>({
    resolver: zodResolver(updatePrivacySettingsSchema),
    defaultValues: {
      shareWorkouts: user?.privacySettings?.shareWorkouts ?? true,
      shareAchievements: user?.privacySettings?.shareAchievements ?? true,
      showInLeaderboard: user?.privacySettings?.showInLeaderboard ?? true,
    },
  });
  
  // Handle privacy form submission
  const onPrivacySubmit = (data: PrivacySettings) => {
    updatePrivacyMutation.mutate(data);
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {user?.fullName?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mb-1">{user?.fullName}</h2>
                  <p className="text-sm text-muted-foreground mb-1">@{user?.username}</p>
                  <div className="flex items-center space-x-1 text-sm mb-4">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      Level {user?.level}
                    </span>
                    <span>•</span>
                    <span>{user?.points} Points</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(user?.points || 0) % 100}%` }}
                    ></div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Edit Profile Photo
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("general")}
                >
                  <User className="h-4 w-4 mr-2" />
                  General Settings
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("privacy")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                
                <Separator />
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <Input value={user?.fullName} disabled />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Username</label>
                            <Input value={user?.username} disabled />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input value={user?.email} disabled />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button disabled>
                            Edit Personal Information
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Editing personal information is disabled in this demo.
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Account Statistics</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Level</p>
                            <p className="text-2xl font-bold">{user?.level}</p>
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Points</p>
                            <p className="text-2xl font-bold">{user?.points}</p>
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">QR Code</p>
                            <p className="text-2xl font-bold">Active</p>
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="text-2xl font-bold capitalize">{user?.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="privacy">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Control what information is shared with the W.O.L.F. Squad community and how your data is used.
                        </p>
                        
                        <Form {...privacyForm}>
                          <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
                            <FormField
                              control={privacyForm.control}
                              name="shareWorkouts"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-base">Share Workouts</FormLabel>
                                    <FormDescription>
                                      Allow your workouts to be visible to other members of the community.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={privacyForm.control}
                              name="shareAchievements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-base">Share Achievements</FormLabel>
                                    <FormDescription>
                                      Allow your achievements and badges to be visible to other members.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={privacyForm.control}
                              name="showInLeaderboard"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-base">Show in Leaderboard</FormLabel>
                                    <FormDescription>
                                      Allow your profile to appear in community leaderboards.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit"
                              disabled={updatePrivacyMutation.isPending}
                            >
                              {updatePrivacyMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving Changes...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Data & Security</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Eye className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">View Your Data</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                Download a copy of your W.O.L.F. Squad data, including your workouts, achievements, and profile information.
                              </p>
                              <Button variant="outline" size="sm" disabled>
                                Download Your Data
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Account Security</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                Update your password and enable additional security features to protect your account.
                              </p>
                              <Button variant="outline" size="sm" disabled>
                                Manage Security Settings
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Control how and when you receive notifications from W.O.L.F. Squad.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h4 className="font-medium">Workout Reminders</h4>
                            <p className="text-sm text-muted-foreground">Receive reminders to complete your scheduled workouts</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h4 className="font-medium">Achievement Notifications</h4>
                            <p className="text-sm text-muted-foreground">Get notified when you earn new achievements</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h4 className="font-medium">Community Updates</h4>
                            <p className="text-sm text-muted-foreground">Receive updates about community challenges and events</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b">
                          <div>
                            <h4 className="font-medium">Friend Activity</h4>
                            <p className="text-sm text-muted-foreground">Get notified about your friends' workouts and achievements</p>
                          </div>
                          <Switch disabled />
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch checked disabled />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button disabled>
                          Save Notification Preferences
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Notification preferences are disabled in this demo.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
