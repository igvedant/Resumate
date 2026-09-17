import { useContext, useEffect } from "react";
import {generateReport, getReportById, getAllReports, updateResume} from "../services/interviewReport.api";
import { InterviewReportContext } from "../interviewReport.context";
import { useParams } from "react-router";

export const useReport=()=>{
    const context = useContext(InterviewReportContext);
    const {loading, setLoading, report, setReport, reportIds, setReportIds} = context;
    const { reportId } = useParams();

    const handleGenerateReport = async({resume, selfDescription, jobDescription})=>{
        setLoading(true);
        try{
            const data = await generateReport({resumeFile:resume, selfDescription, jobDescription});
            setReport(data.report);
            return data.report._id;
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleGetReportById = async({reportId})=>{
        setLoading(true);
        try{
            const data = await getReportById({reportId});
            setReport(data.report);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleGetAllReports= async()=>{
        setLoading(true);
        try{
            const data = await getAllReports();
            setReportIds(data.reports);
        }
        catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleUpdateResume = async ({reportId})=>{
        try{
            return await updateResume({reportId});
        }catch(err){
            console.log(err);
            throw err;
        }
    }

    useEffect(()=>{
        const cachedReportId = report?._id?.toString();

        if (reportId && cachedReportId !== reportId) {
             handleGetReportById({ reportId });
        }
        else if(!reportId && !reportIds?.length && !cachedReportId){
            handleGetAllReports();
        }
    },[]);

    return {loading, report, reportIds, handleGenerateReport, handleGetReportById, handleGetAllReports, handleUpdateResume};
}