const mongoose=require("mongoose");

const technicalQuestionsSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    intention:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    }
},{
    _id:false
});

const reportSchema= new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"Job Description is required"],
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        required:true,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionsSchema],
    behaviouralQuestions:[technicalQuestionsSchema],
    skillGaps:[new mongoose.Schema({
        skill:{
            type:String,
            required:true,
        },
        severnity:{
            type:String,
            enum:["low", "medium", "high"],
            required:true,
        }
    },{_id:false})],
    preperationPlan:[new mongoose.Schema({
        day:{
            type:Number,
            required:true,
        },
        focus:{
            type:String,
            required:true,
        },
        tasks:[{
            type:String,
            required:true,
        }]
    },{_id:false})]
})

module.exports=mongoose.model("reports",reportSchema);