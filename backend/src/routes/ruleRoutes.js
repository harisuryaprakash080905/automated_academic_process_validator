import express from "express";
import {
  createRuleController,
  updateRuleController,
  deleteRuleController,
  listRulesController,
  getRuleController
} from "../controllers/ruleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Faculty may list/get rules for validation dropdown; only admin may create/update/delete
router.get("/", protect, authorizeRoles(["admin", "faculty"]), listRulesController);
router.get("/:id", protect, authorizeRoles(["admin", "faculty"]), getRuleController);
router.post("/", protect, authorizeRoles(["admin"]), createRuleController);
router.put("/:id", protect, authorizeRoles(["admin"]), updateRuleController);
router.delete("/:id", protect, authorizeRoles(["admin"]), deleteRuleController);

export default router;

