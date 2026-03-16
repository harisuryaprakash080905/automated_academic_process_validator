import {
  createRule,
  updateRule,
  deleteRule,
  listRules,
  getRuleById
} from "../services/ruleService.js";

export async function createRuleController(req, res, next) {
  try {
    const rule = await createRule(req.body);
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
}

export async function updateRuleController(req, res, next) {
  try {
    const rule = await updateRule(req.params.id, req.body);
    res.json(rule);
  } catch (error) {
    next(error);
  }
}

export async function deleteRuleController(req, res, next) {
  try {
    await deleteRule(req.params.id);
    res.json({ message: "Rule deleted" });
  } catch (error) {
    next(error);
  }
}

export async function listRulesController(req, res, next) {
  try {
    const rules = await listRules();
    res.json(rules);
  } catch (error) {
    next(error);
  }
}

export async function getRuleController(req, res, next) {
  try {
    const rule = await getRuleById(req.params.id);
    res.json(rule);
  } catch (error) {
    next(error);
  }
}

