const mongoose = require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
    },
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:[true,"Username already exists"],
    },
    password:{
        type:String,
        required:true,
        select:false,
        
    }
},{timestamps:true});


module.exports=mongoose.model("users",userSchema);