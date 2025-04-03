import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Home, 
  Users, 
  Award, 
  Settings, 
  LogOut, 
  Menu,
  Timer,
  Scan,
  Link as LinkIcon,
  UserCircle
} from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
    { path: "/workout", label: "Workout", icon: <Timer className="h-5 w-5 mr-2" /> },
    { path: "/scan", label: "Scan", icon: <Scan className="h-5 w-5 mr-2" /> },
    { path: "/community", label: "Community", icon: <Users className="h-5 w-5 mr-2" /> },
    { path: "/challenges", label: "Challenges", icon: <Award className="h-5 w-5 mr-2" /> },
    { path: "/integrations", label: "Integrations", icon: <LinkIcon className="h-5 w-5 mr-2" /> },
  ];
  
  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-primary/5">
          <Menu className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="backdrop-blur-md bg-white/90 border-r">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl">W.O.L.F Squad</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant={location === item.path ? "default" : "ghost"}
                className={`w-full justify-start rounded-xl mb-1 ${
                  location === item.path 
                  ? "bg-primary/10 text-primary font-medium hover:bg-primary/15" 
                  : "hover:bg-slate-50"
                }`}
              >
                {location === item.path 
                  ? <div className="text-primary mr-2">{item.icon}</div>
                  : <div className="text-slate-400 mr-2">{item.icon}</div>
                }
                {item.label}
              </Button>
            </Link>
          ))}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start rounded-xl mb-2 hover:bg-slate-50">
                <UserCircle className="h-5 w-5 mr-2 text-slate-400" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl text-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center gap-2 ml-6">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant={location === item.path ? "default" : "ghost"}
            size="sm"
            className={`flex items-center rounded-full px-4 transition-all ${
              location === item.path 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "hover:bg-primary/5 text-foreground/80"
            }`}
          >
            {item.icon}
            <span className={location === item.path ? "font-medium" : ""}>{item.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {renderMobileMenu()}
          <Link href="/">
            <div className="font-bold text-xl flex items-center text-primary">
              W.O.L.F Squad
            </div>
          </Link>
          {renderDesktopNav()}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden ring-0 hover:bg-primary/5">
                  <Avatar className="h-9 w-9 border-2 border-primary/10">
                    <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border rounded-xl shadow-md">
                <DropdownMenuLabel className="text-primary/80">My Account</DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center rounded-md hover:bg-primary/5 focus:bg-primary/5" asChild>
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4 mr-2 text-primary/80" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem
                  className="flex items-center rounded-md hover:bg-red-50 focus:bg-red-50 text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}