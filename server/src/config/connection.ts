import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from server directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/techquiz";

console.log("Attempting to connect to:", MONGODB_URI); // Debug line

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected.");
    return mongoose.connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed.");
  }
};

export default db;
