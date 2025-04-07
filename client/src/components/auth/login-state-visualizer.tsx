import { useEffect, useState } from "react";
import { LockKeyhole, Loader2, Unlock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import WolfMouthAnimation from "./wolf-mouth-animation";
import WolfGrowlEffect from "./wolf-growl-effect";

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
  const [playDevourAnimation, setPlayDevourAnimation] = useState(false);
  const [showDefaultSuccessIcon, setShowDefaultSuccessIcon] = useState(false);
  const [playGrowlEffect, setPlayGrowlEffect] = useState(false);

  // Reset error detail state when error changes
  useEffect(() => {
    if (state === "error") {
      const timer = setTimeout(() => setShowErrorDetail(true), 500);
      return () => clearTimeout(timer);
    }
    setShowErrorDetail(false);
  }, [state]);

  // Handle success animation
  useEffect(() => {
    if (state === "success") {
      // Delay the wolf animation a bit to let user see success feedback
      const timer = setTimeout(() => {
        setPlayDevourAnimation(true);
        setPlayGrowlEffect(true);
      }, 500);
      
      // After animation is complete, we'll reset to show the regular success icon
      const completeTimer = setTimeout(() => {
        setShowDefaultSuccessIcon(true);
      }, 3500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setPlayDevourAnimation(false);
      setShowDefaultSuccessIcon(false);
      setPlayGrowlEffect(false);
    }
  }, [state]);

  // Wolf mouth animation for success
  if (state === "success" && (playDevourAnimation || !showDefaultSuccessIcon)) {
    return (
      <>
        <WolfGrowlEffect isPlaying={playGrowlEffect} />
        <WolfMouthAnimation 
          isAnimating={playDevourAnimation} 
          onAnimationComplete={() => {
            setPlayDevourAnimation(false);
          }}
        />
        
        {/* Show initial success feedback before wolf animation */}
        {!playDevourAnimation && (
          <motion.div 
            className={cn("flex flex-col items-center justify-center py-4", className)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
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
          </motion.div>
        )}
      </>
    );
  }
  
  // Idle state
  if (state === "idle") {
    return (
      <motion.div 
        className={cn("flex flex-col items-center justify-center py-4", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-2">
            <LockKeyhole className="w-16 h-16 text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Ready to authenticate
          </p>
        </div>
      </motion.div>
    );
  }
  
  // Loading state
  if (state === "loading") {
    return (
      <motion.div 
        className={cn("flex flex-col items-center justify-center py-4", className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <Loader2 className="w-16 h-16 text-primary animate-spin" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Authenticating...
          </p>
        </div>
      </motion.div>
    );
  }
  
  // Error state
  if (state === "error") {
    return (
      <motion.div 
        className={cn("flex flex-col items-center justify-center py-4", className)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <XCircle className="w-16 h-16 text-red-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-red-500 mt-2">
            Authentication failed
          </p>
          
          <AnimatePresence>
            {showErrorDetail && errorMessage && (
              <motion.p 
                className="text-xs text-slate-500 mt-2 text-center max-w-[200px]"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errorMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
  
  // Default fallback (should never happen with our state types)
  return null;
}