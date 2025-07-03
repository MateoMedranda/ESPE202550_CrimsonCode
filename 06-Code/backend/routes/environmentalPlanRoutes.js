const express = require("express");
const router = express.Router({ mergeParams: true });
const EPController = require("../controllers/environmentalPlanController");
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);
router.get("/environmental-plans/", EPController.getAllEnvironmentalPlans);
router.get("/environmental-plans/:planId", EPController.getEnvironmentalPlanById);
router.post("/environmental-plans/", EPController.createEnvironmentalPlan);
router.put("/environmental-plans/:planId", EPController.updateEnvironmentalPlan);
router.delete("/environmental-plans/:planId", EPController.deleteEnvironmentalPlan);

module.exports = router;
