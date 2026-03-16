export function validateStudentAgainstRules({ rules, studentRecord }) {
  const failures = [];

  if (rules.attendanceRule && rules.attendanceRule.enabled) {
    if (studentRecord.attendancePercentage < rules.attendanceRule.minPercentage) {
      failures.push({
        ruleKey: "attendanceRule",
        message: `Attendance ${studentRecord.attendancePercentage}% is below required ${rules.attendanceRule.minPercentage}%.`
      });
    }
  }

  if (rules.subjectRule && rules.subjectRule.enabled) {
    const belowSubjectThreshold = studentRecord.subjects.filter(
      (s) => s.marks < rules.subjectRule.minMarksPerSubject
    );
    if (belowSubjectThreshold.length > 0) {
      const subjectCodes = belowSubjectThreshold.map((s) => s.code).join(", ");
      failures.push({
        ruleKey: "subjectRule",
        message: `Subjects [${subjectCodes}] have marks below required ${rules.subjectRule.minMarksPerSubject}.`
      });
    }
  }

  if (rules.creditRule && rules.creditRule.enabled) {
    if (studentRecord.totalCredits < rules.creditRule.minTotalCredits) {
      failures.push({
        ruleKey: "creditRule",
        message: `Total credits ${studentRecord.totalCredits} is below required ${rules.creditRule.minTotalCredits}.`
      });
    }
  }

  if (rules.prerequisiteRule && rules.prerequisiteRule.enabled) {
    const completedCodes = studentRecord.subjects
      .filter((s) => s.completed)
      .map((s) => s.code);
    const missing = (rules.prerequisiteRule.requiredSubjects || []).filter(
      (code) => !completedCodes.includes(code)
    );
    if (missing.length > 0) {
      failures.push({
        ruleKey: "prerequisiteRule",
        message: `Missing prerequisite subjects: ${missing.join(", ")}.`
      });
    }
  }

  const isValid = failures.length === 0;

  return {
    status: isValid ? "VALID" : "INVALID",
    failures
  };
}

