import { Notification } from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
}
