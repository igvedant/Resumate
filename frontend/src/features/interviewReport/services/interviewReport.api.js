const axios = require("axios");

const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("accessToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
    const response = await api.get(`/api/report/${reportId}`);

    return response.data;
}

export async function getAllReports(){
    const response = await api.get("/api/report/getAll");

    return response.data;
}