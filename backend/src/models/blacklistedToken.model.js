const mongoose = require("mongoose");

const blacklistedTokenSchema= new mongoose.Schema({
    accessToken:{
        type:String,
        required:false,
    },
    refreshToken:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true});

blacklistedTokenSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*7});
blacklistedTokenSchema.index(
    {accessToken:1},
    {
        unique:true,
        partialFilterExpression:{accessToken:{$type:"string"}},
    },
);

module.exports=mongoose.model("blacklistedTokens", blacklistedTokenSchema);