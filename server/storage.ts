import {
  users, apparel, workouts, achievements, userAchievements,
  challenges, userChallenges, integratedApps,
  type User, type InsertUser, type Apparel, type InsertApparel,
  type Workout, type InsertWorkout, type Achievement,
  type UserAchievement, type Challenge, type UserChallenge,
  type IntegratedApp, type PrivacySettings
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { QRCodeGenerator } from "./qr-generator";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserQRCode(userId: number, qrCode: string): Promise<User | undefined>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserLevel(userId: number, level: number): Promise<User | undefined>;
  updateUserPrivacySettings(userId: number, settings: PrivacySettings): Promise<User | undefined>;
  
  // Apparel operations
  createApparel(apparel: InsertApparel & { userId: number }): Promise<Apparel>;
  getApparelByUserId(userId: number): Promise<Apparel[]>;
  getApparelById(id: number): Promise<Apparel | undefined>;
  getApparelByQrCode(qrCode: string): Promise<Apparel | undefined>;
  updateApparelUsage(apparelId: number, workoutDuration: number, caloriesBurned: number): Promise<Apparel>;
  getApparelUsageStats(apparelId: number): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    averageDuration: number;
    lastUsed: Date | null;
    performanceRating: number;
  }>;
  getMostUsedApparel(userId: number, limit?: number): Promise<Apparel[]>;
  getBestPerformingApparel(userId: number, limit?: number): Promise<Apparel[]>;
  getApparelWorkouts(apparelId: number, limit?: number): Promise<Workout[]>;
  
  // Workout operations
  createWorkout(workout: InsertWorkout & { userId: number, apparelId?: number }): Promise<Workout>;
  getWorkoutsByUserId(userId: number, limit?: number): Promise<Workout[]>;
  getWorkoutStats(userId: number): Promise<{ totalWorkouts: number, totalCalories: number, avgProgress: number }>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement>;
  
  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]>;
  joinChallenge(userId: number, challengeId: number): Promise<UserChallenge>;
  updateChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge>;
  
  // Integration operations
  getIntegratedApps(userId: number): Promise<IntegratedApp[]>;
  connectApp(userId: number, appName: string, accessToken: string, refreshToken?: string): Promise<IntegratedApp>;
  disconnectApp(userId: number, appName: string): Promise<void>;
  
  // Leaderboard operations
  getLeaderboard(limit?: number): Promise<User[]>;
  
  // Session storage
  sessionStore: ReturnType<typeof createMemoryStore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apparel: Map<number, Apparel>;
  private workouts: Map<number, Workout>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private challenges: Map<number, Challenge>;
  private userChallenges: Map<number, UserChallenge>;
  private integratedApps: Map<number, IntegratedApp>;
  
  public sessionStore: ReturnType<typeof createMemoryStore>;
  
  private currentUserId: number;
  private currentApparelId: number;
  private currentWorkoutId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;
  private currentChallengeId: number;
  private currentUserChallengeId: number;
  private currentIntegratedAppId: number;
  
  constructor() {
    this.users = new Map();
    this.apparel = new Map();
    this.workouts = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    this.integratedApps = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    this.currentUserId = 1;
    this.currentApparelId = 1;
    this.currentWorkoutId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentChallengeId = 1;
    this.currentUserChallengeId = 1;
    this.currentIntegratedAppId = 1;
    
    // Initialize with default achievements
    this.initializeAchievements();
    
    // Initialize with default challenges
    this.initializeChallenges();
    
    // Create a test user for development
    this.createTestUser();
  }
  
  // Create a test user with a known password for development
  private async createTestUser() {
    // Import password hashing functions from auth.ts
    const { hashPassword } = await import('./auth');
    
    // Only create test user if no users exist
    if (this.users.size === 0) {
      // Hash the password "password123"
      const password = "password123";
      const hashedPassword = await hashPassword(password);
      
      const testUser: User = {
        id: this.currentUserId++,
        username: "testuser",
        password: hashedPassword,
        email: "testuser@wolf.com",
        fullName: "Test User",
        level: 1,
        points: 0,
        role: "member",
        qrCode: "test-qr-code",
        profilePicture: undefined,
        privacySettings: {
          shareWorkouts: true,
          shareAchievements: true,
          showInLeaderboard: true
        }
      };
      
      this.users.set(testUser.id, testUser);
      console.log("Created test user with username: testuser and password: password123");
    }
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const qrCode = await QRCodeGenerator.generateUserQR(id);
    const user: User = { 
      ...insertUser, 
      id, 
      qrCode,
      level: 1,
      points: 0,
      role: "member",
      profilePicture: undefined,
      privacySettings: {
        shareWorkouts: true,
        shareAchievements: true,
        showInLeaderboard: true
      }
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserQRCode(userId: number, qrCode: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, qrCode };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const newPoints = user.points + points;
    
    // Level up every 100 points
    const level = Math.floor(newPoints / 100) + 1;
    
    const updatedUser = { ...user, points: newPoints, level };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserLevel(userId: number, level: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, level };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserPrivacySettings(userId: number, settings: PrivacySettings): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      privacySettings: {
        ...user.privacySettings,
        ...settings
      }
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Apparel methods
  async createApparel(apparelData: InsertApparel & { userId: number }): Promise<Apparel> {
    const id = this.currentApparelId++;
    const qrCode = await QRCodeGenerator.generateApparelQR(id, apparelData.userId);
    const date = new Date();
    
    const apparel: Apparel = {
      id,
      userId: apparelData.userId,
      name: apparelData.name,
      type: apparelData.type,
      qrCode,
      dateAdded: date,
      usageCount: 0,
      lastUsed: null,
      totalWorkoutDuration: 0,
      totalCaloriesBurned: 0,
      averageWorkoutDuration: 0,
      performanceRating: 0
    };
    
    this.apparel.set(id, apparel);
    return apparel;
  }
  
  async updateApparelUsage(apparelId: number, workoutDuration: number, caloriesBurned: number): Promise<Apparel> {
    const apparel = await this.getApparelById(apparelId);
    if (!apparel) {
      throw new Error(`Apparel not found with ID: ${apparelId}`);
    }
    
    const now = new Date();
    const newUsageCount = (apparel.usageCount || 0) + 1;
    const newTotalDuration = (apparel.totalWorkoutDuration || 0) + workoutDuration;
    const newTotalCalories = (apparel.totalCaloriesBurned || 0) + caloriesBurned;
    const newAverageDuration = Math.round(newTotalDuration / newUsageCount);
    
    // Calculate a performance rating (0-100) based on duration and calories
    const durationFactor = Math.min(workoutDuration / 60, 1); // Cap at 1 hour
    const caloriesFactor = Math.min(caloriesBurned / 500, 1); // Cap at 500 calories
    const currentPerformance = Math.round((durationFactor * 0.5 + caloriesFactor * 0.5) * 100);
    
    // Blend with existing rating for smoother changes (70% old, 30% new)
    const oldRating = apparel.performanceRating || 0;
    const newRating = Math.round(oldRating * 0.7 + currentPerformance * 0.3);
    
    const updatedApparel: Apparel = {
      ...apparel,
      usageCount: newUsageCount,
      lastUsed: now,
      totalWorkoutDuration: newTotalDuration,
      totalCaloriesBurned: newTotalCalories,
      averageWorkoutDuration: newAverageDuration,
      performanceRating: newRating
    };
    
    this.apparel.set(apparelId, updatedApparel);
    return updatedApparel;
  }
  
  async getApparelUsageStats(apparelId: number): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    averageDuration: number;
    lastUsed: Date | null;
    performanceRating: number;
  }> {
    const apparel = await this.getApparelById(apparelId);
    if (!apparel) {
      throw new Error(`Apparel not found with ID: ${apparelId}`);
    }
    
    return {
      totalWorkouts: apparel.usageCount || 0,
      totalDuration: apparel.totalWorkoutDuration || 0,
      totalCalories: apparel.totalCaloriesBurned || 0,
      averageDuration: apparel.averageWorkoutDuration || 0,
      lastUsed: apparel.lastUsed || null,
      performanceRating: apparel.performanceRating || 0
    };
  }
  
  async getMostUsedApparel(userId: number, limit: number = 5): Promise<Apparel[]> {
    const userApparel = await this.getApparelByUserId(userId);
    
    return userApparel
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit);
  }
  
  async getBestPerformingApparel(userId: number, limit: number = 5): Promise<Apparel[]> {
    const userApparel = await this.getApparelByUserId(userId);
    
    return userApparel
      .sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0))
      .slice(0, limit);
  }
  
  async getApparelWorkouts(apparelId: number, limit?: number): Promise<Workout[]> {
    const apparelWorkouts = Array.from(this.workouts.values())
      .filter(workout => workout.apparelId === apparelId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? apparelWorkouts.slice(0, limit) : apparelWorkouts;
  }
  
  async getApparelByUserId(userId: number): Promise<Apparel[]> {
    return Array.from(this.apparel.values()).filter(
      (apparel) => apparel.userId === userId
    );
  }
  
  async getApparelById(id: number): Promise<Apparel | undefined> {
    return this.apparel.get(id);
  }
  
  async getApparelByQrCode(qrCode: string): Promise<Apparel | undefined> {
    return Array.from(this.apparel.values()).find(
      (apparel) => apparel.qrCode === qrCode
    );
  }
  
  // Workout methods
  async createWorkout(workoutData: InsertWorkout & { userId: number, apparelId?: number }): Promise<Workout> {
    const id = this.currentWorkoutId++;
    const date = new Date();
    
    const workout: Workout = {
      id,
      userId: workoutData.userId,
      apparelId: workoutData.apparelId,
      type: workoutData.type,
      duration: workoutData.duration,
      calories: workoutData.calories || 0,
      date,
      progress: workoutData.duration > 30 ? 10 : 5, // Simple progress calculation
      notes: workoutData.notes
    };
    
    this.workouts.set(id, workout);
    
    // Update user points
    await this.updateUserPoints(workoutData.userId, workout.duration / 5);
    
    // Update apparel usage statistics if apparel was used
    if (workoutData.apparelId) {
      await this.updateApparelUsage(
        workoutData.apparelId, 
        workoutData.duration, 
        workoutData.calories || 0
      );
    }
    
    // Check for achievements
    await this.checkWorkoutAchievements(workoutData.userId);
    
    return workout;
  }
  
  async getWorkoutsByUserId(userId: number, limit?: number): Promise<Workout[]> {
    const userWorkouts = Array.from(this.workouts.values())
      .filter((workout) => workout.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? userWorkouts.slice(0, limit) : userWorkouts;
  }
  
  async getWorkoutStats(userId: number): Promise<{ totalWorkouts: number, totalCalories: number, avgProgress: number }> {
    const userWorkouts = await this.getWorkoutsByUserId(userId);
    
    const totalWorkouts = userWorkouts.length;
    const totalCalories = userWorkouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    
    const progressValues = userWorkouts.map(workout => workout.progress || 0);
    const avgProgress = progressValues.length > 0 
      ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length) 
      : 0;
    
    return { totalWorkouts, totalCalories, avgProgress };
  }
  
  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter((ua) => ua.userId === userId);
    
    return userAchievements.map(ua => {
      const achievement = this.achievements.get(ua.achievementId);
      if (!achievement) throw new Error(`Achievement not found: ${ua.achievementId}`);
      return { ...ua, achievement };
    });
  }
  
  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existing = Array.from(this.userAchievements.values()).find(
      ua => ua.userId === userId && ua.achievementId === achievementId
    );
    
    if (existing && existing.completed) {
      return existing;
    }
    
    if (existing) {
      // Update existing
      const updated: UserAchievement = {
        ...existing,
        progress: 100,
        completed: true,
        dateEarned: new Date()
      };
      this.userAchievements.set(existing.id, updated);
      
      // Award points
      await this.updateUserPoints(userId, 25);
      
      return updated;
    } else {
      // Create new
      const id = this.currentUserAchievementId++;
      const userAchievement: UserAchievement = {
        id,
        userId,
        achievementId,
        progress: 100,
        completed: true,
        dateEarned: new Date()
      };
      
      this.userAchievements.set(id, userAchievement);
      
      // Award points
      await this.updateUserPoints(userId, 25);
      
      return userAchievement;
    }
  }
  
  async updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existing = Array.from(this.userAchievements.values()).find(
      ua => ua.userId === userId && ua.achievementId === achievementId
    );
    
    if (existing) {
      // Only update if new progress is higher
      if (progress > existing.progress) {
        const completed = progress >= 100;
        const updated: UserAchievement = {
          ...existing,
          progress,
          completed,
          dateEarned: completed ? new Date() : existing.dateEarned
        };
        
        this.userAchievements.set(existing.id, updated);
        
        // Award points if newly completed
        if (completed && !existing.completed) {
          await this.updateUserPoints(userId, 25);
        }
        
        return updated;
      }
      return existing;
    } else {
      // Create new
      const id = this.currentUserAchievementId++;
      const completed = progress >= 100;
      
      const userAchievement: UserAchievement = {
        id,
        userId,
        achievementId,
        progress,
        completed,
        dateEarned: completed ? new Date() : undefined
      };
      
      this.userAchievements.set(id, userAchievement);
      
      // Award points if completed
      if (completed) {
        await this.updateUserPoints(userId, 25);
      }
      
      return userAchievement;
    }
  }
  
  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }
  
  async getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const userChallenges = Array.from(this.userChallenges.values())
      .filter((uc) => uc.userId === userId);
    
    return userChallenges.map(uc => {
      const challenge = this.challenges.get(uc.challengeId);
      if (!challenge) throw new Error(`Challenge not found: ${uc.challengeId}`);
      return { ...uc, challenge };
    });
  }
  
  async joinChallenge(userId: number, challengeId: number): Promise<UserChallenge> {
    // Check if user already joined this challenge
    const existing = Array.from(this.userChallenges.values()).find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    );
    
    if (existing) {
      return existing;
    }
    
    // Create new entry
    const id = this.currentUserChallengeId++;
    const userChallenge: UserChallenge = {
      id,
      userId,
      challengeId,
      dateJoined: new Date(),
      progress: 0,
      completed: false
    };
    
    this.userChallenges.set(id, userChallenge);
    return userChallenge;
  }
  
  async updateChallengeProgress(userId: number, challengeId: number, progress: number): Promise<UserChallenge> {
    // Check if user already joined this challenge
    const existing = Array.from(this.userChallenges.values()).find(
      uc => uc.userId === userId && uc.challengeId === challengeId
    );
    
    if (!existing) {
      throw new Error("User has not joined this challenge");
    }
    
    // Only update if new progress is higher
    if (progress > existing.progress) {
      const completed = progress >= 100;
      const updated: UserChallenge = {
        ...existing,
        progress,
        completed
      };
      
      this.userChallenges.set(existing.id, updated);
      
      // Award points if newly completed
      if (completed && !existing.completed) {
        await this.updateUserPoints(userId, 50);
      }
      
      return updated;
    }
    
    return existing;
  }
  
  // Integration methods
  async getIntegratedApps(userId: number): Promise<IntegratedApp[]> {
    return Array.from(this.integratedApps.values())
      .filter((app) => app.userId === userId);
  }
  
  async connectApp(userId: number, appName: string, accessToken: string, refreshToken?: string): Promise<IntegratedApp> {
    // Check if app is already connected
    const existing = Array.from(this.integratedApps.values()).find(
      app => app.userId === userId && app.appName === appName
    );
    
    if (existing) {
      const updated: IntegratedApp = {
        ...existing,
        connected: true,
        accessToken,
        refreshToken,
        lastSynced: new Date()
      };
      
      this.integratedApps.set(existing.id, updated);
      return updated;
    }
    
    // Create new connection
    const id = this.currentIntegratedAppId++;
    const app: IntegratedApp = {
      id,
      userId,
      appName,
      connected: true,
      accessToken,
      refreshToken,
      lastSynced: new Date()
    };
    
    this.integratedApps.set(id, app);
    return app;
  }
  
  async disconnectApp(userId: number, appName: string): Promise<void> {
    const existing = Array.from(this.integratedApps.values()).find(
      app => app.userId === userId && app.appName === appName
    );
    
    if (existing) {
      const updated: IntegratedApp = {
        ...existing,
        connected: false,
        accessToken: undefined,
        refreshToken: undefined
      };
      
      this.integratedApps.set(existing.id, updated);
    }
  }
  
  // Leaderboard methods
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .filter(user => user.privacySettings?.showInLeaderboard !== false)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
  
  // Helper methods
  private async checkWorkoutAchievements(userId: number): Promise<void> {
    const workouts = await this.getWorkoutsByUserId(userId);
    
    // Check "Alpha Consistency" achievement (5 workouts in a row - simplified)
    if (workouts.length >= 5) {
      const consistencyAchievement = Array.from(this.achievements.values()).find(
        a => a.name === "Alpha Consistency"
      );
      
      if (consistencyAchievement) {
        await this.unlockAchievement(userId, consistencyAchievement.id);
      }
    }
    
    // Check "Power Surge" achievement (10000 calories in a month - simplified with progress)
    const caloriesAchievement = Array.from(this.achievements.values()).find(
      a => a.name === "Power Surge"
    );
    
    if (caloriesAchievement) {
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
      const progress = Math.min(Math.round((totalCalories / 10000) * 100), 100);
      
      await this.updateAchievementProgress(userId, caloriesAchievement.id, progress);
    }
  }
  
  private async initializeAchievements(): Promise<void> {
    const achievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
        name: "Alpha Consistency",
        description: "Complete workouts 5 days in a row",
        criteria: "5 consecutive days of workouts",
        icon: "award",
        color: "amber"
      },
      {
        id: this.currentAchievementId++,
        name: "Power Surge",
        description: "Burn 10,000 calories in a month",
        criteria: "10000 calories burned",
        icon: "zap",
        color: "blue"
      },
      {
        id: this.currentAchievementId++,
        name: "Pack Leader",
        description: "Invite 5 friends to join your pack",
        criteria: "5 friends invited",
        icon: "users",
        color: "slate"
      }
    ];
    
    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }
  
  private async initializeChallenges(): Promise<void> {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    
    const thirtyDaysLater = new Date(threeDaysLater);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    const challenges: Challenge[] = [
      {
        id: this.currentChallengeId++,
        name: "30-Day Strength Builder",
        description: "Build strength and transform your body with our 30-day progressive program designed for all fitness levels.",
        startDate: threeDaysLater,
        endDate: thirtyDaysLater,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        type: "solo",
        criteria: "Complete 30 strength workouts"
      },
      {
        id: this.currentChallengeId++,
        name: "Alpha Cardio Challenge",
        description: "Push your limits with high-intensity cardio sessions designed to improve endurance and burn maximum calories.",
        startDate: now,
        endDate: thirtyDaysLater,
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
        type: "featured",
        criteria: "Complete 20 cardio workouts"
      },
      {
        id: this.currentChallengeId++,
        name: "Pack Relay Competition",
        description: "Join with your pack to compete in our community-wide relay challenge. Earn points together and rise up the leaderboard.",
        startDate: now,
        endDate: thirtyDaysLater,
        image: "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7",
        type: "team",
        criteria: "Collectively complete 100 workouts"
      }
    ];
    
    challenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }
}

export const storage = new MemStorage();
