import React from "react";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import {darkMode,lightMode,logoutImg} from '../src/assets/index.jsx';

function Header(){
  const { themeMode, darkTheme, lightTheme } = useTheme();
  const {unauthorize} = useAuth();

  return (
    <div className="fixed bg-white dark:bg-gray-950  top-0 w-full h-fit white:bg-red-500 py-4 px-15 max-md:px-3 shadow-sm dark:border-b-1 dark:border-white z-100">
        <div className="flex flex-row justify-between items-center">
            <div>
                <div className="text-black dark:text-white font-medium text-xl">📚 StudyShare</div>
            </div>
            <div className="flex flex-row gap-5 text-black dark:text-white">
                <div onClick={()=>{
                    themeMode==="dark"?
                    lightTheme():darkTheme()
                }}
                className="cursor-pointer hover:text-blue-600 duration-100"
                >
                    <img src={themeMode==="dark"?lightMode:darkMode} className="h-7"></img>
                </div>
                <div
                    onClick={()=>{unauthorize()}}
                    className="hover:text-red-600 cursor-pointer duration-300 flex justify-center items-center"
                ><img src={logoutImg} className="h-5.5"></img></div>
            </div>
        </div>
    </div>
  );
}

export default Header;
