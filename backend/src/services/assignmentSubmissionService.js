import fs from "fs";
import path from "path";
import { AssignmentSubmission } from "../models/AssignmentSubmission.js";
import { AssignmentValidationLog } from "../models/AssignmentValidationLog.js";
import { ensureStudentAssigned, getAssignmentById } from "./assignmentService.js";
import { extractTextAndWordCount } from "./pdfService.js";
import { validateAssignmentSubmission } from "../ruleEngine/assignmentValidator.js";
import { env } from "../config/env.js";

function buildValidationResult(status, failures) {
  if (status === "COMPLETED") {
    return "All checks passed.";
  }
  if (Array.isArray(failures) && failures.length > 0) {
    return failures.map((f) => f.message).join(" ");
  }
  return "Validation failed.";
}

export async function submitAssignment(studentId, assignmentId, filePath, fileSizeBytes, fileMimeType) {
  const assignment = await ensureStudentAssigned(assignmentId, studentId);

  const existing = await AssignmentSubmission.findOne({ assignmentId, studentId });
  if (existing) {
    throw new Error("You have already submitted this assignment. Duplicate submissions are not allowed.");
  }

  const fullAssignment = await getAssignmentById(assignmentId);
  const submissionTime = new Date();

  let wordCount = null;
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(env.uploadDir, filePath);
  try {
    const extracted = await extractTextAndWordCount(absolutePath);
    wordCount = extracted.wordCount;
  } catch (err) {
    const failureReasons = [{ ruleKey: "pdfExtract", message: "Could not extract text from PDF." }];
    const validationResult = buildValidationResult("REJECTED", failureReasons);
    const submission = await AssignmentSubmission.create({
      assignmentId,
      studentId,
      filePath,
      submissionTime,
      validationStatus: "REJECTED",
      validationResult,
      failureReasons,
      extractedWordCount: null
    });
    await AssignmentValidationLog.create({
      studentId,
      assignmentId,
      appliedRules: fullAssignment.ruleConfig,
      result: "REJECTED",
      failures: failureReasons,
      timestamp: submissionTime
    });
    return submission;
  }

  const submissionContext = {
    fileMimeType,
    fileSizeBytes,
    submissionTime,
    wordCount,
    dueDateTime: assignment.dueDateTime
  };

  const assignmentRules = {
    ruleConfig: { ...fullAssignment.ruleConfig.toObject(), dueDateTime: assignment.dueDateTime }
  };

  const validation = validateAssignmentSubmission({
    assignmentRules: assignmentRules.ruleConfig,
    submissionContext
  });

  const validationResult = buildValidationResult(validation.status, validation.failures);

  const submission = await AssignmentSubmission.create({
    assignmentId,
    studentId,
    filePath,
    submissionTime,
    validationStatus: validation.status,
    validationResult,
    failureReasons: validation.failures,
    extractedWordCount: wordCount
  });

  await AssignmentValidationLog.create({
    studentId,
    assignmentId,
    appliedRules: fullAssignment.ruleConfig,
    result: validation.status,
    failures: validation.failures,
    timestamp: submissionTime
  });

  return submission;
}

export async function getSubmissionsByAssignment(assignmentId, facultyId) {
  const assignment = await getAssignmentById(assignmentId);
  if (assignment.facultyId._id.toString() !== facultyId.toString()) {
    throw new Error("Access denied to this assignment");
  }
  return AssignmentSubmission.find({ assignmentId })
    .populate("studentId", "name email")
    .sort({ submissionTime: -1 });
}

export async function getSubmissionsByStudent(studentId) {
  return AssignmentSubmission.find({ studentId })
    .populate("assignmentId", "title dueDateTime")
    .sort({ submissionTime: -1 });
}

export async function getSubmissionById(submissionId, studentIdOrFacultyId, isFaculty) {
  const submission = await AssignmentSubmission.findById(submissionId)
    .populate("assignmentId")
    .populate("studentId", "name email");
  if (!submission) {
    throw new Error("Submission not found");
  }
  if (isFaculty) {
    if (submission.assignmentId.facultyId.toString() !== studentIdOrFacultyId.toString()) {
      throw new Error("Access denied");
    }
  } else {
    if (submission.studentId._id.toString() !== studentIdOrFacultyId.toString()) {
      throw new Error("Access denied");
    }
  }
  return submission;
}
