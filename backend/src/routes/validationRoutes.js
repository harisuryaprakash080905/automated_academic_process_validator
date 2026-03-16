import express from "express";
import { validateStudentController } from "../controllers/validationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles(["admin", "faculty"]),
  validateStudentController
);

export default router;

