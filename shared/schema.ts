import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  level: integer("level").default(1),
  points: integer("points").default(0),
  role: text("role").default("member"),
  qrCode: text("qr_code"),
  profilePicture: text("profile_picture"),
  privacySettings: json("privacy_settings").$type<{
    shareWorkouts: boolean;
    shareAchievements: boolean;
    showInLeaderboard: boolean;
  }>().default({
    shareWorkouts: true,
    shareAchievements: true,
    showInLeaderboard: true,
  }),
});

export const apparel = pgTable("apparel", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  qrCode: text("qr_code").notNull().unique(),
  dateAdded: timestamp("date_added").defaultNow(),
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  totalWorkoutDuration: integer("total_workout_duration").default(0), // in minutes
  totalCaloriesBurned: integer("total_calories_burned").default(0),
  averageWorkoutDuration: integer("average_workout_duration").default(0), // in minutes
  performanceRating: integer("performance_rating").default(0), // 0-100 scale
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  apparelId: integer("apparel_id").references(() => apparel.id),
  type: text("type").notNull(),
  duration: integer("duration").notNull(), // in minutes
  calories: integer("calories"),
  date: timestamp("date").defaultNow(),
  progress: integer("progress"), // percentage
  notes: text("notes"),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  criteria: text("criteria").notNull(), // e.g., "Complete 5 workouts in a row"
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  dateEarned: timestamp("date_earned").defaultNow(),
  progress: integer("progress").default(0), // percentage
  completed: boolean("completed").default(false),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  image: text("image"),
  type: text("type").notNull(), // e.g., solo, team, etc.
  criteria: text("criteria").notNull(), // what needs to be completed
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  dateJoined: timestamp("date_joined").defaultNow(),
  progress: integer("progress").default(0), // percentage
  completed: boolean("completed").default(false),
});

export const integratedApps = pgTable("integrated_apps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  appName: text("app_name").notNull(), // e.g., Strava, Apple Health
  connected: boolean("connected").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  lastSynced: timestamp("last_synced"),
});

// Insert schemas for forms
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export const insertApparelSchema = createInsertSchema(apparel).pick({
  name: true,
  type: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  type: true,
  duration: true,
  calories: true,
  notes: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const updatePrivacySettingsSchema = z.object({
  shareWorkouts: z.boolean(),
  shareAchievements: z.boolean(),
  showInLeaderboard: z.boolean(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertApparel = z.infer<typeof insertApparelSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type Apparel = typeof apparel.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type IntegratedApp = typeof integratedApps.$inferSelect;
export type PrivacySettings = z.infer<typeof updatePrivacySettingsSchema>;

// Workout Recommendation schemas
export const workoutTypes = [
  "strength",
  "cardio",
  "flexibility",
  "hiit",
  "endurance",
  "recovery",
  "balance"
] as const;

export const fitnessGoals = [
  "weight_loss",
  "muscle_gain",
  "endurance",
  "flexibility",
  "general_fitness",
  "recovery",
  "strength"
] as const;

export const userPreferencesSchema = z.object({
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  workoutPreference: z.enum(workoutTypes),
  fitnessGoal: z.enum(fitnessGoals),
  workoutDuration: z.number().min(5).max(120), // in minutes
  workoutFrequency: z.number().min(1).max(7), // days per week
  equipment: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional()
});

export const workoutRecommendationSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string(),
  description: z.string(),
  type: z.enum(workoutTypes),
  duration: z.number(), // in minutes
  caloriesBurn: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number().optional(),
    reps: z.number().optional(),
    duration: z.number().optional(), // in seconds
    restPeriod: z.number().optional(), // in seconds
    instruction: z.string().optional()
  })),
  recommendedApparel: z.array(z.number().int()).optional(), // apparelIds
  createdAt: z.date().optional(),
  isCompleted: z.boolean().default(false)
});

export const insertUserPreferencesSchema = userPreferencesSchema;
export const insertWorkoutRecommendationSchema = workoutRecommendationSchema.omit({ id: true, createdAt: true });

export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type WorkoutRecommendation = z.infer<typeof workoutRecommendationSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertWorkoutRecommendation = z.infer<typeof insertWorkoutRecommendationSchema>;
