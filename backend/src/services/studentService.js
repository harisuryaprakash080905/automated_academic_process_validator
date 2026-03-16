import { StudentAcademicRecord } from "../models/StudentAcademicRecord.js";
import { User } from "../models/User.js";

export async function upsertStudentRecord({ studentUserId, studentId, attendancePercentage, totalCredits, subjects }) {
  const studentUser = await User.findById(studentUserId);
  if (!studentUser || studentUser.role !== "student") {
    throw new Error("Student user not found");
  }

  const update = {
    studentUser: studentUserId,
    studentId,
    attendancePercentage,
    totalCredits,
    subjects
  };

  const record = await StudentAcademicRecord.findOneAndUpdate(
    { studentUser: studentUserId },
    update,
    { upsert: true, new: true, runValidators: true }
  );

  return record;
}

export async function getStudentRecordByUser(studentUserId) {
  const record = await StudentAcademicRecord.findOne({ studentUser: studentUserId });
  if (!record) {
    throw new Error("Student academic record not found");
  }
  return record;
}

export async function getStudentRecordById(recordId) {
  const record = await StudentAcademicRecord.findById(recordId);
  if (!record) {
    throw new Error("Student academic record not found");
  }
  return record;
}

export async function listStudentRecords() {
  return StudentAcademicRecord.find().populate("studentUser", "name email");
}

export async function listStudentUsers() {
  return User.find({ role: "student" }).select("_id name email studentId").sort({ name: 1 });
}

