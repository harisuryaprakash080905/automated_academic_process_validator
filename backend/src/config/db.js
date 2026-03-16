import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri, {
      autoIndex: true
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}
