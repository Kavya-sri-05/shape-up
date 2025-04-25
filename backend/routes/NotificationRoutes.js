import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendMedicationReminder, sendMealReminder } from '../controllers/NotificationController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// POST /api/notifications/medication-reminder
router.post('/medication-reminder', sendMedicationReminder);

// POST /api/notifications/meal-reminder
router.post('/meal-reminder', sendMealReminder);

export default router; 