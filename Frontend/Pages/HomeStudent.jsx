import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";
import StudentClassView from "./StudentsClassView.jsx";

function Home() {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { user } = useAuth();
    const [classesData, setClassesData] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);

    // Fetch all classes for the student
    useEffect(() => {
        if (!user) return;
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}class/getClassesOfStudent`, {
                    params: { user_id: user.user_id },
                    withCredentials: true,
                });
                setClassesData(res.data?.data || []);
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };
        fetchClasses();
    }, [BACKEND_URL, user]);

    // Fetch students of a selected class
    const fetchStudents = async (class_code) => {
        try {
            const res = await axios.get(`${BACKEND_URL}class/getStudentsOfClass`, {
                params: { class_code: class_code },
                withCredentials: true,
            });
            setStudents(res.data?.data || []);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    // Handle "View Class" button
    const handleViewClass = (c) => {
        setSelectedClass(c);
        fetchStudents(c.class_code);
    };

    
    return (
        <div className="py-8 pt-14 min-h-screen bg-gray-50 dark:bg-gray-900 px-15 max-md:px-3">
            {!selectedClass ? (
                <>
                    <h1 className="text-3xl font-extralight text-gray-800 dark:text-white mb-6 mt-5">
                        Your Classes
                    </h1>
                    {classesData.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">
                            You are not enrolled in any classes yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {classesData.map((c) => (
                                <div
                                    key={c.class_code}
                                    className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-sm"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {c.class_name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Code:</span> {c.class_code}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Teacher:</span> {c.teacher_name}
                                    </p>
                                    <button
                                        onClick={() => handleViewClass(c)}
                                        className="mt-auto text-white dark:text-black border-1 border-transparent bg-black dark:bg-white hover:bg-white hover:text-black hover:border-black  hover:dark:bg-black hover:dark:text-white hover:dark:border-1 hover:dark:border-white w-full rounded-full transition:hover font-semibold py-1.5 duration-300"
                                    >
                                        View Class
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <StudentClassView
                    selectedClass={selectedClass}
                    students={students}
                    onBack={() => setSelectedClass(null)}
                />
            )}
        </div>
    );
}

export default Home;
