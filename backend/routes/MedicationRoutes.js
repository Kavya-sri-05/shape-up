import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllMedications,
  createMedication,
  getMedication,
  updateMedication,
  deleteMedication
} from '../controllers/MedicationController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// GET /api/user/medications - Get all medications
router.get('/medications', getAllMedications);

// POST /api/user/medications - Create a new medication
router.post('/medications', createMedication);

// GET /api/user/medications/:id - Get a specific medication
router.get('/medications/:id', getMedication);

// PUT /api/user/medications/:id - Update a medication
router.put('/medications/:id', updateMedication);

// DELETE /api/user/medications/:id - Delete a medication
router.delete('/medications/:id', deleteMedication);

export default router; 