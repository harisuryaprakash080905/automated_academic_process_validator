import express from "express";
import { listLogsController, myLogsController } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me", protect, authorizeRoles(["student"]), myLogsController);
router.get("/", protect, authorizeRoles(["admin"]), listLogsController);

export default router;

