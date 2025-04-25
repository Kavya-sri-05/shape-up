import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getAllUserMealPlans,
  createUserMealPlan,
  getUserMealPlan,
  updateUserMealPlan
} from "../controllers/UserMealPlanController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/user/meal-plans - Get all meal plans for a user
router.get("/meal-plans", getAllUserMealPlans);

// POST /api/user/meal-plan - Create a new meal plan
router.post("/meal-plan", createUserMealPlan);

// GET /api/user/meal-plan/:date - Get a specific meal plan by date
router.get("/meal-plan/:date", getUserMealPlan);

// PUT /api/user/meal-plan - Update a meal plan
router.put("/meal-plan", updateUserMealPlan);

export default router;
