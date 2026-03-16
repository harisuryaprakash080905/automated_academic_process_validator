import React, { useEffect, useState } from "react";
import api from "../api";

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    assignedStudents: [],
    dueDate: "",
    dueTime: "",
    ruleConfig: {
      maxWordCount: 2000,
      minWordCount: 0,
      allowedFileType: "application/pdf",
      maxFileSizeBytes: 5 * 1024 * 1024,
      customRules: []
    }
  });

  const todayDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const buildDueDateTimeIso = (dueDate, dueTime) => {
    const isoLike = `${dueDate}T${dueTime}:00`;
    const dt = new Date(isoLike);
    if (Number.isNaN(dt.getTime())) return null;
    return dt.toISOString();
  };

  const loadAssignments = async () => {
    try {
      const res = await api.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assignments");
    }
  };

  const loadStudentUsers = async () => {
    try {
      const res = await api.get("/students/users");
      const users = Array.isArray(res.data) ? res.data : [];
      setStudentUsers(users.filter((u) => !u.role || String(u.role).toLowerCase() === "student"));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to load students";
      setError(msg);
      if (err.response?.status === 401) setStudentUsers([]);
    }
  };

  const loadSubmissions = async (assignmentId) => {
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions");
    }
  };

  useEffect(() => { loadAssignments(); }, []);
  useEffect(() => { if (showForm) loadStudentUsers(); }, [showForm]);
  useEffect(() => {
    if (selectedAssignmentId) loadSubmissions(selectedAssignmentId);
    else setSubmissions([]);
  }, [selectedAssignmentId]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!form.dueDate || !form.dueTime) { setError("Due date and time are required."); return; }
      const dueDateTimeIso = buildDueDateTimeIso(form.dueDate, form.dueTime);
      if (!dueDateTimeIso) { setError("Invalid due date/time."); return; }
      if (new Date(dueDateTimeIso).getTime() <= Date.now()) { setError("Due date must be in the future."); return; }
      if (!Array.isArray(form.assignedStudents) || form.assignedStudents.length === 0) { setError("Select at least one student."); return; }
      const maxWC = Number(form.ruleConfig.maxWordCount);
      const minWC = Number(form.ruleConfig.minWordCount || 0);
      if (Number.isNaN(maxWC) || maxWC < 0) { setError("Maximum word count must be valid."); return; }
      if (Number.isNaN(minWC) || minWC < 0) { setError("Minimum word count must be valid."); return; }
      if (maxWC <= minWC) { setError("Max word count must exceed min word count."); return; }

      await api.post("/assignments", {
        title: form.title,
        assignedStudents: form.assignedStudents,
        dueDateTime: dueDateTimeIso,
        ruleConfig: {
          maxWordCount: maxWC,
          minWordCount: minWC > 0 ? minWC : undefined,
          allowedFileType: "application/pdf",
          maxFileSizeBytes: Number(form.ruleConfig.maxFileSizeBytes),
          customRules: form.ruleConfig.customRules || []
        }
      });
      setForm({ title: "", assignedStudents: [], dueDate: "", dueTime: "", ruleConfig: { maxWordCount: 2000, minWordCount: 0, allowedFileType: "application/pdf", maxFileSizeBytes: 5 * 1024 * 1024, customRules: [] } });
      setShowForm(false);
      loadAssignments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
    }
  };

  const toggleStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedStudents: prev.assignedStudents.includes(id)
        ? prev.assignedStudents.filter((s) => s !== id)
        : [...prev.assignedStudents, id]
    }));
  };

  const selectedAssignment = assignments.find((a) => a._id === selectedAssignmentId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-sm text-white shadow-lg shadow-primary-500/25">
              📝
            </span>
            Assignments
          </h1>
          <p className="section-subtitle mt-1">
            Create assignments with rule-based evaluation and monitor submissions.
          </p>
        </div>
        <button
          type="button"
          className={showForm ? "btn-secondary text-xs" : "btn-primary text-xs"}
          onClick={() => { setError(""); setShowForm((v) => !v); }}
        >
          {showForm ? "Cancel" : "➕ Create Assignment"}
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      {/* ── Create form ── */}
      {showForm && (
        <form onSubmit={handleCreateAssignment} className="card p-6 space-y-5 animate-slide-down">
          <h3 className="text-sm font-bold text-slate-800">New assignment</h3>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">Assigned students</label>
            <div className="max-h-40 overflow-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3">
              {studentUsers.map((u) => (
                <label key={u._id} className="mb-1.5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-white">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    checked={form.assignedStudents.includes(u._id)}
                    onChange={() => toggleStudent(u._id)}
                  />
                  <span className="text-slate-700">{u.name} {u.email ? `(${u.email})` : ""}</span>
                </label>
              ))}
              {studentUsers.length === 0 && <p className="text-xs text-slate-400">No students found.</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Due date</label>
              <input type="date" className="input" min={todayDateString()} value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Due time</label>
              <input type="time" className="input" value={form.dueTime} onChange={(e) => setForm((prev) => ({ ...prev, dueTime: e.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Max word count</label>
              <input type="number" min="0" className="input" value={form.ruleConfig.maxWordCount} onChange={(e) => setForm((prev) => ({ ...prev, ruleConfig: { ...prev.ruleConfig, maxWordCount: e.target.value } }))} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Min word count</label>
              <input type="number" min="0" className="input" value={form.ruleConfig.minWordCount || ""} onChange={(e) => setForm((prev) => ({ ...prev, ruleConfig: { ...prev.ruleConfig, minWordCount: e.target.value || 0 } }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Allowed file type</label>
              <input type="text" className="input bg-slate-50" value="PDF only" readOnly />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Max file size (bytes)</label>
              <input type="number" min="1" className="input" value={form.ruleConfig.maxFileSizeBytes} onChange={(e) => setForm((prev) => ({ ...prev, ruleConfig: { ...prev.ruleConfig, maxFileSizeBytes: Number(e.target.value) } }))} required />
              <p className="mt-1 text-[10px] text-slate-400">e.g. 5242880 = 5 MB</p>
            </div>
          </div>
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <button type="submit" className="btn-primary text-xs">Create assignment</button>
            <button type="button" className="btn-secondary text-xs" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* ── Assignment list & monitoring ── */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)]">
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Your assignments</h3>
          {assignments.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-400">No assignments yet. Create one to get started.</p>
            </div>
          )}
          <ul className="space-y-2">
            {assignments.map((a) => (
              <li key={a._id}>
                <button
                  type="button"
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    selectedAssignmentId === a._id
                      ? "border-primary-400 bg-primary-50 shadow-sm shadow-primary-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedAssignmentId(a._id)}
                >
                  <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Due: {new Date(a.dueDateTime).toLocaleString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Submission monitoring</h3>
          {!selectedAssignment && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-400">Select an assignment to view submissions.</p>
            </div>
          )}
          {selectedAssignment && (
            <>
              <p className="mb-3 text-xs text-slate-500">
                Viewing: <span className="font-semibold text-slate-700">{selectedAssignment.title}</span>
              </p>
              {submissions.length === 0 && <p className="text-xs text-slate-400">No submissions yet.</p>}
              <div className="max-h-80 overflow-auto">
                <table className="table-modern">
                  <thead className="sticky top-0">
                    <tr>
                      <th>Student</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <p className="font-medium text-slate-800">{s.studentId?.name}</p>
                          <p className="text-[10px] text-slate-400">{s.studentId?.email}</p>
                        </td>
                        <td className="text-xs text-slate-500">{new Date(s.submissionTime).toLocaleString()}</td>
                        <td>
                          {s.validationStatus === "COMPLETED" ? (
                            <span className="badge-success">{s.validationStatus}</span>
                          ) : (
                            <span className="badge-danger">{s.validationStatus}</span>
                          )}
                        </td>
                        <td>
                          {s.extractedWordCount != null && (
                            <p className="text-[10px] text-slate-500">Words: {s.extractedWordCount}</p>
                          )}
                          {s.failureReasons && s.failureReasons.length > 0 && (
                            <ul className="mt-1 space-y-0.5 text-[10px] text-red-500">
                              {s.failureReasons.map((f, i) => <li key={i}>• {f.message}</li>)}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
