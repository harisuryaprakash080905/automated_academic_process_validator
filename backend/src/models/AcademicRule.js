import mongoose from "mongoose";

const attendanceRuleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    minPercentage: { type: Number, required: true, min: 0, max: 100 }
  },
  { _id: false }
);

const subjectRuleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    minMarksPerSubject: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const creditRuleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    minTotalCredits: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const prerequisiteRuleSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    requiredSubjects: [{ type: String, trim: true }]
  },
  { _id: false }
);

const academicRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    attendanceRule: attendanceRuleSchema,
    subjectRule: subjectRuleSchema,
    creditRule: creditRuleSchema,
    prerequisiteRule: prerequisiteRuleSchema,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AcademicRule = mongoose.model("AcademicRule", academicRuleSchema);
