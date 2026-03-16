/**
 * Isolated assignment validation rule engine.
 * Accepts assignment rules (from DB), extracted PDF metadata, and submission details.
 * Returns structured validation response. No validation logic in routes/controllers.
 */

export function validateAssignmentSubmission({ assignmentRules, submissionContext }) {
  const failures = [];
  const rules = assignmentRules.ruleConfig || assignmentRules;

  if (!rules) {
    return { status: "REJECTED", failures: [{ ruleKey: "ruleConfig", message: "No rules configured." }] };
  }

  if (rules.allowedFileType && submissionContext.fileMimeType) {
    const allowed = (rules.allowedFileType || "").toLowerCase();
    const actual = (submissionContext.fileMimeType || "").toLowerCase();
    const isPdf = actual === "application/pdf" || actual === "pdf";
    if (allowed.indexOf("pdf") !== -1 && !isPdf) {
      failures.push({
        ruleKey: "fileFormat",
        message: "File format must be PDF. Only PDF uploads are allowed."
      });
    }
  }

  if (rules.maxFileSizeBytes != null && submissionContext.fileSizeBytes != null) {
    if (submissionContext.fileSizeBytes > rules.maxFileSizeBytes) {
      failures.push({
        ruleKey: "maxFileSize",
        message: `File size ${submissionContext.fileSizeBytes} bytes exceeds maximum allowed ${rules.maxFileSizeBytes} bytes.`
      });
    }
  }

  if (rules.dueDateTime || submissionContext.dueDateTime) {
    const due = new Date(rules.dueDateTime || submissionContext.dueDateTime).getTime();
    const submitted = new Date(submissionContext.submissionTime || Date.now()).getTime();
    if (submitted > due) {
      failures.push({
        ruleKey: "dueDateTime",
        message: "Submission is after the due date and time."
      });
    }
  }

  if (rules.maxWordCount != null && submissionContext.wordCount != null) {
    if (submissionContext.wordCount > rules.maxWordCount) {
      failures.push({
        ruleKey: "maxWordCount",
        message: `Word count ${submissionContext.wordCount} exceeds maximum ${rules.maxWordCount}.`
      });
    }
  }

  if (rules.minWordCount != null && submissionContext.wordCount != null) {
    if (submissionContext.wordCount < rules.minWordCount) {
      failures.push({
        ruleKey: "minWordCount",
        message: `Word count ${submissionContext.wordCount} is below minimum ${rules.minWordCount}.`
      });
    }
  }

  if (Array.isArray(rules.customRules) && rules.customRules.length > 0) {
    for (const custom of rules.customRules) {
      const value = custom.value;
      const key = (custom.ruleKey || "").toString();
      if (key === "minWordCount" && value != null && submissionContext.wordCount != null) {
        if (submissionContext.wordCount < Number(value)) {
          failures.push({
            ruleKey: key,
            message: custom.description || `Word count must be at least ${value}.`
          });
        }
      } else if (key === "maxWordCount" && value != null && submissionContext.wordCount != null) {
        if (submissionContext.wordCount > Number(value)) {
          failures.push({
            ruleKey: key,
            message: custom.description || `Word count must not exceed ${value}.`
          });
        }
      }
    }
  }

  const isValid = failures.length === 0;
  return {
    status: isValid ? "COMPLETED" : "REJECTED",
    failures
  };
}
