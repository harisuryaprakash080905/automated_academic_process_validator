import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationsDropdown from "./NotificationsDropdown.jsx";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
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
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 transition-all duration-300 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md hover:shadow-primary-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Open navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>

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
          </div>

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
      {/* ── Hamburger Overlay Sidebar ── */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Blurred Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sliding Sidebar */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-400 ease-out flex flex-col border-r border-slate-200/50 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-sm font-extrabold text-white shadow-lg shadow-primary-500/25">
                AV
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-slate-900">Menu</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Sidebar User Profile Info */}
          {user && (
            <div className="bg-slate-50/50 p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 text-lg font-bold text-white shadow-inner">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="truncate text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">{user.role}</p>
                  <p className="truncate text-[11px] text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {navLinks.length > 0 ? (
              <nav className="space-y-1.5">
                <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Analytics & Ops</p>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-primary-50 text-primary-700 shadow-sm shadow-primary-500/5 ring-1 ring-primary-500/10"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary-500" : "bg-transparent"}`}></span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <div className="px-2 py-4">
                <p className="text-xs text-slate-400">Please sign in to access navigational tools.</p>
              </div>
            )}
          </div>

          {/* Sidebar Footer (Logout) */}
          <div className="p-5 border-t border-slate-100 bg-white">
            {user ? (
              <button
                onClick={handleLogout}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-secondary text-xs p-2 text-center" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="btn-primary text-xs p-2 text-center" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
