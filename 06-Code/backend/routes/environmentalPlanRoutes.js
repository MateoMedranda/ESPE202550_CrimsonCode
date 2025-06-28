const express = require("express");
const environmentalPlan = require("../models/environmentalPlan");
const router = express.Router({ mergeParams: true });

router.get("/environmental-plans/", async (req, res) => {
  try {
    const { projectId } = req.params;
    const environmentalPlans = await environmentalPlan.findAll({ where: { projectid: projectId } });
    res.status(200).json(environmentalPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/environmental-plans/:planId", async (req, res) => {
  try {
    const environmentalPlanObject = await environmentalPlan.findOne({ where: { projectid: req.params.projectId, id:req.params.planId} });
    if(!environmentalPlanObject){
      res.status(404).json({message: "The environmental plan was not found or not exists"});
    }
    res.status(200).json(environmentalPlanObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/environmental-plans/", async (req,res) =>{
  try{
    const projectid = req.params.projectId;
    const {name, description, stage, process } = req.body;

    if(!projectid || isNaN(Number(projectid)) || !name || !description || !stage || !process){
      res.status(400).json({message: "Empty parameters are not allowed or the format is incorrect"});
    }

    const newEnvironmentalPlan = await environmentalPlan.create({
      projectid,
      name,
      description,
      stage,
      process
    });

    res.status(201).json(newEnvironmentalPlan);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

router.put("/environmental-plans/:planId", async (req, res) => {
  try {
    const id = req.params.planId;

    const plan = await environmentalPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Not found the environmental plan or it not exist" });
    }
    await plan.update(req.body);

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/environmental-plans/:planId", async (req, res) => {
  try{
    const id = req.params.planId;

    const plan = await environmentalPlan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Not found the environmental plan or it not exist" });
    }
    await plan.destroy();

    res.status(204).send();

  }catch (err){
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
