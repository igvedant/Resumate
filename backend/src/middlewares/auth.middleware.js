const blacklistedTokenModel =require("../models/blacklistedToken.model");
const { verifyAccessToken } =require("../utils/token.util");

// @description Middleware to validate the access token in the request headers
async function validateToken(req,res,next){
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }

    const isTokenBlacklisted = await blacklistedTokenModel.findOne({accessToken:token});
    if(isTokenBlacklisted){
        return res.status(403).json({
            message:"Login First"
        })
    }

    const decoded = verifyAccessToken(token);
    if(!decoded){
        return res.status(403).json({
            message:"Invalid token"
        })
    }
    req.user={_id:decoded.userId, accessToken:token};
    next();
} 
module.exports={validateToken};