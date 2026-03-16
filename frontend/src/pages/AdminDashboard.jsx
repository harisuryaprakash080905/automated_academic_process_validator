import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    attendanceRule: { enabled: true, minPercentage: 75 },
    subjectRule: { enabled: true, minMarksPerSubject: 40 },
    creditRule: { enabled: true, minTotalCredits: 20 },
    prerequisiteRule: { enabled: false, requiredSubjects: [] },
    isActive: true
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [rulesRes, logsRes] = await Promise.all([
        api.get("/rules"),
        api.get("/logs")
      ]);
      setRules(rulesRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRuleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/rules/${editingId}`, form);
      } else {
        await api.post("/rules", form);
      }
      setForm({
        name: "",
        description: "",
        attendanceRule: { enabled: true, minPercentage: 75 },
        subjectRule: { enabled: true, minMarksPerSubject: 40 },
        creditRule: { enabled: true, minTotalCredits: 20 },
        prerequisiteRule: { enabled: false, requiredSubjects: [] },
        isActive: true
      });
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save rule");
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule._id);
    setForm({
      name: rule.name,
      description: rule.description || "",
      attendanceRule: rule.attendanceRule || { enabled: true, minPercentage: 75 },
      subjectRule: rule.subjectRule || { enabled: true, minMarksPerSubject: 40 },
      creditRule: rule.creditRule || { enabled: true, minTotalCredits: 20 },
      prerequisiteRule: rule.prerequisiteRule || { enabled: false, requiredSubjects: [] },
      isActive: rule.isActive
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rule?")) return;
    try {
      await api.delete(`/rules/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete rule");
    }
  };

  const handlePrereqChange = (value) => {
    const list = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((prev) => ({
      ...prev,
      prerequisiteRule: {
        ...prev.prerequisiteRule,
        requiredSubjects: list
      }
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      attendanceRule: { enabled: true, minPercentage: 75 },
      subjectRule: { enabled: true, minMarksPerSubject: 40 },
      creditRule: { enabled: true, minTotalCredits: 20 },
      prerequisiteRule: { enabled: false, requiredSubjects: [] },
      isActive: true
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── Page Header ── */}
      <div>
        <h1 className="section-title flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-sm text-white shadow-lg shadow-primary-500/25">
            🛡️
          </span>
          Admin Dashboard
        </h1>
        <p className="section-subtitle mt-1">
          Configure academic eligibility rules and monitor validation activity.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      {/* ── Rules Section ── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Academic Rules
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Configure data-driven eligibility rules consumed by the validation engine.
        </p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
          {/* Form */}
          <form onSubmit={handleRuleSubmit} className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                {editingId ? "✏️ Edit rule" : "➕ Create new rule"}
              </h3>
              {editingId && (
                <button
                  type="button"
                  className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={resetForm}
                >
                  Clear
                </button>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Semester 5 Rules"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Description</label>
              <textarea
                className="input min-h-[72px] resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the rule set…"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Attendance */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">📊 Attendance</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={form.attendanceRule.enabled}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          attendanceRule: { ...prev.attendanceRule, enabled: e.target.checked }
                        }))
                      }
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
                <label className="mb-1 block text-[11px] text-slate-500">Min percentage</label>
                <input
                  type="number" min="0" max="100" className="input"
                  value={form.attendanceRule.minPercentage}
                  onChange={(e) => setForm((prev) => ({ ...prev, attendanceRule: { ...prev.attendanceRule, minPercentage: Number(e.target.value) } }))}
                />
              </div>
              {/* Subject marks */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">📝 Per-subject</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox" className="peer sr-only"
                      checked={form.subjectRule.enabled}
                      onChange={(e) => setForm((prev) => ({ ...prev, subjectRule: { ...prev.subjectRule, enabled: e.target.checked } }))}
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
                <label className="mb-1 block text-[11px] text-slate-500">Min marks</label>
                <input
                  type="number" min="0" className="input"
                  value={form.subjectRule.minMarksPerSubject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subjectRule: { ...prev.subjectRule, minMarksPerSubject: Number(e.target.value) } }))}
                />
              </div>
              {/* Credits */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">🎯 Credits</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox" className="peer sr-only"
                      checked={form.creditRule.enabled}
                      onChange={(e) => setForm((prev) => ({ ...prev, creditRule: { ...prev.creditRule, enabled: e.target.checked } }))}
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
                <label className="mb-1 block text-[11px] text-slate-500">Min total credits</label>
                <input
                  type="number" min="0" className="input"
                  value={form.creditRule.minTotalCredits}
                  onChange={(e) => setForm((prev) => ({ ...prev, creditRule: { ...prev.creditRule, minTotalCredits: Number(e.target.value) } }))}
                />
              </div>
              {/* Prerequisites */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">🔗 Prereqs</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox" className="peer sr-only"
                      checked={form.prerequisiteRule.enabled}
                      onChange={(e) => setForm((prev) => ({ ...prev, prerequisiteRule: { ...prev.prerequisiteRule, enabled: e.target.checked } }))}
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
                <label className="mb-1 block text-[11px] text-slate-500">Required subjects (comma-sep)</label>
                <input
                  className="input"
                  value={(form.prerequisiteRule.requiredSubjects || []).join(", ")}
                  onChange={(e) => handlePrereqChange(e.target.value)}
                  placeholder="CS101, MA201"
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active rule set
              </label>
              <button type="submit" className="btn-primary text-xs px-5 py-2">
                {editingId ? "Update rule" : "Create rule"}
              </button>
            </div>
          </form>

          {/* Rules list */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule._id} className="card p-5 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{rule.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {rule.isActive ? (
                      <span className="badge-success">
                        <span className="dot-success"></span>
                        ACTIVE
                      </span>
                    ) : (
                      <span className="badge-neutral">INACTIVE</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Attendance</p>
                    <p className="text-sm font-bold text-slate-700">≥ {rule.attendanceRule?.minPercentage ?? "-"}%</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Marks/subject</p>
                    <p className="text-sm font-bold text-slate-700">≥ {rule.subjectRule?.minMarksPerSubject ?? "-"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Credits</p>
                    <p className="text-sm font-bold text-slate-700">≥ {rule.creditRule?.minTotalCredits ?? "-"}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Prerequisites</p>
                    <p className="text-sm font-bold text-slate-700">
                      {(rule.prerequisiteRule?.requiredSubjects || []).join(", ") || "None"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    className="btn-secondary text-xs px-4 py-1.5"
                    onClick={() => handleEdit(rule)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-danger text-xs px-4 py-1.5"
                    onClick={() => handleDelete(rule._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
            {rules.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-sm text-slate-400">No rules configured yet. Create a rule set using the form.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Logs Section ── */}
      <section>
        <h2 className="mb-1 text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Validation Logs
        </h2>
        <p className="mb-5 text-sm text-slate-500">
          Every validation attempt is captured with rules, outcome, and validator info.
        </p>
        <div className="card max-h-[400px] overflow-auto p-0">
          {logs.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">No validation activity recorded yet.</p>
            </div>
          )}
          {logs.length > 0 && (
            <table className="table-modern">
              <thead className="sticky top-0">
                <tr>
                  <th>Student</th>
                  <th>Rule</th>
                  <th>Result</th>
                  <th>Validator</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <div>
                        <p className="font-medium text-slate-800">{log.studentUser?.name}</p>
                        <p className="text-[11px] text-slate-400">{log.studentId}</p>
                      </div>
                    </td>
                    <td className="text-slate-600">{log.rule?.name}</td>
                    <td>
                      {log.result === "VALID" ? (
                        <span className="badge-success">{log.result}</span>
                      ) : (
                        <span className="badge-danger">{log.result}</span>
                      )}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-slate-800">{log.validator?.name}</p>
                        <p className="text-[11px] text-slate-400 uppercase">{log.validator?.role}</p>
                      </div>
                    </td>
                    <td className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
