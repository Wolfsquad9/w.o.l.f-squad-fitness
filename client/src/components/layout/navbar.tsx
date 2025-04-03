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
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>W.O.L.F Squad</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant={location === item.path ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
          <div className="mt-4">
            <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <UserCircle className="h-5 w-5 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start mt-2"
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
    <div className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <Button
            variant={location === item.path ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
          >
            {item.icon}
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );
  
  return (
    <header className="bg-background sticky top-0 border-b z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {renderMobileMenu()}
          <Link href="/">
            <div className="font-bold text-xl flex items-center">
              W.O.L.F Squad
            </div>
          </Link>
          {renderDesktopNav()}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture || undefined} alt={user.username} />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center" asChild>
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center"
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