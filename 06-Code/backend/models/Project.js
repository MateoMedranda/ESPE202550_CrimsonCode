const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        id:{type:Number},
        name:{type:String},
        description:{type:String},
        client:{type:String},
        location:{  
            type:{
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        startDate:{type:Date},
        endDate:{type:Date},
        status:{type:String},
        imageURL:{type:String},
    },
    {collection:"Project"}
);

module.exports = mongoose.model("Project",projectSchema);
