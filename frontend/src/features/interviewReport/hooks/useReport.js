import { useCallback, useContext, useEffect, useState } from "react";
import {generateReport, getReportById, getAllReports, updateResume} from "../services/interviewReport.api";
import { InterviewReportContext } from "../interviewReport.context";
import { useParams } from "react-router";

export const useReport=()=>{
    const context = useContext(InterviewReportContext);
    const {loading, setLoading, report, setReport, reportIds, setReportIds} = context;
    const { reportId } = useParams();
    const [error, setError] = useState("");
    const [errorStatus, setErrorStatus] = useState(null);

    const handleGenerateReport = useCallback(async({resume, selfDescription, jobDescription})=>{
        setLoading(true);
        setError("");
        setErrorStatus(null);
        try{
            const data = await generateReport({resumeFile:resume, selfDescription, jobDescription});
            setReport(data.report);
            return data.report._id;
        }catch(err){
            setError(err.response?.data?.message || err.message || "Unable to generate report");
            return null;
        }finally{
            setLoading(false);
        }
    }, [setLoading, setReport]);

    const handleGetReportById = useCallback(async({reportId})=>{
        setLoading(true);
        setError("");
        setErrorStatus(null);
        try{
            const data = await getReportById({reportId});
            setReport(data.report);
        }catch(err){
            setErrorStatus(err.response?.status || null);
            setError(err.response?.data?.message || err.message || "Unable to load report");
        }finally{
            setLoading(false);
        }
    }, [setLoading, setReport]);

    const handleGetAllReports= useCallback(async()=>{
        setLoading(true);
        setError("");
        setErrorStatus(null);
        try{
            const data = await getAllReports();
            setReportIds(data.reports);
        }
        catch(err){
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || err.message || "Unable to load reports");
            } else {
                setReportIds([]);
            }
        }finally{
            setLoading(false);
        }
    }, [setLoading, setReportIds]);

    const handleUpdateResume = useCallback(async ({reportId})=>{
        try{
            return await updateResume({reportId});
        }catch(err){
            setError(err.response?.data?.message || err.message || "Unable to create resume");
            throw err;
        }
    }, []);

    useEffect(()=>{
        const cachedReportId = report?._id?.toString();
        const loadReports = async () => {
            if (reportId && cachedReportId !== reportId) {
                await handleGetReportById({ reportId });
            } else if (!reportId && reportIds === null && !cachedReportId) {
                await handleGetAllReports();
            }
        };

        loadReports();
    },[report, reportId, reportIds, handleGetReportById, handleGetAllReports]);

    return {loading, error, errorStatus, report, reportIds, handleGenerateReport, handleGetReportById, handleGetAllReports, handleUpdateResume};
}