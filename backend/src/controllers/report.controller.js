const reportModel = require("../models/report.model");
const pdfParse = require("pdf-parse");
const { generateReport } = require("../services/ai.service");


/**
 * @route POST /api/report/generate
 * @description This controller generates report by taking - resume(pdf), selfDescription(text) and jobDescription(text)
 * @access private
 */
async function reportGenerator(req,res){

    if (!req.file) {
        return res.status(400).json({ message: "Resume PDF is required" });
    }
    const resumeContent = await (new pdfParse.PDFParse({data: req.file.buffer}).getText());
    
    const {selfDescription, jobDescription}= req.body;

    const generatedReport = await generateReport({
        resume:resumeContent.text,
        selfDescription, 
        jobDescription
    });

    const report = await reportModel.create({
        user:req.user._id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...generatedReport
    });

    res.status(201).json({
        message:"Report Generated Successfully",
        report
    });

}

module.exports= {reportGenerator};