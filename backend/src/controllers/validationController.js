import { validateStudent } from "../services/validationService.js";

export async function validateStudentController(req, res, next) {
  try {
    const { studentUserId, ruleId } = req.body;
    const result = await validateStudent({
      studentUserId,
      ruleId,
      validatorUserId: req.user._id
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

