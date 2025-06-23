const mongoose = require("mongoose");

const environmentalPlanSchema = new mongoose.Schema(
    {
        id:{type:Number},
        projectId:{type:Number},
        name:{type:String},
        description:{type:String},
        stage:{type:String},
        process:{type:String},
        createdAt:{type:Date},
        updatedAt:{type:Date}
    },
    {collection:"EnvironmentalPlan"}
);

module.exports = mongoose.model("EnvironmentalPlan",environmentalPlanSchema);