import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get("/", authorizeRoles(["student"]), getNotifications);
router.patch("/:id/read", authorizeRoles(["student"]), markAsRead);
router.post("/read-all", authorizeRoles(["student"]), markAllAsRead);

export default router;
