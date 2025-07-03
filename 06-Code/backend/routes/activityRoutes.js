const express = require("express");
const router = express.Router({ mergeParams: true });
const activityController = require("../controllers/activityController");
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);
router.get("/activities/", activityController.getAllActivities);
router.get("/activities/:activityId", activityController.getActivityById);
router.post("/activities/", activityController.createActivity);
router.put("/activities/:activityId", activityController.updateActivity);
router.delete("/activities/:activityId", activityController.deleteActivity);
router.get("/compliance/", activityController.getCompliance);
router.get("/pending/", activityController.getActivitiesPending);
router.get('/reports/controls', activityController.getControllReportByDate);
router.get('/reportPrueba', activityController.getActivitiesByEvaluationStatus);
router.get('/report', activityController.getEnvironmentalPlanReport);

module.exports = router;
