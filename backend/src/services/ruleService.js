import { AcademicRule } from "../models/AcademicRule.js";

export async function createRule(payload) {
  const rule = await AcademicRule.create(payload);
  return rule;
}

export async function updateRule(id, payload) {
  const rule = await AcademicRule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });
  if (!rule) {
    throw new Error("Rule not found");
  }
  return rule;
}

export async function deleteRule(id) {
  const rule = await AcademicRule.findByIdAndDelete(id);
  if (!rule) {
    throw new Error("Rule not found");
  }
  return rule;
}

export async function listRules() {
  return AcademicRule.find().sort({ createdAt: -1 });
}

export async function getRuleById(id) {
  const rule = await AcademicRule.findById(id);
  if (!rule) {
    throw new Error("Rule not found");
  }
  return rule;
}

