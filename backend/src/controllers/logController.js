import { listLogs, listLogsForStudent } from "../services/validationService.js";

export async function listLogsController(req, res, next) {
  try {
    const logs = await listLogs();
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

export async function myLogsController(req, res, next) {
  try {
    const logs = await listLogsForStudent(req.user._id);
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

