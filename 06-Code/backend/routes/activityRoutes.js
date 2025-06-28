const express = require("express");
const activity = require("../models/activity");
const control = require("../models/control");
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

router.get("/compliance/", async (req, res) => {
    try {
        const planId = Number(req.params.planId);
        const activities = await activity.findAll({ where: { environmentalplan_id: planId}});

        let evaluate = 0;
        let satisfy = 0;

        for (const activityr of activities) {
            
            const controls = await control.findAll({where: {activity_id: activityr.activity_id}, order: [['createdat', 'DESC']]});
            console.log(`Actividad ID: ${activityr.activity_id}, Frecuencia: ${activityr.activity_frecuency}`);


            if (controls.length == 0) continue;

            const lastControl = controls[0];
            const daysSinceLastControl = (new Date() - new Date(lastControl.createdat)) / (1000 * 60 * 60 * 24);

            let limit = 99999;
            switch (activityr.activity_frecuency.toLowerCase()) {
                case 'mensual': limit = 30; break;
                case 'bimestral': limit = 60; break;
                case 'trimestral': limit = 90; break;
                case 'anual': limit = 365; break;
            }

            if(daysSinceLastControl <=limit){
                evaluate ++;
                if(lastControl.control_criterion.toLowerCase() == "cumple"){
                    satisfy ++;
                }
            }
        }

        let percentage = activities.length ? (satisfy / activities.length*100).toFixed(2):0;

        res.status(200).json(
            {
                totalActivities:activities.length,
                activitiesEvaluated: evaluate,
                activitiesSatisfy: satisfy,
                percentageSatisfy: percentage
            }
        );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;