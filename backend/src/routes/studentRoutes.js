import express from "express";
import {
  upsertStudentRecordController,
  getMyRecordController,
  getStudentRecordController,
  listStudentRecordsController,
  listStudentUsersController
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/me", authorizeRoles(["student"]), getMyRecordController);
router.get("/users", authorizeRoles(["admin", "faculty"]), listStudentUsersController);
router.get("/", authorizeRoles(["admin", "faculty"]), listStudentRecordsController);
router.get("/:id", authorizeRoles(["admin", "faculty"]), getStudentRecordController);
router.post("/", authorizeRoles(["admin", "faculty"]), upsertStudentRecordController);

export default router;

