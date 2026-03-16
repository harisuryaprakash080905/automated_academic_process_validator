import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationsDropdown from "./NotificationsDropdown.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case "admin":
        return [{ to: "/admin", label: "Dashboard" }];
      case "faculty":
        return [
          { to: "/faculty", label: "Dashboard" },
          { to: "/faculty/assignments", label: "Assignments" },
        ];
      case "student":
        return [
          { to: "/student", label: "Dashboard" },
          { to: "/student/assignments", label: "Assignments" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3 transition-default">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-extrabold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary-500/30 group-hover:scale-105">
              AV
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-wide text-slate-900">
                Academic Validator
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                Automated Process Engine
              </p>
            </div>
          </Link>

          {/* Center nav links */}
          {user && navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                <NotificationsDropdown />
                <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-400 text-[10px] font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs px-4 py-2"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-7xl px-6 py-8 animate-fade-in">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 bg-white/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-[11px] text-slate-400">
            © 2026 Academic Validator — Automated Process Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
