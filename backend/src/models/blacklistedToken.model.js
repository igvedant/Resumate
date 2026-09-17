const mongoose = require("mongoose");

const blacklistedTokenSchema= new mongoose.Schema({
    accessToken:{
        type:String,
        required:false,
        unique:true,
        sparse:true,
    },
    refreshToken:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true});

blacklistedTokenSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*7});

module.exports=mongoose.model("blacklistedTokens", blacklistedTokenSchema);