import mongoose from "mongoose";

const failureSchema = new mongoose.Schema(
  {
    ruleKey: { type: String, required: true },
    message: { type: String, required: true }
  },
  { _id: false }
);

const validationLogSchema = new mongoose.Schema(
  {
    studentUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: String, required: true, trim: true },
    rule: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicRule", required: true },
    result: { type: String, enum: ["VALID", "INVALID"], required: true },
    failures: [failureSchema],
    validator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

validationLogSchema.index({ studentUser: 1, createdAt: -1 });

export const ValidationLog = mongoose.model("ValidationLog", validationLogSchema);

