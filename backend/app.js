import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

// Log environment variables (excluding sensitive data)
console.log('Environment Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set'
});

const port = process.env.PORT || 5123;
import userRoutes from "./routes/userRoutes.js";
import userStatusRoutes from "./routes/userStatusRoutes.js";
import userMealPlanRoutes from "./routes/UserMealPlanRoutes.js";
import medicationRoutes from "./routes/MedicationRoutes.js";
import notificationRoutes from './routes/NotificationRoutes.js';

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/user/status", userStatusRoutes);
app.use("/api/user", userMealPlanRoutes); // This handles both /meal-plan and /meal-plans endpoints
app.use("/api/user", medicationRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "frontend/build")));
  
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => res.send("Server is ready"));
  }

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log('Available routes:');
  console.log('- /api/users/*');
  console.log('- /api/user/status');
  console.log('- /api/user/meal-plans');
  console.log('- /api/user/meal-plan');
  console.log('- /api/user/medications');
  console.log('- /api/notifications');
});

export default app;