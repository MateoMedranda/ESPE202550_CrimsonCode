const mongoose = require("mongoose");

const controlSchema = new mongoose.Schema(
    {
        id:{type:Number},
        criterion:{type:String},
        observation:{type:String},
        evidence:{type:String},
        date:{type:Date},
        createdBy:{type:String},
        verificaction:{type:String},
        status:{type:String}
    },
    {collection:"Control"}
);

module.exports = mongoose.model("Control", controlSchema);