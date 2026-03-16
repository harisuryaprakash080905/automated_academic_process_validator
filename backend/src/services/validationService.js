import { getRuleById } from "./ruleService.js";
import { getStudentRecordByUser } from "./studentService.js";
import { ValidationLog } from "../models/ValidationLog.js";
import { validateStudentAgainstRules } from "../ruleEngine/index.js";
import { User } from "../models/User.js";

export async function validateStudent({ studentUserId, ruleId, validatorUserId }) {
  const [studentUser, validatorUser] = await Promise.all([
    User.findById(studentUserId),
    User.findById(validatorUserId)
  ]);

  if (!studentUser || studentUser.role !== "student") {
    throw new Error("Student user not found");
  }
  if (!validatorUser || (validatorUser.role !== "faculty" && validatorUser.role !== "admin")) {
    throw new Error("Validator must be faculty or admin");
  }

  const [rule, studentRecord] = await Promise.all([
    getRuleById(ruleId),
    getStudentRecordByUser(studentUserId)
  ]);

  const result = validateStudentAgainstRules({
    rules: rule,
    studentRecord
  });

  const log = await ValidationLog.create({
    studentUser: studentUser._id,
    studentId: studentRecord.studentId,
    rule: rule._id,
    result: result.status,
    failures: result.failures,
    validator: validatorUser._id
  });

  return {
    validation: result,
    log
  };
}

export async function listLogs() {
  return ValidationLog.find()
    .populate("studentUser", "name email")
    .populate("validator", "name email role")
    .populate("rule", "name");
}

export async function listLogsForStudent(studentUserId) {
  return ValidationLog.find({ studentUser: studentUserId })
    .sort({ createdAt: -1 })
    .populate("rule", "name")
    .lean();
}

