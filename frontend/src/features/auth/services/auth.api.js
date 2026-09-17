import api from "../../../services/api";

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
        const response = await api.post("/api/auth/logout", null, {
            skipAuthRefresh: true,
        });

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