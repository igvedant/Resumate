import {useContext, useEffect} from "react";
import { AuthContext } from "../auth.context.jsx";
import { getMe, login, logout, register } from "../services/auth.api.js";
import { useNavigate } from "react-router";

export const useAuth=()=>{
    const navigate = useNavigate();
    const context = useContext(AuthContext);
    const {user,setUser,loading,setLoading} = context;
    
    const handleLogin = async({email,password}) =>{
        setLoading(true);
        try{
            const data= await login({email,password});
            setUser(data.user);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    const handleRegister = async({email,name,username,password}) =>{
        setLoading(true);
        try{
            const data= await register({email,name,username,password});
            setUser(data.user);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    const handleLogout = async()=>{
        setLoading(true);
        try{
            const data= await logout();
            setUser(null);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        const getAndSetUser = async()=>{
            const data = await getMe();
            if(data) setUser(data.user);
            setLoading(false);
        }
        getAndSetUser();
    },[])

    return {user, loading, handleLogin, handleRegister, handleLogout};
}