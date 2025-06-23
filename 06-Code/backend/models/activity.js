const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
    {
        id:{type:Number},
        planId:{type:Number},
        aspect:{type:String},
        impact:{type:String},
        measure:{type:String},
        verification:{type:String},
        frecuency:{type:String},
    },
    {collection:"Activity"}
);

module.exports = mongoose.model("Activity",activitySchema);