import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc        Auth user/set token
// route        POST /api/users/auth
// @access      Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide both email and password');
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(401);
    throw new Error(error.message || "Authentication failed");
  }
});

// @desc        Register a new user
// route        POST /api/users
// @access      Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, and password');
  }

  try {
    // Check for existing user with case-insensitive email
    const userExists = await User.findOne({ 
      email: { $regex: new RegExp('^' + email + '$', 'i') } 
    });

    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (error) {
    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(messages.join('. '));
    }

    res.status(500);
    throw new Error('Server error during registration');
  }
});

// @desc        Logout user
// route        POST /api/users/logout
// @access      Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ 
    success: true,
    message: "Successfully logged out" 
  });
});

// @desc        Get user profile
// route        GET /api/users/profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Error retrieving user profile');
  }
});

// @desc        Update user profile
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Only update fields that were actually passed
    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.email) user.email = req.body.email.toLowerCase();
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Email address is already in use');
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(messages.join('. '));
    }

    res.status(500);
    throw new Error('Error updating profile');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
