import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema, InsertUser, LoginData } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import LoginStateVisualizer from "@/components/auth/login-state-visualizer";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Add login and register state management
  const [loginState, setLoginState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [registerState, setRegisterState] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Monitor login mutation status
  useEffect(() => {
    if (loginMutation.isPending) {
      setLoginState("loading");
    } else if (loginMutation.isError) {
      setLoginState("error");
    } else if (loginMutation.isSuccess) {
      setLoginState("success");
    }
  }, [loginMutation.isPending, loginMutation.isError, loginMutation.isSuccess]);
  
  // Monitor register mutation status
  useEffect(() => {
    if (registerMutation.isPending) {
      setRegisterState("loading");
    } else if (registerMutation.isError) {
      setRegisterState("error");
    } else if (registerMutation.isSuccess) {
      setRegisterState("success");
    }
  }, [registerMutation.isPending, registerMutation.isError, registerMutation.isSuccess]);

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    setLoginState("loading");
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: InsertUser) => {
    setRegisterState("loading");
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left column - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl font-montserrat text-primary">W.O.L.F SQUAD</CardTitle>
            <CardDescription className="text-slate-500">
              Join the pack. Elevate your fitness journey.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => {
                setActiveTab(v as "login" | "register");
                // Reset states when changing tabs
                if (v === "login") {
                  setLoginState("idle");
                  registerForm.reset();
                } else {
                  setRegisterState("idle");
                  loginForm.reset();
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-full">
                <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Login</TabsTrigger>
                <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginStateVisualizer 
                  state={loginState} 
                  errorMessage={loginMutation.error?.message}
                  className="mb-6"
                />
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={loginState === "loading" || loginState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={loginState === "loading" || loginState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full mt-6 rounded-xl py-6 bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                      disabled={loginMutation.isPending || loginState === "success"}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <LoginStateVisualizer 
                  state={registerState} 
                  errorMessage={registerMutation.error?.message}
                  className="mb-6"
                />
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={registerState === "loading" || registerState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={registerState === "loading" || registerState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={registerState === "loading" || registerState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-600 font-medium">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password (min. 8 characters)" 
                              className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus-visible:ring-primary/40 py-5"
                              {...field} 
                              disabled={registerState === "loading" || registerState === "success"}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full mt-6 rounded-xl py-6 bg-primary hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                      disabled={registerMutation.isPending || registerState === "success"}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">By continuing, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.</p>
          </CardFooter>
        </Card>
      </div>

      {/* Right column - Hero */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-foreground/80 text-white p-12 flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-8 tracking-tight">Elevate Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Fitness Journey</span></h1>
            <p className="text-xl mb-10 font-light leading-relaxed">W.O.L.F Squad integrates cutting-edge QR technology into premium fitness apparel, letting you track your progress seamlessly across every workout.</p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6 group">
              <div className="bg-white/10 p-4 rounded-2xl shadow-inner backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Track Your Progress</h3>
                <p className="text-white/80 font-light mt-2">Monitor your fitness journey with detailed analytics and insights based on real-time data.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 group">
              <div className="bg-white/10 p-4 rounded-2xl shadow-inner backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Join the Pack</h3>
                <p className="text-white/80 font-light mt-2">Connect with a community that shares your passion for fitness and helps each other grow stronger.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 group">
              <div className="bg-white/10 p-4 rounded-2xl shadow-inner backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Privacy & Security</h3>
                <p className="text-white/80 font-light mt-2">You have complete control over your data sharing preferences and visibility within the community.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-14 py-6 px-8 rounded-2xl bg-white/10 backdrop-blur-sm">
            <p className="text-xl quote text-white/90 leading-relaxed">
              "The strength of the pack is the wolf, and the strength of the wolf is the pack."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
