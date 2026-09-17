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

/**
 * @route GET /api/report/fetch/:id
 * @description fetches the report by id
 * @access private
 */
router.get("/fetch/:id", authMiddleware.validateToken, reportController.fetchReportById);

/**
 * @route GET /api/reports
 * @description fetches all the reports of the logged in user
 * @access private
 */
router.get("/getAll", authMiddleware.validateToken, reportController.fetchAllReports);

/**
 * @route POST /api/report/updateResume/:id
 * @description updates the resume of the report by id
 * @access private
 */
router.post("/updateResume/:id", authMiddleware.validateToken, reportController.downloadUpdatedResume);

module.exports = router;