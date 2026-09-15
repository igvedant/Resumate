const reportModel = require("../models/report.model");
const pdfParse = require("pdf-parse");
const { generateReport } = require("../services/ai.service");

/**
 * @description This controller generates report by taking - resume(pdf), selfDescription(text) and jobDescription(text) as input and returns the generated report
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

/**
 *@description This controller fetches the report by id
 */
async function fetchReportById(req,res){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message:"Report ID is required"
        })
    }

    const report= await reportModel.findById(id);

    if(!report){
        return res.status(404).json({
            message:"Report not found"
        })
    }

    res.status(200).json({
        message:"Report fetched successfully",
        report
    });
} 

/**
 * @description This controller fetches all the reports of the logged in user
 */
async function fetchAllReports(req,res){
    const reports = (await reportModel.find({user:req.user._id})).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -matchScore -technicalQuestions -behaviouralQuestions -skillGaps -preperationPlan");

    if(!reports || reports.length ==0){
        return res.status(404).json({
            message:"No reports found"
        })
    }

    res.status(200).json({
        message:"Reports fetched successfully",
        reports
    })
}

module.exports= {reportGenerator, fetchReportById, fetchAllReports};