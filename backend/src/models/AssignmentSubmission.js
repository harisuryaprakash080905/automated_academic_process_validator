import mongoose from "mongoose";

const failureReasonSchema = new mongoose.Schema(
  {
    ruleKey: { type: String, required: true },
    message: { type: String, required: true }
  },
  { _id: false }
);

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filePath: { type: String, required: true, trim: true },
    submissionTime: { type: Date, default: Date.now },
    validationStatus: {
      type: String,
      enum: ["pending", "COMPLETED", "REJECTED"],
      required: true
    },
    validationResult: { type: String, trim: true },
    failureReasons: [failureReasonSchema],
    extractedWordCount: { type: Number }
  },
  { timestamps: true }
);

assignmentSubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
assignmentSubmissionSchema.index({ studentId: 1, createdAt: -1 });

export const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
