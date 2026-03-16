import { registerUser, loginUser } from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUser({ name, email, password, role });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

