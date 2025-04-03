import { useState, useEffect, useCallback, useRef } from "react";

type WorkoutUpdate = {
  userId: number;
  username: string;
  type: string;
  duration: number;
  calories: number;
  apparelName?: string;
  apparelType?: string;
};

type AchievementNotification = {
  userId: number;
  username: string;
  achievementName: string;
  achievementDescription: string;
};

type SocketMessageCallbacks = {
  onWorkoutUpdate?: (data: WorkoutUpdate) => void;
  onAchievementNotification?: (data: AchievementNotification) => void;
};

export function useWorkoutSocket(callbacks?: SocketMessageCallbacks) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    });
    
    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    });
    
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });
    
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case "workout_update":
            if (callbacks?.onWorkoutUpdate) {
              callbacks.onWorkoutUpdate(message.data);
            }
            break;
            
          case "achievement_notification":
            if (callbacks?.onAchievementNotification) {
              callbacks.onAchievementNotification(message.data);
            }
            break;
            
          default:
            console.log("Received unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    
    // Cleanup function
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [callbacks]);
  
  const sendWorkoutUpdate = useCallback((data: WorkoutUpdate) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: "workout_update",
        data: data
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send workout update: WebSocket not connected");
    }
  }, []);
  
  const sendAchievementNotification = useCallback((data: AchievementNotification) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: "achievement_notification",
        data: data
      };
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Cannot send achievement notification: WebSocket not connected");
    }
  }, []);
  
  return {
    isConnected,
    sendWorkoutUpdate,
    sendAchievementNotification
  };
}