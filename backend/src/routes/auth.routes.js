const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware=require('../middlewares/auth.middleware');

const router = Router();

// @route POST /api/auth/register
router.post("/register", authController.registerUser);

// @route POST /api/auth/login
router.post("/login", authController.loginUser);

// @route POST/api/auth/refresh
router.post("/refresh",authController.refreshToken);

// @route POST /api/auth/logout
router.post("/logout",authMiddleware.validateToken,authController.logoutUser);

//@route POST /api/auth/get-me
router.get("/get-me",authMiddleware.validateToken,authController.getUser);

module.exports = router;