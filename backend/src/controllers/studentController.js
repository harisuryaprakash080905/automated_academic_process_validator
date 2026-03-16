import {
  upsertStudentRecord,
  getStudentRecordByUser,
  getStudentRecordById,
  listStudentRecords,
  listStudentUsers
} from "../services/studentService.js";

export async function upsertStudentRecordController(req, res, next) {
  try {
    const { studentUserId, studentId, attendancePercentage, totalCredits, subjects } = req.body;
    const record = await upsertStudentRecord({
      studentUserId,
      studentId,
      attendancePercentage,
      totalCredits,
      subjects
    });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

export async function getMyRecordController(req, res, next) {
  try {
    const record = await getStudentRecordByUser(req.user._id);
    res.json(record);
  } catch (error) {
    next(error);
  }
}

export async function getStudentRecordController(req, res, next) {
  try {
    const record = await getStudentRecordById(req.params.id);
    res.json(record);
  } catch (error) {
    next(error);
  }
}

export async function listStudentRecordsController(req, res, next) {
  try {
    const records = await listStudentRecords();
    res.json(records);
  } catch (error) {
    next(error);
  }
}

export async function listStudentUsersController(req, res, next) {
  try {
    const users = await listStudentUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

