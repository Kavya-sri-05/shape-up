import asyncHandler from 'express-async-handler';
import { sendEmail, createMedicationReminderEmail, createMedicationExpiryEmail, createMealPlanReminderEmail } from '../utils/emailService.js';
import User from '../models/userModel.js';

// @desc    Send medication reminder
// @route   POST /api/notifications/medication-reminder
// @access  Private
export const sendMedicationReminder = asyncHandler(async (req, res) => {
  const { medication, type, daysUntilExpiry } = req.body;
  const userId = req.user._id;

  console.log('Sending medication reminder:', { medication, type, daysUntilExpiry });

  // Validate request body
  if (!medication || !type) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  // Get user's email
  const user = await User.findById(userId).select('email name');
  if (!user || !user.email) {
    res.status(404);
    throw new Error('User email not found');
  }

  console.log('Found user:', user);

  try {
    let emailContent;
    if (type === 'reminder') {
      emailContent = createMedicationReminderEmail(medication);
    } else if (type === 'expiry') {
      if (typeof daysUntilExpiry !== 'number') {
        res.status(400);
        throw new Error('Days until expiry is required for expiry notifications');
      }
      emailContent = createMedicationExpiryEmail(medication, daysUntilExpiry);
    } else {
      res.status(400);
      throw new Error('Invalid notification type');
    }

    console.log('Attempting to send email with content:', emailContent);

    const emailSent = await sendEmail(user.email, emailContent.subject, emailContent.html);

    if (emailSent) {
      res.json({ 
        success: true,
        message: 'Email notification sent successfully',
        details: {
          email: user.email,
          type,
          medicationName: medication.name
        }
      });
    } else {
      throw new Error('Failed to send email notification');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error(error.message || 'Failed to send email notification');
  }
});

// @desc    Send meal plan reminder
// @route   POST /api/notifications/meal-reminder
// @access  Private
export const sendMealReminder = asyncHandler(async (req, res) => {
  const { mealName, mealContent } = req.body;
  const userId = req.user._id;

  console.log('Sending meal reminder:', { mealName, mealContent });

  // Validate request body
  if (!mealName || !mealContent) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  // Get user's email
  const user = await User.findById(userId).select('email name');
  if (!user || !user.email) {
    res.status(404);
    throw new Error('User email not found');
  }

  console.log('Found user:', user);

  try {
    const emailContent = createMealPlanReminderEmail(mealName, mealContent);
    console.log('Attempting to send email with content:', emailContent);

    const emailSent = await sendEmail(user.email, emailContent.subject, emailContent.html);

    if (emailSent) {
      res.json({ 
        success: true,
        message: 'Email notification sent successfully',
        details: {
          email: user.email,
          mealName
        }
      });
    } else {
      throw new Error('Failed to send email notification');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error(error.message || 'Failed to send email notification');
  }
}); 