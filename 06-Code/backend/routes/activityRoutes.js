const express = require("express");
const activity = require("../models/activity");
const router = express.Router({ mergeParams: true });

router.get("/activities/", async (req, res) => {
    try {
        const { planId } = req.params;
        const activities = await activity.findAll({ where: { environmentalplan_id: planId } });
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/activities/:activityId", async (req, res) => {
    try {
        const activityObject = await activity.findOne({ where: { environmentalplan_id: req.params.planId, activity_id: req.params.activityId } });
        if (!activityObject) {
            return res.status(404).json({ message: "The activity was not found or does not exist" });
        }
        res.status(200).json(activityObject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/activities/", async (req, res) => {
    try {
        const environmentalplan_id = req.params.planId;
        const { aspect, impact, measure, verification, frecuency } = req.body;

        if (!environmentalplan_id || isNaN(Number(environmentalplan_id)) || !aspect || !impact || !measure || !verification || !frecuency) {
            return res.status(400).json({ message: "Empty parameters are not allowed or the format is incorrect" });
        }

        const newActivity = await activity.create({
            environmentalplan_id,
            activity_aspect: aspect,
            activity_impact: impact,
            activity_measure: measure,
            activity_verification: verification,
            activity_frecuency: frecuency
        });

        res.status(201).json(newActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/activities/:activityId", async (req, res) => {
    try {

        const id = req.params.activityId;

        const activityObject = await activity.findByPk(id);

        if(!activityObject){
            return res.status(404).json({ message: "Activity not found" });
        }

        const { aspect, impact, measure, verification, frecuency } = req.body;

        await activityObject.update({
            activity_aspect: aspect,
            activity_impact: impact,
            activity_measure: measure,
            activity_verification: verification,
            activity_frecuency: frecuency
        });

        res.status(200).json(activityObject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/activities/:activityId", async (req, res) => {
  try {
    const id = req.params.activityId;

    const activityObject = await activity.findByPk(id);

    if (!activityObject) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activityObject.destroy();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;