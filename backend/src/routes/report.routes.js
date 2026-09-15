const {Router} = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const reportController=  require("../controllers/report.controller");

const router = Router();


/**
 * @route POST /api/report/generate
 * @description generates the report on the basis of resume, self description and job description
 * @access private
 */
router.post("/generate", authMiddleware.validateToken, upload.single("resume"), reportController.reportGenerator);

module.exports = router;