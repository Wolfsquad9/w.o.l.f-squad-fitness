import { Link } from "wouter";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} W.O.L.F Squad. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </span>
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by W.O.L.F Squad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}