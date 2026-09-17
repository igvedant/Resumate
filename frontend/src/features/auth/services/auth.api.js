import api from "../../../services/api";

export async function register({email,name,username,password}){
    const response= await api.post("/api/auth/register",{
        email,name,username,password
    } );

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;

}

export async function login({email,password}){
    const response= await api.post("/api/auth/login",{
        email,password
    });

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data;

}

export async function logout(){
    const response = await api.post("/api/auth/logout", null, {
        skipAuthRefresh: true,
    });

    localStorage.removeItem("accessToken");
    return response.data;
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me");
    return response.data;
}