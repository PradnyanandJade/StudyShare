import {createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const  AuthContextProvider = ({children})=>{
    const [auth,setAuth]=useState(JSON.parse(localStorage.getItem('auth')) ||  false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    async function login(username, password, role) {
        setLoading(true);
        setError(null);
        try {
                const response = await axios.post('http://localhost:3000/authenticate/login', {
                    username,
                    password,
                    role
                }, {
                    withCredentials: true // Important for cookies
                });            
                if (response.data.success) {
                    const userObj = {
                        user_id: response.data.user_id,
                        username,
                        role
                };
                setUser(userObj);
                setAuth(true);
                localStorage.setItem('auth', JSON.stringify(true));
                localStorage.setItem('user', JSON.stringify(userObj));
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    async function register(username, password, role) {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:3000/authenticate/register', {
                username,
                password,
                role
            }, {
                withCredentials: true // Important for cookies
            });
            if (response.data.success) {
                return { success: true, message: response.data.message };
            } else {
                setError(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    function authorize() {
        setAuth(true);
        localStorage.setItem('auth',JSON.stringify(true));
    }
    
    function unauthorize() {
        setAuth(false);
        setUser(null);
        localStorage.setItem('auth',JSON.stringify(false));
        localStorage.removeItem('user');
    }
    
    useEffect(()=>{
        localStorage.setItem('auth',JSON.stringify(auth));
    },[auth]);
    
    return(
        <AuthContext.Provider value={{auth,setAuth,authorize,unauthorize,login,register,user,loading,error,setError}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

export const useAuth = () => {
    return useContext(AuthContext);
}