import React, { useEffect, useState } from "react";
import api from "../api";

export default function StudentDashboard() {
  const [record, setRecord] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [recordRes, logsRes] = await Promise.all([
        api.get("/students/me"),
        api.get("/logs/me")
      ]);
      setRecord(recordRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load student data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── Page Header ── */}
      <div>
        <h1 className="section-title flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-sm text-white shadow-lg shadow-primary-500/25">
            📚
          </span>
          My Academic Profile
        </h1>
        <p className="section-subtitle mt-1">
          View the academic data used for automated validation and track eligibility outcomes.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
        {/* ── Academic record ── */}
        <div className="card p-6">
          <h3 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Academic Record
          </h3>
          {!record && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-400">
                No academic record is linked to your account yet. Contact your faculty to upload your data.
              </p>
            </div>
          )}
          {record && (
            <div className="space-y-4">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-500">Student ID</p>
                  <p className="mt-1 text-sm font-bold text-primary-700">{record.studentId}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">Attendance</p>
                  <p className="mt-1 text-sm font-bold text-emerald-700">{record.attendancePercentage}%</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-3 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-500">Credits</p>
                  <p className="mt-1 text-sm font-bold text-accent-600">{record.totalCredits}</p>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <p className="mb-2 text-xs font-bold text-slate-700">Subjects</p>
                <ul className="space-y-2">
                  {record.subjects.map((s, idx) => (
                    <li key={`${s.code}-${idx}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 transition-all hover:border-slate-300">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{s.code} • {s.name}</p>
                        <p className="text-[10px] text-slate-400">Marks {s.marks} • Credits {s.credits}</p>
                      </div>
                      {s.completed ? (
                        <span className="badge-success">✓ Done</span>
                      ) : (
                        <span className="badge-info">In progress</span>
                      )}
                    </li>
                  ))}
                  {record.subjects.length === 0 && (
                    <li className="text-xs text-slate-400">No subject entries yet.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── Validation history ── */}
        <div className="card p-0">
          <div className="max-h-[500px] overflow-y-auto p-6">
            <h3 className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Validation History
            </h3>
            {logs.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <p className="text-sm text-slate-400">No automated validations have been run for your profile yet.</p>
              </div>
            )}
            {logs.length > 0 && (
              <ul className="space-y-3">
                {logs.map((log) => (
                  <li key={log._id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-slate-300 animate-fade-in">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Rule: <span className="font-semibold text-slate-800">{log.rule?.name}</span>
                      </span>
                      {log.result === "VALID" ? (
                        <span className="badge-success">{log.result}</span>
                      ) : (
                        <span className="badge-danger">{log.result}</span>
                      )}
                    </div>
                    <p className="mb-2 text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                    {log.failures && log.failures.length > 0 && (
                      <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                        <p className="mb-1.5 text-[11px] font-bold text-red-600">Reasons for ineligibility</p>
                        <ul className="space-y-1">
                          {log.failures.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-red-600">
                              <span className="mt-1 dot-danger flex-shrink-0" />
                              <span>{f.message}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(!log.failures || log.failures.length === 0) && (
                      <p className="text-xs text-emerald-600 font-medium">
                        ✅ All active academic rules were satisfied.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
