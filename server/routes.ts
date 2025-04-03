import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { QRCodeGenerator } from "./qr-generator";
import { z } from "zod";
import { 
  insertWorkoutSchema, 
  insertApparelSchema, 
  updatePrivacySettingsSchema 
} from "@shared/schema";

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
      const users = Array.from((storage as any).users.values());
      const user = users.find(u => u.qrCode === qrCode);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
