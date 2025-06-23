const express = require("express");
const environmentalPlan = require("../models/environmentalPlan");
const router = express.Router({mergeParams:true});

router.get("/environmental-plans/", async (req,res) =>{
    try{
        const { projectId } = req.params;
        const environmentalPlans = await environmentalPlan.find({projectId:projectId});
        res.json(environmentalPlans);
    }catch (err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;