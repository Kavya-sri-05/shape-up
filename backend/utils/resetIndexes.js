import mongoose from 'mongoose';
import config from '../config/db.js';
import User from '../models/userModel.js';

const resetIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop all indexes from the users collection
    await User.collection.dropIndexes();
    console.log('Dropped all indexes');

    // Create new indexes based on the schema
    await User.init();
    console.log('Created new indexes');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetIndexes(); 