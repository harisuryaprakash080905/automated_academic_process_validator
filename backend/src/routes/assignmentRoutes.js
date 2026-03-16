import express from "express";
import {
  createAssignmentController,
  updateAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  listMyAssignmentsController
} from "../controllers/assignmentController.js";
import {
  submitAssignmentController,
  listSubmissionsForAssignmentController,
  listMySubmissionsController,
  getSubmissionController
} from "../controllers/assignmentSubmissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { uploadAssignmentPdf } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listMyAssignmentsController);

router.get("/my-submissions", listMySubmissionsController);

router.get("/submission/:id", getSubmissionController);

router.get("/:id", getAssignmentController);

router.post(
  "/",
  authorizeRoles(["faculty"]),
  createAssignmentController
);

router.put(
  "/:id",
  authorizeRoles(["faculty"]),
  updateAssignmentController
);

router.delete(
  "/:id",
  authorizeRoles(["faculty"]),
  deleteAssignmentController
);

router.get("/:assignmentId/submissions", authorizeRoles(["faculty"]), listSubmissionsForAssignmentController);

router.post(
  "/:assignmentId/submit",
  authorizeRoles(["student"]),
  uploadAssignmentPdf,
  submitAssignmentController
);

export default router;
