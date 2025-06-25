const express = require("express");
const activity = require("../models/activity");
const router = express.Router({mergeParams:true});

router.get("/activities/", async (req,res) =>{
    try{
        const { planId } = req.params;
        const activities = await activity.find({planId:planId});
        res.json(activities);
    }catch (err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;