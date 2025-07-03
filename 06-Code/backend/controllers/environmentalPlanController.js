const EnvironmentalPlan = require("../models/environmentalPlan");



exports.getAllEnvironmentalPlans = async (req, res) => {
  try {
    const { projectId } = req.params;
    const environmentalPlans = await EnvironmentalPlan.findAll({ where: { project_id: projectId } });
    res.status(200).json(environmentalPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEnvironmentalPlanById = async (req, res) => {
  try {
    const environmentalPlanObject = await EnvironmentalPlan.findOne({ where: { project_id: req.params.projectId, environmentalplan_id: req.params.planId } });
    if (!environmentalPlanObject) {
      return res.status(404).json({ message: "The environmental plan was not found or does not exist" });
    }
    res.status(200).json(environmentalPlanObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEnvironmentalPlan = async (req, res) => {
  try {
    const project_id = req.params.projectId;
    const { name, description, stage, process } = req.body;

    if (!project_id || isNaN(Number(project_id)) || !name || !description || !stage || !process) {
      return res.status(400).json({ message: "Empty parameters are not allowed or the format is incorrect" });
    }

    const newEnvironmentalPlan = await EnvironmentalPlan.create({
      project_id,
      environmentalplan_name: name,
      environmentalplan_description: description,
      environmentalplan_stage: stage,
      environmentalplan_process: process
    });

    res.status(201).json(newEnvironmentalPlan);
  } catch (err) {
    res.status(500).json({ message: err.message, errors: err.errors || null });
  }
};

exports.updateEnvironmentalPlan = async (req, res) => {
  try {
    const id = req.params.planId;

    const plan = await EnvironmentalPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Environmental plan not found" });
    }

    await plan.update({
      environmentalplan_name: req.body.name,
      environmentalplan_description: req.body.description,
      environmentalplan_stage: req.body.stage,
      environmentalplan_process: req.body.process
    });

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEnvironmentalPlan = async (req, res) => {
  try {
    const id = req.params.planId;

    const plan = await EnvironmentalPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Environmental plan not found" });
    }

    await plan.destroy();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
