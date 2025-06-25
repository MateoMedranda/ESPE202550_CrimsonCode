const express = require("express");
const control = require("../models/control");
const router = express.Router({mergeParams:true});

router.get("/controls/", async (req,res) =>{
    try{
        const { activityId } = req.params;
        const controls = await control.find({activityId:activityId});
        res.json(controls);
    }catch (err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;