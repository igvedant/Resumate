import api from "../../../services/api";

export async function generateReport({resumeFile, selfDescription, jobDescription}){

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/api/report/generate", formData, {
        header:{
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function getReportById({reportId}){
    const response = await api.get(`/api/report/fetch/${reportId}`);

    return response.data;
}

export async function getAllReports(){
    const response = await api.get("/api/report/getAll");
    return response.data;
}