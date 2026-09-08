const jwt = require('jsonwebtoken');

function generateAccessToken(userId){
 return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRETKEY,{
    expiresIn:"15m"
 });
}

function generateRefreshToken(userId){
    return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRETKEY,{
        expiresIn:"7d"
    });
}

function verifyAccessToken(token){
    try{
        return jwt.verify(token,process.env.ACCESS_TOKEN_SECRETKEY);
    }catch(err){
        console.log("Invalid token", err.msg);
    }
}

function verifyRefreshToken(token){
    try{
        return jwt.verify(token,process.env.REFRESH_TOKEN_SECRETKEY);
    }catch(err){
        console.log("Invalid token", err.msg);
    }
}

module.exports={generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken};