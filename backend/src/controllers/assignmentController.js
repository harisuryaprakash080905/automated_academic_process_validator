import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentById,
  listAssignmentsByFaculty,
  listAssignmentsForStudent
} from "../services/assignmentService.js";

export async function createAssignmentController(req, res, next) {
  try {
    const assignment = await createAssignment(req.user._id, req.body);
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
}

export async function updateAssignmentController(req, res, next) {
  try {
    const assignment = await updateAssignment(req.params.id, req.user._id, req.body);
    res.json(assignment);
  } catch (error) {
    next(error);
  }
}

export async function deleteAssignmentController(req, res, next) {
  try {
    await deleteAssignment(req.params.id, req.user._id);
    res.json({ message: "Assignment deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentController(req, res, next) {
  try {
    const assignment = await getAssignmentById(req.params.id);
    res.json(assignment);
  } catch (error) {
    next(error);
  }
}

export async function listMyAssignmentsController(req, res, next) {
  try {
    const isFaculty = req.user.role === "faculty";
    const list = isFaculty
      ? await listAssignmentsByFaculty(req.user._id)
      : await listAssignmentsForStudent(req.user._id);
    res.json(list);
  } catch (error) {
    next(error);
  }
}
