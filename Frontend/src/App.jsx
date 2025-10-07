import './App.css'
import Header from '../Components/Header.jsx';
import HomeStudent from '../Pages/HomeStudent.jsx';
import HomeTeacher from '../Pages/HomeTeacher.jsx';
import Login from '../Pages/Login.jsx';
import Register from '../Pages/Register.jsx';
import { useAuth } from '../Context/AuthContext.jsx';
import { useState,useEffect } from 'react';

function App() {
  const { auth, user } = useAuth();
  const [currentPage, setCurrentPage] = useState("login"); // "login" or "register"
  const [showPopup,setShowPopup] = useState(false);
  const [popupMessage,setShowPopupMessage] = useState("This is message"); 

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 4000); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [showPopup]);
  function popUpComponent(){
    return(
      <div className='z-200 absolute max-md:w-4/5 left-1/2 -translate-x-1/2 flex justify-center items-center mt-5 px-10 max-md:py-1 border-1 bg-white dark:bg-black dark:text-white dark:border-white  border-black  shadow-lg animate-[messagePopup_4s_ease-in-out_forwards] '>
        <p>{popupMessage}</p>
      </div>
    )
  }
  console.log(auth);
  return (
    <div className="w-full h-screen bg-white dark:bg-black">
      {showPopup&&popUpComponent()}
      {auth && <Header />}
      {auth ? (
        user?.role === "student" ? <HomeStudent setShowPopup={setShowPopup} setShowPopupMessage={setShowPopupMessage}/> : <HomeTeacher setShowPopup={setShowPopup} setShowPopupMessage={setShowPopupMessage}/>
      ) : (
        currentPage === "login" ? (
          <Login setCurrentPage={setCurrentPage} setShowPopup={setShowPopup} setShowPopupMessage={setShowPopupMessage}/>
        ) : (
          <Register setCurrentPage={setCurrentPage} setShowPopup={setShowPopup} setShowPopupMessage={setShowPopupMessage}/>
        )
      )}
    </div>
  );
}

export default App;
