const mongoose = require("mongoose");
const blacklistedTokenModel = require("../models/blacklistedToken.model");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        await blacklistedTokenModel.syncIndexes();
        console.log("Database Connected");
    }catch(err){
        console.log("Database Connection failed - " + err);
        throw err;
    }
}

module.exports=connectDB;