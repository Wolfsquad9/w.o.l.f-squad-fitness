import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import MobileNav from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LogOut, User, Settings, Scan, BarChart3 } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Check if the current path matches
  const isActive = (path: string) => {
    return location === path;
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, this would navigate to search results
  };
  
  return (
    <nav className="bg-[#1A1A1A] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
            </svg>
            <Link to="/">
              <span className="font-montserrat font-bold text-2xl tracking-tight cursor-pointer">W.O.L.F SQUAD</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/">
              <a className={`py-2 font-montserrat font-semibold border-b-2 ${isActive("/") ? "border-primary" : "border-transparent"}`}>
                Dashboard
              </a>
            </Link>
            <Link to="/community">
              <a className={`py-2 font-montserrat font-semibold border-b-2 ${isActive("/community") ? "border-primary" : "border-transparent"}`}>
                Community
              </a>
            </Link>
            <Link to="/challenges">
              <a className={`py-2 font-montserrat font-semibold border-b-2 ${isActive("/challenges") ? "border-primary" : "border-transparent"}`}>
                Challenges
              </a>
            </Link>
            <Link to="/integrations">
              <a className={`py-2 font-montserrat font-semibold border-b-2 ${isActive("/integrations") ? "border-primary" : "border-transparent"}`}>
                Integrations
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch}>
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-[#2C3E50] px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary text-white w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-white absolute right-3 top-2.5" />
              </form>
            </div>
            
            {/* Scan Button */}
            <Link to="/scan">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Scan className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <Avatar className="w-10 h-10 border-2 border-primary">
                      <AvatarImage src={user.profilePicture} alt={user.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.fullName?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block ml-2">
                      <p className="text-sm font-semibold">{user.fullName}</p>
                      <p className="text-xs text-blue-300">Level {user.level}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/">
                    <DropdownMenuItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>My Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Mobile menu button */}
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
