import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(localStorage.getItem("themeMode") || "light");

  useEffect(() => {
      document.querySelector('html').classList.remove('light','dark');
      document.querySelector('html').classList.add(themeMode);
      localStorage.setItem("themeMode",themeMode);  
  }, [themeMode]);

  const darkTheme = () => setThemeMode("dark");
  const lightTheme = () => setThemeMode("light");

  return (
    <ThemeContext.Provider value={{ themeMode, darkTheme, lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
