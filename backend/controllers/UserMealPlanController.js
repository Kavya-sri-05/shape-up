import MealPlan from "../models/UserMealPlanModel.js";
import { isValidObjectId } from "mongoose";

/**
 * Creates a new user meal plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const createUserMealPlan = async (req, res) => {
  try {
    const { userId, date, meal1, meal2, meal3, meal4, meal5, snacks } = req.body;

    // Validate userId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

    // Validate date
    const mealDate = new Date(date);
    if (isNaN(mealDate)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format" 
      });
    }

    const newMealPlan = new MealPlan({
      userId,
      date: mealDate,
      meal1,
      meal2,
      meal3,
      meal4,
      meal5,
      snacks
    });

    await newMealPlan.save();

    res.status(201).json({
      success: true,
      data: newMealPlan
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A meal plan already exists for this user on this date"
      });
    }

    console.error('Error creating meal plan:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Retrieves a user meal plan for a specific date
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getUserMealPlan = async (req, res) => {
  try {
    const { userId, date } = req.query;

    // Validate userId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

    // Validate date
    const queryDate = new Date(date);
    if (isNaN(queryDate)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format" 
      });
    }

    // Use lean() for better performance since we don't need mongoose document methods
    const mealPlan = await MealPlan.findOne({ 
      userId, 
      date: queryDate 
    }).lean();

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found"
      });
    }

    res.status(200).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error('Error retrieving meal plan:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Updates an existing user meal plan or creates a new one
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const updateUserMealPlan = async (req, res) => {
  try {
    const { userId, date, meal1, meal2, meal3, meal4, meal5, snacks } = req.body;

    // Validate userId
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID format" 
      });
    }

    // Validate date
    const updateDate = new Date(date);
    if (isNaN(updateDate)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format" 
      });
    }

    const update = {
      userId,
      date: updateDate,
      ...(meal1 !== undefined && { meal1 }),
      ...(meal2 !== undefined && { meal2 }),
      ...(meal3 !== undefined && { meal3 }),
      ...(meal4 !== undefined && { meal4 }),
      ...(meal5 !== undefined && { meal5 }),
      ...(snacks !== undefined && { snacks })
    };

    const options = { 
      new: true,          // Return updated document
      upsert: true,       // Create if doesn't exist
      runValidators: true // Run schema validators on update
    };

    const mealPlan = await MealPlan.findOneAndUpdate(
      { userId, date: updateDate },
      update,
      options
    );

    const statusCode = mealPlan.isNew ? 201 : 200;
    res.status(statusCode).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    console.error('Error updating meal plan:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
