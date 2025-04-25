import mongoose from "mongoose";
import User from "../models/userModel.js";

const resetIndexes = async () => {
  try {
    // Drop all indexes from the users collection
    await User.collection.dropIndexes();
    console.log('Dropped all indexes');
    
    // Recreate only the necessary indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created new indexes');
  } catch (error) {
    console.error('Error resetting indexes:', error);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Reset indexes after connection
    await resetIndexes();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;