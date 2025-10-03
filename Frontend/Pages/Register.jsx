import React, { useEffect, useRef, useState } from "react";
import {passwordImg,usernameImg,eye_onImg,eye_offImg,settingImg} from '../src/assets/index.jsx';
import { useTheme } from "../Context/ThemeContext";
import {useAuth} from '../Context/AuthContext.jsx';
import {notesImg} from '../src/assets/index.jsx';

function Register({setCurrentPage,setShowPopup,setShowPopupMessage}){
    const {themeMode} = useTheme();
    const [role,setRole] = useState("");
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const checkBoxRef=useRef();
    const {register,loading,error,setError} = useAuth();

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    function handleInputChanges(e){
        var id = e.target.id;
        if(id==="username"){
            setUsername(e.target.value);
        }
        if(id==="password"){
            setPassword(e.target.value);   
        }
        if(id==="confirmPassword"){
            setConfirmPassword(e.target.value);   
        }
    }


    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            setError("Please fill in all fields");
            setShowPopupMessage("Please fill in all fields");
            setShowPopup(true);
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setShowPopupMessage("Passwords do not match");
            setShowPopup(true);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setShowPopupMessage("Password must be at least 6 characters long");
            setShowPopup(true);
            return;
        }
        
        const result = await register(username, password, role);
         if (result.success) {
            setCurrentPage("login");
            setRole && setRole("student"); // Optional: make sure login opens with teacher role
        } else {
            console.error("Registration failed:", result.message);
            setShowPopupMessage("Registration failed: "+result.message);
            setShowPopup(true);
        }
    };

    return(
        <div className="h-screen max-md:h-fit w-full flex justify-center items-center max-md:px-2 max-md:py-8">
            <div className="p-5 shadow-lg border-1 border-gray-200 dark:border-gray-700 rounded-xl dark:black grid grid-cols-2 max-md:grid-cols-1 gap-3">
                <div className=" animate-[fadeInStudent_1s_ease-in-out_forwards]">
                    <div className="grid grid-cols-2 grid-rows-3 gap-2 p-3">
                        <div className="col-span-2 gap-1 grid grid-cols-6">
                            <div className="col-span-1 flex justify-center items-center">
                                <img src={usernameImg[themeMode]} className="h-7"></img>
                            </div>
                            <div className="col-span-5">
                                <input className="bg-white dark:bg-black dark:text-white w-full focus:outline-0 px-2 py-1 border-b-1 border-gray-300 focus:border-black dark:focus:border-white transition:focus duration-300" placeholder="Username" id="username" onChange={handleInputChanges} value={username}></input>
                            </div>
                        </div>
                        <div className="col-span-2 gap-1 grid grid-cols-6">
                            <div className="col-span-1 flex justify-center items-center">
                                <img src={passwordImg[themeMode]} className="h-6"></img>
                            </div>
                            <div className="col-span-5 relative">
                                <input className="bg-white dark:bg-black dark:text-white w-full focus:outline-0 py-1 px-2 pr-9 border-b-1 border-gray-300 focus:border-black dark:focus:border-white transition:focus duration-300" 
                                placeholder="Password" type={showPassword?'text':'password'} id="password" onChange={handleInputChanges} value={password}></input>
                                <img src={showPassword?eye_onImg[themeMode]:eye_offImg[themeMode]} className="h-5 absolute right-0 bottom-0 mr-2 mb-1"
                                    onClick={()=>{setShowPassword(!showPassword)}}
                                ></img>
                            </div>
                        </div>
                        <div className="col-span-2 gap-1 grid grid-cols-6">
                            <div className="col-span-1 flex justify-center items-center">
                                <img src={passwordImg[themeMode]} className="h-6"></img>
                            </div>
                            <div className="col-span-5 relative">
                                <input className="bg-white dark:bg-black dark:text-white w-full focus:outline-0 py-1 px-2 pr-9 border-b-1 border-gray-300 focus:border-black dark:focus:border-white transition:focus duration-300" 
                                placeholder="Confirm Password" type={showConfirmPassword?'text':'password'} id="confirmPassword" onChange={handleInputChanges} value={confirmPassword}></input>
                                <img src={showConfirmPassword?eye_onImg[themeMode]:eye_offImg[themeMode]} className="h-5 absolute right-0 bottom-0 mr-2 mb-1"
                                    onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}
                                ></img>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 mt-2 px-5 text-md text-black dark:text-white">
                        {role=="student"?
                            <div className="px-4 py-1 bg-red-400 rounded-full"
                            onClick={()=>setRole("student")}>Student</div>
                            :
                            <div className="border-1 px-4 py-1 hover:bg-red-400  rounded-full"
                            onClick={()=>setRole("student")}>Student</div>
                        }
                        {role=="teacher"?
                                <div className="px-4 py-1 bg-red-400 rounded-full"
                                onClick={()=>setRole("teacher")}>Teacher</div>
                                :
                                <div className="border-1 px-4 py-1 hover:bg-red-400 rounded-full"
                                onClick={()=>setRole("teacher")}>Teacher</div>
                            }
                    </div>
                    <div className="w-full mt-5 mb-2 flex flex-col gap-3 justify-center items-center">
                        <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black  hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full py-1 rounded-full transition:hover duration-300"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                        {/* <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black  hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full py-1 rounded-full transition:hover duration-300">Continue With Google</button> */}
                    </div>
                </div>
                <div className="h-full w-full flex items-center justify-center flex-col gap-1 animate-[fadeInStudent_1s_ease-in-out_forwards]">
                    <img src={notesImg} className="h-50 w-50 object-cover" draggable={false}></img>
                    <p className="text-black dark:text-white">Already have a accout? <b className="cursor-pointer underline text-red-300" onClick={()=>{setCurrentPage("login")}}>login</b></p>
                </div>
            </div>
        </div>
    )
}
export default Register;
