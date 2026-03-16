import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    credits: { type: Number, required: true, min: 0 },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const studentAcademicRecordSchema = new mongoose.Schema(
  {
    studentUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: String, required: true, trim: true },
    attendancePercentage: { type: Number, required: true, min: 0, max: 100 },
    totalCredits: { type: Number, required: true, min: 0 },
    subjects: [subjectSchema]
  },
  { timestamps: true }
);

studentAcademicRecordSchema.index({ studentUser: 1 }, { unique: true });

export const StudentAcademicRecord = mongoose.model(
  "StudentAcademicRecord",
  studentAcademicRecordSchema
);

