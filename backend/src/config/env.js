import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/academic_validator",
  jwtSecret: process.env.JWT_SECRET || "supersecurejwtsecretkey",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || path.join(path.dirname(path.dirname(__dirname)), "uploads")
};
