import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateMany({ role: 'Customer' }, { role: 'user' });
    console.log(`Updated ${result.modifiedCount} users from role "Customer" to "user".`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateRole();
