import {useContext, useEffect, useState} from "react";
import { AuthContext } from "../auth.context.jsx";
import { getMe, login, logout, register } from "../services/auth.api.js";

export const useAuth=()=>{
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;
    const [error, setError] = useState("");
    
    const handleLogin = async({email,password}) =>{
        setLoading(true);
        setError("");
        try{
            const data= await login({email,password});
            setUser(data.user);
            return true;
        }catch(err){
            setError(err.response?.data?.message || err.message || "Unable to log in");
            return false;
        }finally{
            setLoading(false);
        }
    }
    const handleRegister = async({email,name,username,password}) =>{
        setLoading(true);
        setError("");
        try{
            const data= await register({email,name,username,password});
            setUser(data.user);
            return true;
        }catch(err){
            setError(err.response?.data?.message || err.message || "Unable to register");
            return false;
        }finally{
            setLoading(false);
        }
    }
    const handleLogout = async()=>{
        setLoading(true);
        try{
            await logout();
            setUser(null);
        }catch(err){
            setError(err.response?.data?.message || err.message || "Unable to log out");
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        const getAndSetUser = async()=>{
            try {
                const data = await getMe();
                setUser(data.user);
            } catch {
                localStorage.removeItem("accessToken");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();
    },[setLoading, setUser])

    return {user, loading, error, handleLogin, handleRegister, handleLogout};
}