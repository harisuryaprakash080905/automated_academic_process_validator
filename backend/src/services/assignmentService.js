import { Assignment } from "../models/Assignment.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { sendAssignmentNotificationEmail } from "./emailService.js";

export async function createAssignment(facultyId, payload) {
  const faculty = await User.findById(facultyId);
  if (!faculty || faculty.role !== "faculty") {
    throw new Error("Only faculty can create assignments");
  }
  const assignment = await Assignment.create({ ...payload, facultyId });
  
  // Handle notifications and emails asynchronously
  if (assignment.assignedStudents && assignment.assignedStudents.length > 0) {
    const students = await User.find({ _id: { $in: assignment.assignedStudents } });
    
    const notifications = students.map(student => ({
      userId: student._id,
      title: "New Assignment Created",
      message: `A new assignment "${assignment.title}" has been created by ${faculty.name}.`
    }));
    
    await Notification.insertMany(notifications);
    
    // Send email to all assigned students
    for (const student of students) {
      sendAssignmentNotificationEmail(student.email, student.name, assignment.title, faculty.name);
    }
  }

  return assignment;
}

export async function updateAssignment(assignmentId, facultyId, payload) {
  const assignment = await Assignment.findOne({ _id: assignmentId, facultyId });
  if (!assignment) {
    throw new Error("Assignment not found or access denied");
  }
  Object.assign(assignment, payload);
  await assignment.save();
  return assignment;
}

export async function deleteAssignment(assignmentId, facultyId) {
  const assignment = await Assignment.findOneAndDelete({ _id: assignmentId, facultyId });
  if (!assignment) {
    throw new Error("Assignment not found or access denied");
  }
  return assignment;
}

export async function getAssignmentById(assignmentId) {
  const assignment = await Assignment.findById(assignmentId).populate("facultyId", "name email");
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  return assignment;
}

export async function listAssignmentsByFaculty(facultyId) {
  return Assignment.find({ facultyId })
    .populate("assignedStudents", "name email")
    .sort({ createdAt: -1 });
}

export async function listAssignmentsForStudent(studentId) {
  return Assignment.find({ assignedStudents: studentId })
    .populate("facultyId", "name email")
    .sort({ dueDateTime: 1 });
}

export async function ensureStudentAssigned(assignmentId, studentId) {
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new Error("Assignment not found");
  }
  const assigned = assignment.assignedStudents.some(
    (id) => id.toString() === studentId.toString()
  );
  if (!assigned) {
    throw new Error("You are not assigned to this assignment");
  }
  return assignment;
}
