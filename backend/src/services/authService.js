import { User, USER_ROLES } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export async function registerUser({ name, email, password, role }) {
  if (!USER_ROLES.includes(role)) {
    throw new Error("Invalid role");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, role });

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

