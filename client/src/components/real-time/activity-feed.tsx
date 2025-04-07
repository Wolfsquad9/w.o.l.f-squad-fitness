import { useState, useEffect } from 'react';
import { useWorkoutSocket } from '@/hooks/use-workout-socket';
import { useToast } from '@/hooks/use-toast';
import { X, Dumbbell, Award, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Notification = {
  id: string;
  type: 'workout' | 'achievement';
  username: string;
  content: string;
  timestamp: Date;
  read: boolean;
};

export function ActivityFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showFeed, setShowFeed] = useState(false);
  const [muted, setMuted] = useState(false);
  const { toast } = useToast();
  
  // Use our workout socket hook
  const { isConnected } = useWorkoutSocket({
    onWorkoutUpdate: (data) => {
      const newNotification: Notification = {
        id: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: 'workout',
        username: data.username,
        content: `completed a ${data.duration} min ${data.type} workout${data.apparelName ? ` wearing ${data.apparelName}` : ''}`,
        timestamp: new Date(),
        read: false
      };
      
      addNotification(newNotification);
      
      if (!muted) {
        playNotificationSound();
      }
    },
    onAchievementNotification: (data) => {
      const newNotification: Notification = {
        id: `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: 'achievement',
        username: data.username,
        content: `earned the achievement "${data.achievementName}"`,
        timestamp: new Date(),
        read: false
      };
      
      addNotification(newNotification);
      
      // Show a toast for achievements
      toast({
        title: '🏆 New Achievement Unlocked!',
        description: `${data.username} earned "${data.achievementName}"`,
        variant: 'default'
      });
      
      if (!muted) {
        playAchievementSound();
      }
    }
  });
  
  // Add notification and keep only the last 20
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Sound effects for notifications
  const playNotificationSound = () => {
    // Using a simple beep sound via AudioContext API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800; 
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
      }, 200);
    } catch (err) {
      console.error('Error playing notification sound:', err);
    }
  };
  
  const playAchievementSound = () => {
    // More complex achievement sound via AudioContext
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      // Frequency sweep effect
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      oscillator.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.4);
      
      // Fade out
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      setTimeout(() => {
        oscillator.stop();
      }, 500);
    } catch (err) {
      console.error('Error playing achievement sound:', err);
    }
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Toggle sound on/off
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Connection status indicator */}
      <div 
        className={`absolute top-[-40px] right-0 text-xs px-2 py-1 rounded-full ${
          isConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
        }`}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      {/* Feed toggle button */}
      <button
        onClick={() => {
          setShowFeed(!showFeed);
          if (!showFeed && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all relative"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 17V18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </button>
      
      {/* Activity feed panel */}
      <AnimatePresence>
        {showFeed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-96 max-h-[400px] glass-card rounded-xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-semibold">WOLF Squad Activity</h3>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute} 
                  className="h-8 w-8"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearAllNotifications} 
                  className="h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[320px] p-2">
              {notifications.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No recent activity</p>
                  <p className="text-xs mt-1">Live updates will appear here</p>
                </div>
              ) : (
                <AnimatePresence initial={false} mode="wait">
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                      className={`p-3 rounded-lg mb-2 ${
                        notification.read 
                          ? 'bg-card/50' 
                          : 'bg-card border-l-4 border-primary'
                      }`}
                    >
                      <div className="flex">
                        <div className={`mr-3 mt-0.5 ${
                          notification.type === 'workout' 
                            ? 'text-blue-400' 
                            : 'text-amber-400'
                        }`}>
                          {notification.type === 'workout' 
                            ? <Dumbbell size={18} /> 
                            : <Award size={18} />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{notification.username}</span>
                            {' '}{notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {timeSince(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to display relative time
function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  if (seconds < 10) return "just now";
  
  return Math.floor(seconds) + " seconds ago";
}