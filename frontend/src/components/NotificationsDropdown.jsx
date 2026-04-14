import React, { useState, useEffect, useRef } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    if (user && user.role === "student") {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  if (!user || user.role !== "student") return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 hover:shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-400 text-[10px] font-bold text-white shadow-sm shadow-red-500/30 animate-pulse-soft">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-elevated z-50 overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`relative border-b border-slate-100 px-4 py-3 transition-all duration-150 cursor-pointer ${notif.isRead
                    ? "bg-white opacity-70 hover:opacity-100"
                    : "bg-primary-50/30 hover:bg-primary-50/50"
                    }`}
                  onClick={() => {
                    if (!notif.isRead) markAsRead(notif._id, { stopPropagation: () => { } });
                  }}
                >
                  <div className="pr-6">
                    <div className="flex items-center gap-2">
                      {!notif.isRead && <span className="dot-success flex-shrink-0" />}
                      <p className={`text-sm ${notif.isRead ? "text-slate-600" : "font-semibold text-slate-800"}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{notif.message}</p>
                    <p className="mt-2 text-[10px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleDateString()}{" "}
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={(e) => markAsRead(notif._id, e)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-primary-500 transition-colors hover:bg-primary-100"
                      title="Mark as read"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
