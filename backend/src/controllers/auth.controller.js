const blacklistedTokenModel =require("../models/blacklistedToken.model");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } =require("../utils/token.util");
const userModel=require("../models/user.model");
const bcrypt=require("bcrypt");


/**
 * @route POST /api/auth/register
 * @description Register a new user requires email, name, username and password
 * @access Public
 */
async function registerUser(req,res){
    const {email,name,username,password}=req.body;

    if(!email || !name || !username || !password){
        return res.status(400).json({
            message:"All field are required"
        })
    }

    const userExists = await userModel.findOne({
        $or:[
            {email},{username}
        ]
    });
    if(userExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        email,
        name,
        username,
        password:hashedPassword
    })

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("token",refreshToken,{
        httpOnly:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000 //7days
    })

    return res.status(201).json({
        message:"User created successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            username:user.username,
        },
        token:accessToken
    });
}
/**
 * @route POST /api/auth/login
 * @description Login a user, requires Email and password
 * @access Public 
 */
async function loginUser(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required"
        })
    }

    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(400).json({
            message:"User not found with this email"
        })
    }

    if(!(await bcrypt.compare(password,user.password))){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }

    const accessToken= generateAccessToken(user._id);
    const refreshToken=generateRefreshToken(user._id);

    res.cookie("token", refreshToken, {
        httpOnly:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000 //7days
    })

    return res.status(200).json({
        message:"User Logged in successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            username:user.username,
        },
        accessToken
    });
}

/**
 * @route POST /api/auth/refresh
 * @description Generate a new access token using the refresh token
 * @access Public
 */
async function refreshToken(req,res){
    const refreshToken= req.cookies.token;
    if(!refreshToken){
        return res.status(401).json({
            message:"Unauthorized Access"
        })
    }

    const isTokenBlacklisted = await blacklistedTokenModel.findOne({refreshToken});
    if(isTokenBlacklisted){
        return res.status(403).json({
            message:"Login First"
        })
    }

    const decoded = verifyRefreshToken(refreshToken);
    if(!decoded){
        return res.status(403).json({
            message:"Invalid Token"
        })
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    res.status(200).json({
        message:"New token generated successfully",
        accessToken:newAccessToken,
    });
}

/**
 * @route POST /api/auth/logout
 * @description Removes token from cookie and blacklist it for 7days
 * @access Public
 */
async function logoutUser(req,res){
    const refreshToken = req.cookies.token;

    if(!refreshToken){
        res.status(401).json({
            message:"Unauthorized request"
        })
    }
    await blacklistedTokenModel.create({
        accessToken:req.user.accessToken,
        refreshToken,
    })

    res.clearCookie('token');

    res.status(201).json({message:"Logged Out"});
}

/**
 * @route GET /api/auth/get-me
 * @description Fetch the user details from database
 * @access Public
 */
async function getUser(req,res){
    const user = await userModel.findById(req.user._id);
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }
    res.status(200).json({
        user
    })
}

module.exports={registerUser,loginUser, refreshToken, logoutUser, getUser};