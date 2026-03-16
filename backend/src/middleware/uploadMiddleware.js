import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const assignmentsDir = path.join(env.uploadDir, "assignments");

if (!fs.existsSync(env.uploadDir)) {
  fs.mkdirSync(env.uploadDir, { recursive: true });
}
if (!fs.existsSync(assignmentsDir)) {
  fs.mkdirSync(assignmentsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, assignmentsDir);
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.pdf`;
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = "application/pdf";
  const isPdf = file.mimetype === allowed || file.originalname.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const uploadAssignmentPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
}).single("file");
