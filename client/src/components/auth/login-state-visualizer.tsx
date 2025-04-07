import { useEffect, useState } from "react";
import { LockKeyhole, Loader2, Unlock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LoginState = "idle" | "loading" | "success" | "error";

interface LoginStateVisualizerProps {
  state: LoginState;
  errorMessage?: string;
  className?: string;
}

export default function LoginStateVisualizer({
  state,
  errorMessage = "Authentication failed",
  className,
}: LoginStateVisualizerProps) {
  const [showErrorDetail, setShowErrorDetail] = useState(false);

  // Reset error detail state when error changes
  useEffect(() => {
    if (state === "error") {
      const timer = setTimeout(() => setShowErrorDetail(true), 500);
      return () => clearTimeout(timer);
    }
    setShowErrorDetail(false);
  }, [state]);

  // We'll use conditional rendering based on state instead of AnimatePresence
  // until we fix the issue with framer-motion
  
  if (state === "idle") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-4", className)}>
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-2">
            <LockKeyhole className="w-16 h-16 text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Ready to authenticate
          </p>
        </div>
      </div>
    );
  }
  
  if (state === "loading") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-4", className)}>
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <Loader2 className="w-16 h-16 text-primary animate-spin" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }
  
  if (state === "success") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-4", className)}>
        <div className="flex flex-col items-center">
          <div className="mb-2 relative">
            <Unlock className="w-16 h-16 text-green-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-green-500 mt-2">
              Authentication successful!
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (state === "error") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-4", className)}>
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <XCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-red-500 mt-2">
            Authentication failed
          </p>
          
          {showErrorDetail && errorMessage && (
            <p className="text-xs text-slate-500 mt-2 text-center max-w-[200px]">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  // Default fallback (should never happen with our state types)
  return null;
}