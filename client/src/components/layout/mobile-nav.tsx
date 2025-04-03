import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Users, 
  Trophy, 
  Link2, 
  Search, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  Scan
} from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    setIsOpen(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };
  
  // Check if the current path matches
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-[#1A1A1A] text-white border-l border-[#2C3E50]">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
            </svg>
            <span className="font-montserrat">W.O.L.F SQUAD</span>
          </SheetTitle>
        </SheetHeader>
        
        {/* User Info */}
        {user && (
          <div className="py-6">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user.fullName?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user.fullName}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Level {user.level}
                  </span>
                  <span className="text-xs text-blue-300">
                    {user.points} pts
                  </span>
                </div>
              </div>
            </div>
            
            <Separator className="bg-[#2C3E50]" />
          </div>
        )}
        
        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="bg-[#2C3E50] border-0 pl-9 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* Navigation Links */}
        <div className="space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/") ? "bg-primary/10 text-primary" : ""}`}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/community" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/community") ? "bg-primary/10 text-primary" : ""}`}
            >
              <Users className="mr-2 h-5 w-5" />
              Community
            </Button>
          </Link>
          
          <Link to="/challenges" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/challenges") ? "bg-primary/10 text-primary" : ""}`}
            >
              <Trophy className="mr-2 h-5 w-5" />
              Challenges
            </Button>
          </Link>
          
          <Link to="/integrations" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/integrations") ? "bg-primary/10 text-primary" : ""}`}
            >
              <Link2 className="mr-2 h-5 w-5" />
              Integrations
            </Button>
          </Link>
          
          <Link to="/scan" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/scan") ? "bg-primary/10 text-primary" : ""}`}
            >
              <Scan className="mr-2 h-5 w-5" />
              Scan QR Code
            </Button>
          </Link>
        </div>
        
        <Separator className="my-6 bg-[#2C3E50]" />
        
        {/* Account Links */}
        <div className="space-y-1">
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className={`w-full justify-start ${isActive("/profile") ? "bg-primary/10 text-primary" : ""}`}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
          </Link>
          
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <p className="quote text-xs text-center text-blue-300">
            "The strength of the pack is the wolf, and the strength of the wolf is the pack."
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
