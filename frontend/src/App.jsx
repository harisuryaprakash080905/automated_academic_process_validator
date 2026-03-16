import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import FacultyAssignments from "./pages/FacultyAssignments.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentAssignments from "./pages/StudentAssignments.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="relative w-full max-w-xl animate-slide-up">
          {/* Background decoration */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary-200/30 blur-3xl animate-float" />
          <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-accent-200/30 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

          <div className="card-accent relative p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 text-xl font-extrabold text-white shadow-lg shadow-primary-500/30">
              AV
            </div>
            <h1 className="mb-3 text-2xl font-bold tracking-tight text-slate-900">
              Automated Academic
              <span className="gradient-text block">Process Validator</span>
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-slate-500">
              A rule-driven engine that evaluates student eligibility using configurable academic
              policies, centralized validation, and full audit logging.
            </p>
            <div className="flex items-center justify-center gap-3">
              <a href="/login" className="btn-secondary px-6 py-2.5 text-sm">
                Sign in
              </a>
              <a href="/register" className="btn-primary px-6 py-2.5 text-sm">
                Get started →
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Rule-based
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Real-time
              </div>
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Audit logs
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === "faculty") {
    return <Navigate to="/faculty" replace />;
  }
  if (user.role === "student") {
    return <Navigate to="/student" replace />;
  }
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={["faculty"]} />}>
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/assignments" element={<FacultyAssignments />} />
          </Route>
          <Route element={<ProtectedRoute roles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
