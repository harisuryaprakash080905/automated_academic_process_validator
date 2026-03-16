import React, { useEffect, useState } from "react";
import api from "../api";

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedStudentUserId, setSelectedStudentUserId] = useState("");
  const [selectedRuleId, setSelectedRuleId] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [recordForm, setRecordForm] = useState({
    studentUserId: "",
    studentId: "",
    attendancePercentage: 0,
    totalCredits: 0,
    subjects: []
  });
  const [subjectDraft, setSubjectDraft] = useState({
    code: "",
    name: "",
    marks: "",
    credits: "",
    completed: true
  });
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [studentsRes, rulesRes] = await Promise.all([
        api.get("/students"),
        api.get("/rules")
      ]);
      setStudents(studentsRes.data);
      setRules(rulesRes.data.filter((r) => r.isActive));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load faculty data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubject = () => {
    if (!subjectDraft.code || !subjectDraft.name) return;
    setRecordForm((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          code: subjectDraft.code.trim(),
          name: subjectDraft.name.trim(),
          marks: Number(subjectDraft.marks),
          credits: Number(subjectDraft.credits),
          completed: Boolean(subjectDraft.completed)
        }
      ]
    }));
    setSubjectDraft({ code: "", name: "", marks: "", credits: "", completed: true });
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/students", {
        ...recordForm,
        attendancePercentage: Number(recordForm.attendancePercentage),
        totalCredits: Number(recordForm.totalCredits)
      });
      setRecordForm({ studentUserId: "", studentId: "", attendancePercentage: 0, totalCredits: 0, subjects: [] });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save academic record");
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    setError("");
    setValidationResult(null);
    try {
      const res = await api.post("/validate", {
        studentUserId: selectedStudentUserId,
        ruleId: selectedRuleId
      });
      setValidationResult(res.data.validation);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Validation failed");
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── Page Header ── */}
      <div>
        <h1 className="section-title flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-sm text-white shadow-lg shadow-primary-500/25">
            🎓
          </span>
          Faculty Dashboard
        </h1>
        <p className="section-subtitle mt-1">
          Manage student records and run academic validations.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Student Academic Data
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Capture normalized student records to be validated against configured rules.
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
          {/* ── Create record form ── */}
          <form onSubmit={handleCreateRecord} className="card p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-800">📋 Create / Update record</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Student (user id)</label>
                <input
                  className="input"
                  placeholder="Paste student user id"
                  value={recordForm.studentUserId}
                  onChange={(e) => setRecordForm((prev) => ({ ...prev, studentUserId: e.target.value }))}
                  required
                />
                <p className="mt-1 text-[10px] text-slate-400">From user registration or admin user list.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Institutional student ID</label>
                <input
                  className="input"
                  value={recordForm.studentId}
                  onChange={(e) => setRecordForm((prev) => ({ ...prev, studentId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Attendance (%)</label>
                <input
                  type="number" min="0" max="100" className="input"
                  value={recordForm.attendancePercentage}
                  onChange={(e) => setRecordForm((prev) => ({ ...prev, attendancePercentage: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Total credits</label>
                <input
                  type="number" min="0" className="input"
                  value={recordForm.totalCredits}
                  onChange={(e) => setRecordForm((prev) => ({ ...prev, totalCredits: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Subjects */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="mb-3 text-xs font-bold text-slate-700">📚 Subjects</p>
              <div className="grid gap-2 sm:grid-cols-[1.5fr,2fr,1fr,1fr,auto]">
                <input className="input" placeholder="Code" value={subjectDraft.code} onChange={(e) => setSubjectDraft((prev) => ({ ...prev, code: e.target.value }))} />
                <input className="input" placeholder="Name" value={subjectDraft.name} onChange={(e) => setSubjectDraft((prev) => ({ ...prev, name: e.target.value }))} />
                <input type="number" className="input" placeholder="Marks" value={subjectDraft.marks} onChange={(e) => setSubjectDraft((prev) => ({ ...prev, marks: e.target.value }))} />
                <input type="number" className="input" placeholder="Credits" value={subjectDraft.credits} onChange={(e) => setSubjectDraft((prev) => ({ ...prev, credits: e.target.value }))} />
                <button type="button" className="btn-primary text-xs px-4 py-2" onClick={handleAddSubject}>
                  Add
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {recordForm.subjects.map((s, idx) => (
                  <div key={`${s.code}-${idx}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 animate-scale-in">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{s.code} • {s.name}</p>
                      <p className="text-[10px] text-slate-400">Marks {s.marks}, Credits {s.credits}</p>
                    </div>
                    <button type="button" className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors" onClick={() => setRecordForm((prev) => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== idx) }))}>
                      Remove
                    </button>
                  </div>
                ))}
                {recordForm.subjects.length === 0 && (
                  <p className="text-xs text-slate-400">No subjects added yet. Add at least one subject row.</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary text-xs px-6 py-2.5">Save academic record</button>
            </div>
          </form>

          {/* ── Right column ── */}
          <div className="space-y-5">
            {/* Trigger validation */}
            <div className="card p-6">
              <h3 className="mb-3 text-sm font-bold text-slate-800">⚡ Trigger validation</h3>
              <form onSubmit={handleValidate} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Student</label>
                  <select className="input" value={selectedStudentUserId} onChange={(e) => setSelectedStudentUserId(e.target.value)} required>
                    <option value="">Select student by email</option>
                    {students.map((rec) => (
                      <option key={rec._id} value={rec.studentUser?._id}>
                        {rec.studentUser?.email || rec.studentUser?.name || rec.studentId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Rule set</label>
                  <select className="input" value={selectedRuleId} onChange={(e) => setSelectedRuleId(e.target.value)} required>
                    <option value="">Select admin rule set</option>
                    {rules.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full text-xs">
                  Run validation
                </button>
              </form>

              {validationResult && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 animate-scale-in">
                  <p className="mb-2 text-xs font-bold text-slate-700">Result</p>
                  <div className="mb-2">
                    {validationResult.status === "VALID" ? (
                      <span className="badge-success text-xs">{validationResult.status}</span>
                    ) : (
                      <span className="badge-danger text-xs">{validationResult.status}</span>
                    )}
                  </div>
                  {validationResult.failures.length > 0 && (
                    <ul className="space-y-1.5">
                      {validationResult.failures.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-red-600">
                          <span className="mt-1 dot-danger flex-shrink-0" />
                          <span>{f.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {validationResult.failures.length === 0 && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ✅ All configured rules satisfied for this student.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Existing records */}
            <div className="card max-h-64 overflow-auto p-5">
              <h3 className="mb-3 text-sm font-bold text-slate-800">📂 Existing records</h3>
              {students.length === 0 && (
                <p className="text-xs text-slate-400">No academic records yet. Create one using the form.</p>
              )}
              <ul className="space-y-2">
                {students.map((rec) => (
                  <li key={rec._id} className="flex justify-between items-center rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition-all hover:border-slate-300">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {rec.studentUser?.name} <span className="text-slate-400 font-normal">({rec.studentId})</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Attendance {rec.attendancePercentage}% • Credits {rec.totalCredits}
                      </p>
                    </div>
                    <span className="badge-neutral">{rec.subjects?.length || 0} subjects</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
