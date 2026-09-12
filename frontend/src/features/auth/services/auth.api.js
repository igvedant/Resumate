import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({email,name,username,password}){

    try{
        const response= await api.post("/api/auth/register",{
            email,name,username,password
        } );

        const { token } = response.data;
        localStorage.setItem("accessToken", token);

        return response.data; 
    }catch(err){
        console.log(err);
    }

}

export async function login({email,password}){

    try{
        const response= await api.post("/api/auth/login",{
            email,password
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        return response.data;
    }catch(err){
        console.log(err);
    }

}

export async function logout(){
    
    try{
        const response = await api.post("/api/auth/logout");

        localStorage.removeItem("accessToken");

        return response.data;
    }catch(err){
        console.log(err);
    }
}

export async function getMe(){
    try{
        const response = await api.get("/api/auth/get-me")

        return response.data;
    }catch(err){
        console.log(err);
    }
}