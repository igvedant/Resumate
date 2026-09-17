const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware=require('../middlewares/auth.middleware');
const validate = require("../middlewares/validate.middleware");
const asyncHandler = require("../utils/asyncHandler");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = Router();

// @route POST /api/auth/register
router.post("/register", validate(registerSchema), asyncHandler(authController.registerUser));

// @route POST /api/auth/login
router.post("/login", validate(loginSchema), asyncHandler(authController.loginUser));

// @route POST/api/auth/refresh
router.post("/refresh",asyncHandler(authController.refreshToken));

// @route POST /api/auth/logout
router.post("/logout",authMiddleware.validateToken,asyncHandler(authController.logoutUser));

//@route POST /api/auth/get-me
router.get("/get-me",authMiddleware.validateToken,asyncHandler(authController.getUser));

module.exports = router;