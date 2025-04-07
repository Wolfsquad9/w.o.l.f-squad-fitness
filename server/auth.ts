import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Use a stable secret for the session
  const SESSION_SECRET = process.env.SESSION_SECRET || "wolf-squad-dev-secret-1234567890";
  console.log("Using session secret:", SESSION_SECRET.substring(0, 5) + "...");

  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: storage.sessionStore,
    cookie: {
      secure: false, // We're setting this to false for development
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: "lax"
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Debug middleware to log session and auth status
  app.use((req, res, next) => {
    if (req.path !== '/favicon.ico') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      console.log(`  Session ID: ${req.sessionID}`);
      console.log(`  Authenticated: ${req.isAuthenticated()}`);
      if (req.isAuthenticated() && req.user) {
        console.log(`  User: ${(req.user as SelectUser).username} (ID: ${(req.user as SelectUser).id})`);
      }
    }
    next();
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log(`Authenticating user: ${username}`);
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log(`Authentication failed: User ${username} not found`);
          return done(null, false, { message: "Incorrect username." });
        }
        
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
          console.log(`Authentication failed: Invalid password for ${username}`);
          return done(null, false, { message: "Incorrect password." });
        }
        
        console.log(`Authentication successful for ${username}`);
        return done(null, user);
      } catch (error) {
        console.error(`Authentication error for ${username}:`, error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${(user as SelectUser).username} (${(user as SelectUser).id})`);
    done(null, (user as SelectUser).id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    console.log(`Deserializing user ID: ${id}`);
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.log(`Deserialization failed: User ID ${id} not found`);
        return done(null, false);
      }
      console.log(`Deserialization successful for ${user.username}`);
      done(null, user);
    } catch (error) {
      console.error(`Deserialization error for user ID ${id}:`, error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    console.log("Register attempt for user:", req.body.username);
    
    try {
      // Add basic validation
      if (!req.body.username || !req.body.password || !req.body.email) {
        console.log("Registration failed: Missing required fields");
        return res.status(400).json({ message: "Username, password and email are required" });
      }
      
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log(`Registration failed: Username ${req.body.username} already exists`);
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(req.body.password);
      console.log(`Creating new user: ${req.body.username}`);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Log the user in automatically
      req.login(user, (err) => {
        if (err) {
          console.error(`Registration session error for user: ${req.body.username}`, err);
          return next(err);
        }
        
        console.log(`Registration successful for user: ${user.username} (ID: ${user.id})`);
        console.log(`Session established: ${req.sessionID}`);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error(`Registration error:`, error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt for user:", req.body.username);
    
    // Add basic validation
    if (!req.body.username || !req.body.password) {
      console.log("Login failed: Missing credentials");
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log(`Login failed for user: ${req.body.username} - Invalid credentials`);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error(`Login session error for user: ${req.body.username}`, loginErr);
          return next(loginErr);
        }
        
        console.log(`Login successful for user: ${user.username} (ID: ${user.id})`);
        console.log(`Session established: ${req.sessionID}`);
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user as SelectUser;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    const username = req.user ? (req.user as SelectUser).username : "Unknown";
    console.log(`Logout attempt for user: ${username}`);
    
    req.logout((err) => {
      if (err) {
        console.error(`Logout error for user ${username}:`, err);
        return next(err);
      }
      console.log(`Logout successful for user: ${username}`);
      req.session.destroy((err) => {
        if (err) {
          console.error(`Session destruction error for user ${username}:`, err);
          return next(err);
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout successful" });
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.log("Unauthorized access to /api/user - no valid session");
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    console.log(`User data requested for ${userWithoutPassword.username}`);
    res.status(200).json(userWithoutPassword);
  });
}
