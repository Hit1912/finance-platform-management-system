import mongoose from "mongoose";
import { Env } from "./env.config";

const connctDatabase = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Faster timeout for dev
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("WARNING: Could not connect to MongoDB. Database operations will fail.");
    console.error("Please ensure MongoDB is running or check your MONGO_URI in .env");
    // Removed process.exit(1) to keep the server running for UI testing
  }
};

export default connctDatabase;
