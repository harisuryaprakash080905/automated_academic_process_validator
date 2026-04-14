import { User, USER_ROLES } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function registerUser({ name, email, password, role, roleId }) {
  if (!USER_ROLES.includes(role)) {
    throw createError("Invalid role", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw createError("User already exists", 409);
  }

  const user = await User.create({ name, email, password, role, roleId });

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleId: user.roleId
    },
    token
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw createError("Invalid credentials", 401);
  }

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleId: user.roleId
    },
    token
  };
}

