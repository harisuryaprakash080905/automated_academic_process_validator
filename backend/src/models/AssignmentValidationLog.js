import mongoose from "mongoose";

const failureLogSchema = new mongoose.Schema(
  {
    ruleKey: { type: String, required: true },
    message: { type: String, required: true }
  },
  { _id: false }
);

const assignmentValidationLogSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    appliedRules: { type: mongoose.Schema.Types.Mixed },
    result: { type: String, enum: ["COMPLETED", "REJECTED"], required: true },
    failures: [failureLogSchema],
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

assignmentValidationLogSchema.index({ assignmentId: 1, timestamp: -1 });
assignmentValidationLogSchema.index({ studentId: 1, timestamp: -1 });

export const AssignmentValidationLog = mongoose.model(
  "AssignmentValidationLog",
  assignmentValidationLogSchema
);
