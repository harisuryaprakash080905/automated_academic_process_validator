import React, { useEffect, useState } from "react";
import api from "../api";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      const res = await api.get("/assignments");
      setAssignments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assignments");
    }
  };

  const loadMySubmissions = async () => {
    try {
      const res = await api.get("/assignments/my-submissions");
      setMySubmissions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions");
    }
  };

  useEffect(() => {
    loadAssignments();
    loadMySubmissions();
  }, []);

  const selectedAssignment = assignments.find((a) => a._id === selectedAssignmentId);
  const submissionsForSelected = mySubmissions.filter(
    (s) => s.assignmentId && s.assignmentId._id === selectedAssignmentId
  );

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if (!selectedAssignmentId || !file) {
      setError("Please select an assignment and a PDF file.");
      return;
    }
    setError("");
    setLastResult(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/assignments/${selectedAssignmentId}/submit`, formData);
      setLastResult(res.data);
      setFile(null);
      loadMySubmissions();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Header ── */}
      <div>
        <h1 className="section-title flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 text-sm text-white shadow-lg shadow-primary-500/25">
            📄
          </span>
          My Assignments
        </h1>
        <p className="section-subtitle mt-1">
          View assigned work and submit your PDF. Submissions are validated automatically.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.2fr)]">
        {/* ── Assignment list ── */}
        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold text-slate-800">Assigned to you</h3>
          {assignments.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-400">No assignments assigned yet.</p>
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
                  onClick={() => { setSelectedAssignmentId(a._id); setLastResult(null); setError(""); }}
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

        {/* ── Submit & validation ── */}
        <div className="card p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-800">Submit & Validation</h3>

          {!selectedAssignment && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <p className="text-sm text-slate-400">Select an assignment to submit.</p>
            </div>
          )}

          {selectedAssignment && (
            <>
              {/* Assignment details */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-sm font-semibold text-slate-800">{selectedAssignment.title}</p>
                {selectedAssignment.description && (
                  <p className="mt-1 text-xs text-slate-500">{selectedAssignment.description}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Due: {new Date(selectedAssignment.dueDateTime).toLocaleString()}
                </p>
                {selectedAssignment.ruleConfig && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Max words</p>
                      <p className="text-xs font-bold text-slate-700">{selectedAssignment.ruleConfig.maxWordCount}</p>
                    </div>
                    {selectedAssignment.ruleConfig.minWordCount > 0 && (
                      <div className="rounded-lg bg-white px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Min words</p>
                        <p className="text-xs font-bold text-slate-700">{selectedAssignment.ruleConfig.minWordCount}</p>
                      </div>
                    )}
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Max size</p>
                      <p className="text-xs font-bold text-slate-700">{(selectedAssignment.ruleConfig.maxFileSizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Format</p>
                      <p className="text-xs font-bold text-slate-700">PDF only</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload form */}
              <form onSubmit={handleSubmitFile} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">Upload PDF</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-center transition-all hover:border-primary-300 hover:bg-primary-50/30">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs font-medium text-slate-500">
                        {file ? (
                          <span className="text-primary-600">{file.name}</span>
                        ) : (
                          <>Click to choose a PDF file</>
                        )}
                      </p>
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full text-xs" disabled={!file || uploading}>
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Uploading…
                    </span>
                  ) : (
                    "Submit assignment"
                  )}
                </button>
              </form>

              {/* Validation result */}
              {lastResult && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 animate-scale-in">
                  <p className="mb-2 text-xs font-bold text-slate-700">Validation result</p>
                  <div className="mb-2">
                    {lastResult.validationStatus === "COMPLETED" ? (
                      <span className="badge-success">{lastResult.validationStatus}</span>
                    ) : (
                      <span className="badge-danger">{lastResult.validationStatus}</span>
                    )}
                  </div>
                  {lastResult.validationResult && (
                    <p className="mb-2 text-xs text-slate-600">{lastResult.validationResult}</p>
                  )}
                  {lastResult.extractedWordCount != null && (
                    <p className="text-xs text-slate-500">Word count: <span className="font-semibold">{lastResult.extractedWordCount}</span></p>
                  )}
                  {lastResult.failureReasons && lastResult.failureReasons.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {lastResult.failureReasons.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-red-500">
                          <span className="mt-1 dot-danger flex-shrink-0" />
                          <span>{f.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Previous submissions */}
              {submissionsForSelected.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-3 text-xs font-bold text-slate-700">Your submissions</p>
                  <ul className="space-y-2">
                    {submissionsForSelected.map((s) => (
                      <li key={s._id} className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 transition-all hover:border-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {new Date(s.submissionTime).toLocaleString()}
                          </span>
                          {s.validationStatus === "COMPLETED" ? (
                            <span className="badge-success text-[10px]">{s.validationStatus}</span>
                          ) : (
                            <span className="badge-danger text-[10px]">{s.validationStatus}</span>
                          )}
                        </div>
                        {s.validationResult && (
                          <p className="mt-1 text-[11px] text-slate-500">{s.validationResult}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
