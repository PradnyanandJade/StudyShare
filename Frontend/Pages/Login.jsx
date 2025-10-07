import React, { useEffect, useRef, useState } from "react";
import {passwordImg,usernameImg,eye_onImg,eye_offImg,settingImg, teacherImg, studentImg} from '../src/assets/index.jsx';
import { useTheme } from "../Context/ThemeContext";
import {useAuth} from '../Context/AuthContext.jsx';
import {darkMode,lightMode,logoutImg} from '../src/assets/index.jsx';


function Login({setCurrentPage,setShowPopup,setShowPopupMessage}){
    const {themeMode,darkTheme, lightTheme} = useTheme();
    const [role,setRole] = useState("student");
    const [showPassword,setShowPassword]=useState(false);
    const checkBoxRef=useRef();

    const {auth,setAuth,authorize,unauthorize,login,loading,error,setError} = useAuth();

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    function handleInputChanges(e){
        var id = e.target.id;
        if(id==="username"){
            setUsername(e.target.value);
        }
        if(id==="password"){
            setPassword(e.target.value);   
        }
    }

    useEffect(()=>{
        setUsername("");
        setPassword("");
        setError(null);
    },[role,setRole]);

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Please fill in all fields");
            setShowPopupMessage("Please fill in all fields")
            setShowPopup(true);
            return;
        }
        
        const result = await login(username, password, role);
        if (!result.success) {
            console.error("Login failed:", result.message);
            setShowPopupMessage(result.message)
            setShowPopup(true);
        }
    };

    function StudentLoginInfo(){
        return(
            <div className="text:black dark:text-white flex py-4 items-start flex-col animate-[fadeInStudent_1s_ease-in-out_forwards] ">
                <div>
                    <p className="text-shadow-gray-400 text-shadow-sm text-xl">Student Tasks</p>
                </div>
                <div className="relative flex flex-col justify-center items-start mt-4 text-sm w-full">
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1" />
                        <p>Request notes directly</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1" />
                        <p>Support peers by sharing your notes</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1" />
                        <p>Earn exciting rewards from teachers</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1 invisible" />
                        <p></p>
                    </div>
                    <div className="w-full mt-4 z-1">
                        <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white rounded-full transition:hover duration-300 w-full py-1.5" onClick={()=>{setCurrentPage("register")}}>Register </button>
                    </div>
                    <div className="absolute top-1 bottom-10  h-full w-fit right-0 flex justify-center items-center mt-5 max-md:mt-0 z-0">
                        <img src={studentImg} className="h-56 z-0 opacity-90 max-md:h-50"></img>
                    </div>
                </div>
            </div>
        );
    }
    function TeacherLoginInfo(){
        return(
            <div className="text:black dark:text-white flex py-4 items-start flex-col animate-[fadeInTeacher_1s_ease-in-out_forwards]">
                <div>
                    <p className="text-shadow-gray-400 text-shadow-sm text-xl">Teacher Tasks</p>
                </div>
                <div className="relative flex flex-col justify-center items-start mt-4 text-sm w-full">
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1 w-4 h-4 shrink-0" />
                        <p>Upload Notes For Students</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1 w-4 h-4 shrink-0" />
                        <p>Check Notes Provided By Students</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1 w-4 h-4 shrink-0" />
                        <p>Provide Rewards To Students</p>
                    </div>
                    <div className="flex gap-2 items-start z-1">
                        <img src={settingImg[themeMode]} className="mt-1 w-4 h-4 shrink-0 invisible" />
                        <p className="invisible">---------------------------------------------</p>
                    </div>
                    <div className="w-full mt-4 z-1">
                        <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full rounded-full transition:hover duration-300 p-1.5 max-md:w-full" onClick={()=>{setCurrentPage("register")}}>Register</button>
                    </div>
                    <div className="absolute top-1 bottom-10  h-full w-fit right-0 flex justify-center items-center mt-5 max-md:mt-0 z-0">
                        <img src={teacherImg} className="h-56 z-0 opacity-90 max-md:h-50 "></img>
                    </div>
                </div>
            </div>
        );
    }
    function changeRoleButton(){
        return(
            <>
                {role==="teacher"?
                    <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full py-1 rounded-full transition:hover duration-300" 
                        onClick={()=>setRole("student")}
                    >Student Login</button>
                :
                    <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full py-1 rounded-full transition:hover duration-300"
                        onClick={()=>setRole("teacher")}
                    >Teacher Login</button>
                }
            </>
        )
    }
    return(
        <div className="h-screen max-md:h-fit w-full flex justify-center items-center p-15 max-md:py-8 px-1 max-md:px-2"
        >
            <div onClick={()=>{
                themeMode==="dark"?lightTheme():darkTheme()
            }}  className="cursor-pointer hover:text-blue-600 duration-100 absolute top-20 max-md:top-0.5">
                <img src={themeMode==="dark"?lightMode:darkMode} className="h-7"></img>
            </div>

            <div className="p-5 shadow-lg border-1 border-gray-200 dark:border-gray-700 rounded-xl dark:black grid grid-cols-2  max-md:grid-cols-1 gap-5 max-md:gap-8">
                <div className="animate-[fadeInStudent_1s_ease-in-out_forwards]">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 p-3">
                        <div className="col-span-2 gap-1 grid grid-cols-6">
                            <div className="col-span-1 flex justify-center items-center">
                                <img src={usernameImg[themeMode]} className="h-7" />
                            </div>
                            <div className="col-span-5">
                                <input className="bg-white dark:bg-black dark:text-white w-full focus:outline-0 px-2 py-1 border-b-1 border-gray-300 focus:border-black dark:focus:border-white transition:focus duration-300" placeholder="Username" id="username" onChange={handleInputChanges} value={username} />
                            </div>
                        </div>
                        <div className="col-span-2 gap-1 grid grid-cols-6">
                            <div className="col-span-1 flex justify-center items-center">
                                <img src={passwordImg[themeMode]} className="h-6" />
                            </div>
                            <div className="col-span-5 relative">
                                <input className="bg-white dark:bg-black dark:text-white w-full focus:outline-0 py-1 px-2 pr-9 border-b-1 border-gray-300 focus:border-black dark:focus:border-white transition:focus duration-300" 
                                placeholder="Password" type={showPassword?'text':'password'} id="password" onChange={handleInputChanges} value={password} />
                                <img src={showPassword?eye_onImg[themeMode]:eye_offImg[themeMode]} className="h-5 absolute right-0 bottom-0 mr-2 mb-1"
                                    onClick={()=>{setShowPassword(!showPassword)}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start items-center gap-4 px-5 mt-4 text-sm text-black dark:text-white">
                        <div className="flex justify-center items-center">
                            <input ref={checkBoxRef} type="checkbox" defaultChecked={false} className="w-4 h-4 text-blue-900 bg-gray-100" />
                        </div>
                        <div onClick={()=>{
                            if(checkBoxRef.current){
                                checkBoxRef.current.checked=!checkBoxRef.current.checked
                            }
                        }}>
                            <p>Stay Signed In</p>
                        </div>
                        <div>
                            <p></p>
                        </div>
                    </div>
                    <div className="w-full mt-6 mb-2 flex flex-col gap-3 justify-center items-center">
                        <button className="text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full py-1 rounded-full transition:hover duration-300 max-md:mb-2 max-md:mt-2"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    {changeRoleButton()}
                </div>
                {role=="student"?StudentLoginInfo():TeacherLoginInfo()}
            </div>
        </div>
    )
}
export default Login;