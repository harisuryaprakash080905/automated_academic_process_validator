import mongoose from "mongoose";

const customRuleSchema = new mongoose.Schema(
  {
    ruleKey: { type: String, required: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, trim: true }
  },
  { _id: false }
);

const ruleConfigSchema = new mongoose.Schema(
  {
    maxWordCount: { type: Number, required: true, min: 0 },
    minWordCount: { type: Number, min: 0 },
    allowedFileType: { type: String, default: "application/pdf", trim: true },
    maxFileSizeBytes: { type: Number, required: true, min: 0 },
    customRules: [customRuleSchema]
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDateTime: { type: Date, required: true },
    ruleConfig: { type: ruleConfigSchema, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

assignmentSchema.index({ facultyId: 1, createdAt: -1 });
assignmentSchema.index({ assignedStudents: 1 });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
