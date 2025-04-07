import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { QRCodeGenerator } from "./qr-generator";
import { z } from "zod";
import { 
  insertWorkoutSchema, 
  insertApparelSchema, 
  updatePrivacySettingsSchema,
  insertUserPreferencesSchema,
  insertWorkoutRecommendationSchema
} from "@shared/schema";
import { WebSocketServer, WebSocket } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // API routes
  // User related endpoints
  app.get("/api/user/qrcode", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).send("User not found");
    }
    
    if (!user.qrCode) {
      // Generate new QR code if none exists
      const qrCode = await QRCodeGenerator.generateUserQR(userId);
      const updatedUser = await storage.updateUserQRCode(userId, qrCode);
      
      if (updatedUser) {
        return res.json({ qrCode: updatedUser.qrCode });
      } else {
        return res.status(500).send("Failed to update QR code");
      }
    }
    
    return res.json({ qrCode: user.qrCode });
  });
  
  app.put("/api/user/privacy", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user!.id;
      const privacySettings = updatePrivacySettingsSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserPrivacySettings(userId, privacySettings);
      
      if (updatedUser) {
        const { password, ...userWithoutPassword } = updatedUser;
        return res.json(userWithoutPassword);
      } else {
        return res.status(404).send("User not found");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).send("Internal server error");
    }
  });
  
  // Workout related endpoints
  app.get("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const workouts = await storage.getWorkoutsByUserId(userId, limit);
    res.json(workouts);
  });
  
  app.get("/api/workouts/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const stats = await storage.getWorkoutStats(userId);
    
    res.json(stats);
  });
  
  app.post("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user!.id;
      const workoutData = insertWorkoutSchema.parse(req.body);
      
      const workout = await storage.createWorkout({
        ...workoutData,
        userId,
        apparelId: req.body.apparelId
      });
      
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).send("Internal server error");
    }
  });
  
  // Apparel related endpoints
  app.get("/api/apparel", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const apparel = await storage.getApparelByUserId(userId);
    
    res.json(apparel);
  });
  
  app.post("/api/apparel", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user!.id;
      const apparelData = insertApparelSchema.parse(req.body);
      
      const apparel = await storage.createApparel({
        ...apparelData,
        userId
      });
      
      res.status(201).json(apparel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).send("Internal server error");
    }
  });
  
  app.get("/api/apparel/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const id = parseInt(req.params.id);
    const apparel = await storage.getApparelById(id);
    
    if (!apparel) {
      return res.status(404).send("Apparel not found");
    }
    
    if (apparel.userId !== req.user!.id) {
      return res.status(403).send("Forbidden");
    }
    
    res.json(apparel);
  });
  
  // Apparel usage stats endpoint
  app.get("/api/apparel/:id/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const id = parseInt(req.params.id);
    const apparel = await storage.getApparelById(id);
    
    if (!apparel) {
      return res.status(404).send("Apparel not found");
    }
    
    if (apparel.userId !== req.user!.id) {
      return res.status(403).send("Forbidden");
    }
    
    try {
      const stats = await storage.getApparelUsageStats(id);
      res.json(stats);
    } catch (error) {
      res.status(500).send("Error retrieving apparel stats");
    }
  });
  
  // Apparel workouts endpoint
  app.get("/api/apparel/:id/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const id = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const apparel = await storage.getApparelById(id);
    
    if (!apparel) {
      return res.status(404).send("Apparel not found");
    }
    
    if (apparel.userId !== req.user!.id) {
      return res.status(403).send("Forbidden");
    }
    
    try {
      const workouts = await storage.getApparelWorkouts(id, limit);
      res.json(workouts);
    } catch (error) {
      res.status(500).send("Error retrieving apparel workouts");
    }
  });
  
  // Most used apparel endpoint
  app.get("/api/apparel/insights/most-used", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    try {
      const apparel = await storage.getMostUsedApparel(userId, limit);
      res.json(apparel);
    } catch (error) {
      res.status(500).send("Error retrieving most used apparel");
    }
  });
  
  // Best performing apparel endpoint
  app.get("/api/apparel/insights/best-performing", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    try {
      const apparel = await storage.getBestPerformingApparel(userId, limit);
      res.json(apparel);
    } catch (error) {
      res.status(500).send("Error retrieving best performing apparel");
    }
  });
  
  // QR code related endpoints
  app.post("/api/scan", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const { qrCode } = req.body;
    
    if (!qrCode) {
      return res.status(400).send("QR code is required");
    }
    
    try {
      // First check if it's an apparel QR code
      const apparel = await storage.getApparelByQrCode(qrCode);
      
      if (apparel) {
        return res.json({
          type: "apparel",
          data: apparel
        });
      }
      
      // Check if it's a user QR code
      const users = await storage.getAllUsers();
      const user = users.find(user => user.qrCode === qrCode);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.json({
          type: "user",
          data: userWithoutPassword
        });
      }
      
      return res.status(404).send("QR code not recognized");
    } catch (error) {
      return res.status(500).send("Error processing QR code");
    }
  });
  
  // Achievement related endpoints
  app.get("/api/achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const achievements = await storage.getUserAchievements(userId);
    
    res.json(achievements);
  });
  
  // Challenge related endpoints
  app.get("/api/challenges", async (req, res) => {
    const challenges = await storage.getChallenges();
    res.json(challenges);
  });
  
  app.get("/api/user/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const challenges = await storage.getUserChallenges(userId);
    
    res.json(challenges);
  });
  
  app.post("/api/challenges/:id/join", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const challengeId = parseInt(req.params.id);
    
    try {
      const userChallenge = await storage.joinChallenge(userId, challengeId);
      res.status(201).json(userChallenge);
    } catch (error) {
      return res.status(500).send("Error joining challenge");
    }
  });
  
  // Integration related endpoints
  app.get("/api/integrations", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const apps = await storage.getIntegratedApps(userId);
    
    res.json(apps);
  });
  
  app.post("/api/integrations/:app", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const appName = req.params.app;
    const { accessToken, refreshToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).send("Access token is required");
    }
    
    try {
      const app = await storage.connectApp(userId, appName, accessToken, refreshToken);
      res.status(201).json(app);
    } catch (error) {
      return res.status(500).send("Error connecting app");
    }
  });
  
  app.delete("/api/integrations/:app", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const appName = req.params.app;
    
    try {
      await storage.disconnectApp(userId, appName);
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).send("Error disconnecting app");
    }
  });
  
  // Leaderboard endpoint
  app.get("/api/leaderboard", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leaderboard = await storage.getLeaderboard(limit);
    
    // Remove passwords from response
    const cleanLeaderboard = leaderboard.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(cleanLeaderboard);
  });
  
  // Workout Recommendations endpoints
  app.get("/api/workout-recommendations", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const recommendations = await storage.getWorkoutRecommendations(userId);
    
    res.json(recommendations);
  });
  
  app.get("/api/workout-recommendations/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const id = parseInt(req.params.id);
    const recommendation = await storage.getWorkoutRecommendation(id);
    
    if (!recommendation) {
      return res.status(404).send("Workout recommendation not found");
    }
    
    if (recommendation.userId !== req.user!.id) {
      return res.status(403).send("Forbidden");
    }
    
    res.json(recommendation);
  });
  
  app.post("/api/workout-recommendations/generate", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    
    try {
      const recommendation = await storage.generatePersonalizedRecommendation(userId);
      res.status(201).json(recommendation);
    } catch (error) {
      return res.status(500).send("Error generating workout recommendation");
    }
  });
  
  app.post("/api/workout-recommendations/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const id = parseInt(req.params.id);
    const recommendation = await storage.getWorkoutRecommendation(id);
    
    if (!recommendation) {
      return res.status(404).send("Workout recommendation not found");
    }
    
    if (recommendation.userId !== req.user!.id) {
      return res.status(403).send("Forbidden");
    }
    
    try {
      const completedRecommendation = await storage.completeWorkoutRecommendation(id);
      res.json(completedRecommendation);
    } catch (error) {
      return res.status(500).send("Error completing workout recommendation");
    }
  });
  
  app.get("/api/user/preferences", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    const userId = req.user!.id;
    const preferences = await storage.getUserPreferences(userId);
    
    if (!preferences) {
      return res.status(404).send("No preferences found");
    }
    
    res.json(preferences);
  });
  
  app.post("/api/user/preferences", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user!.id;
      const preferencesData = insertUserPreferencesSchema.parse(req.body);
      
      const preferences = await storage.saveUserPreferences(userId, preferencesData);
      res.status(201).json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).send("Internal server error");
    }
  });
  
  app.patch("/api/user/preferences", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userId = req.user!.id;
      
      const preferences = await storage.updateUserPreferences(userId, req.body);
      
      if (!preferences) {
        return res.status(404).send("No preferences found");
      }
      
      res.json(preferences);
    } catch (error) {
      return res.status(500).send("Error updating preferences");
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients = new Map<string, WebSocket>();
  
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');
    
    // Generate client ID
    const clientId = Math.random().toString(36).substring(2, 15);
    clients.set(clientId, ws);
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      clientId
    }));
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'workout_update') {
          // Broadcast workout updates to other clients
          clients.forEach((client, id) => {
            if (id !== clientId && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'workout_update',
                data: data.data
              }));
            }
          });
        } else if (data.type === 'achievement_unlocked') {
          // Broadcast achievement notifications to other clients
          clients.forEach((client, id) => {
            if (id !== clientId && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'achievement_notification',
                data: data.data
              }));
            }
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(clientId);
    });
  });
  
  return httpServer;
}
