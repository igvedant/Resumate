const reportModel = require("../models/report.model");
const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const { generateReport, updateResume } = require("../services/ai.service");

/**
 * @description This controller generates report by taking - resume(pdf), selfDescription(text) and jobDescription(text) as input and returns the generated report
 */
async function reportGenerator(req,res){

    if (!req.file) {
        return res.status(400).json({ message: "Resume PDF is required" });
    }

    if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Resume must be a PDF file" });
    }

    const {selfDescription, jobDescription}= req.body;
    if (!selfDescription || !jobDescription) {
        return res.status(400).json({ message: "Descriptions are required" });
    }

    const resumeContent = await (new pdfParse.PDFParse({data: req.file.buffer}).getText());

    if (!resumeContent.text.trim()) {
        return res.status(400).json({ message: "Resume PDF contains no readable text" });
    }
    
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
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid report ID",
        });
    }   

    const report= await reportModel.findOne({
        _id: id,
        user: req.user._id,
    });

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
    const reports = await reportModel.find({user:req.user._id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -technicalQuestions -behaviouralQuestions -skillGaps -preperationPlan -__v");

    res.status(200).json({
        message:"Reports fetched successfully",
        reports
    })
}

/**
 * @description This controller updates the resume of the report by id and returns the updated resume as a pdf file
 */
async function downloadUpdatedResume(req,res){
    const {id} = req.params;

    if(!id){
        return res.status(400).json({
            message:"Report ID is required"
        })
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid report ID",
        });
    }

    const report = await reportModel.findOne({
        _id:id,
        user:req.user._id,
    });

    if(!report){
        return res.status(404).json({
            message:"Report not found"
        });
    }

    const upDatedResume = await updateResume({report});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=updated_resume.pdf');
    res.send(upDatedResume);
}

module.exports= {reportGenerator, fetchReportById, fetchAllReports, downloadUpdatedResume};