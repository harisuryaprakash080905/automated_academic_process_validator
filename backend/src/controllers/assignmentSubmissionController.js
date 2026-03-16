import path from "path";
import {
  submitAssignment,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  getSubmissionById
} from "../services/assignmentSubmissionService.js";
import { env } from "../config/env.js";

export async function submitAssignmentController(req, res, next) {
  try {
    if (!req.file || !req.file.path) {
      res.status(400);
      return next(new Error("No file uploaded"));
    }
    const assignmentId = req.params.assignmentId;
    const relativePath = path.relative(env.uploadDir, req.file.path);
    const submission = await submitAssignment(
      req.user._id,
      assignmentId,
      relativePath,
      req.file.size,
      req.file.mimetype
    );
    res.status(201).json(submission);
  } catch (error) {
    if (error.message && error.message.includes("already submitted")) {
      res.status(400);
    }
    next(error);
  }
}

export async function listSubmissionsForAssignmentController(req, res, next) {
  try {
    const list = await getSubmissionsByAssignment(req.params.assignmentId, req.user._id);
    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function listMySubmissionsController(req, res, next) {
  try {
    const list = await getSubmissionsByStudent(req.user._id);
    res.json(list);
  } catch (error) {
    next(error);
  }
}

export async function getSubmissionController(req, res, next) {
  try {
    const isFaculty = req.user.role === "faculty";
    const submission = await getSubmissionById(req.params.id, req.user._id, isFaculty);
    res.json(submission);
  } catch (error) {
    next(error);
  }
}
