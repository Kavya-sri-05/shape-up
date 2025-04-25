import Medication from '../models/MedicationModel.js';
import asyncHandler from 'express-async-handler';

/**
 * Get all medications for a user
 * @route GET /api/user/medications
 * @access Private
 */
export const getAllMedications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('Getting medications for user:', userId);

  const medications = await Medication.find({ userId })
    .sort({ active: -1, name: 1 })
    .lean();

  console.log('Found medications:', medications);
  res.json({
    success: true,
    data: medications
  });
});

/**
 * Create a new medication
 * @route POST /api/user/medications
 * @access Private
 */
export const createMedication = asyncHandler(async (req, res) => {
  const { name, dosage, frequency, time, startDate, endDate, notes, active } = req.body;
  const userId = req.user._id;

  const medication = await Medication.create({
    userId,
    name,
    dosage,
    frequency,
    time,
    startDate,
    endDate,
    notes,
    active
  });

  res.status(201).json({
    success: true,
    data: medication
  });
});

/**
 * Get a single medication
 * @route GET /api/user/medications/:id
 * @access Private
 */
export const getMedication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const medicationId = req.params.id;

  const medication = await Medication.findOne({
    _id: medicationId,
    userId
  }).lean();

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  res.json({
    success: true,
    data: medication
  });
});

/**
 * Update a medication
 * @route PUT /api/user/medications/:id
 * @access Private
 */
export const updateMedication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const medicationId = req.params.id;
  const updates = req.body;

  const medication = await Medication.findOneAndUpdate(
    {
      _id: medicationId,
      userId
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  res.json({
    success: true,
    data: medication
  });
});

/**
 * Delete a medication
 * @route DELETE /api/user/medications/:id
 * @access Private
 */
export const deleteMedication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const medicationId = req.params.id;

  const medication = await Medication.findOneAndDelete({
    _id: medicationId,
    userId
  });

  if (!medication) {
    res.status(404);
    throw new Error('Medication not found');
  }

  res.json({
    success: true,
    data: {}
  });
}); 