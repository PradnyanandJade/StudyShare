import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";

function HomeTeacher() {
    const { user,unauthorize } = useAuth();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newClassName, setNewClassName] = useState("");
    const [newClassCode, setNewClassCode] = useState("");
    const [addStudentUsername, setAddStudentUsername] = useState("");

    useEffect(() => {
        fetchClasses();
    }, []);

    // Fetch teacher classes
    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}class/teacher`, { withCredentials: true });
            setClasses(res.data.classes || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch students + notes for a class
   const fetchClassDetails = async (class_code) => {
        try {
            const studentsRes = await axios.get(`${BACKEND_URL}class/getStudentsOfClass`, {
                params: { class_code },
                withCredentials: true,
            });
            setStudents(studentsRes.data.data || []);

            const notesRes = await axios.get(`${BACKEND_URL}notes/all`, {
                params: { class_code },
                withCredentials: true,
            });
            setNotes(notesRes.data.data || []);

        } catch (err) {
             if (err.response?.status === 401 || err.response?.status === 403) {
                    unauthorize();  // from useAuth()
            } else {
                console.error("Error fetching classes:", err);
            }
            console.error("Error fetching class details:", err);
        }
    };

    // Add class
    const handleAddClass = async () => {
        if (!newClassName || !newClassCode) return alert("Fill all fields");
        try {
            await axios.post(`${BACKEND_URL}class/create`,
                { class_name: newClassName, class_code: newClassCode },
                { withCredentials: true }
            );
            setNewClassName(""); setNewClassCode("");
            fetchClasses();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // Remove class
    const handleRemoveClass = async (class_id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BACKEND_URL}class/removeClass`, {
                params: { class_id },
                withCredentials: true
            });
            fetchClasses();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // Add student
    const handleAddStudent = async (class_code) => {
        if (!addStudentUsername) return;
        try {
            await axios.post(`${BACKEND_URL}class/addStudent`,
                { username: addStudentUsername, class_code },
                { withCredentials: true }
            );
            setAddStudentUsername("");
            fetchClassDetails(class_code);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // Remove student
    const handleRemoveStudent = async (class_code, student_id) => {
        if (!window.confirm("Remove this student?")) return;
        try {
            await axios.delete(`${BACKEND_URL}class/removeStudent`, {
                params: { class_code, student_id },
                withCredentials: true,
            });
            fetchClassDetails(class_code);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="py-8 pt-14 min-h-screen bg-gray-50 dark:bg-gray-900 px-15 max-md:px-3">
            {!selectedClass ? (
                <>
                    <h1 className="text-3xl font-extralight text-gray-800 dark:text-white mb-6 mt-5">
                        Your Classes
                    </h1>

                    {/* Add new class */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-3">
                        <input
                            className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring focus:ring-blue-300 outline-none"
                            placeholder="Class Name"
                            value={newClassName}
                            onChange={e => setNewClassName(e.target.value)}
                        />
                        <input
                            className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring focus:ring-blue-300 outline-none"
                            placeholder="Class Code"
                            value={newClassCode}
                            onChange={e => setNewClassCode(e.target.value)}
                        />
                        <button
                            onClick={handleAddClass}
                            className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                        >
                            Add Class
                        </button>
                    </div>

                    {/* Classes grid */}
                    {classes.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">
                            No classes created yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {classes.map(cls => (
                                <div
                                    key={cls.class_code}
                                    className="bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-sm"
                                >
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {cls.class_name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <span className="font-medium">Code:</span> {cls.class_code}
                                    </p>
                                    <div className="mt-auto flex gap-2">
                                        <button
                                            onClick={() => { setSelectedClass(cls); fetchClassDetails(cls.class_code); }}
                                            className="flex-1 text-white dark:text-black bg-black dark:bg-white border border-transparent hover:bg-white hover:text-black hover:border-black hover:dark:bg-black hover:dark:text-white hover:dark:border-white rounded-full transition font-semibold py-1.5"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleRemoveClass(cls.class_id)}
                                            className="flex-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-semibold py-1.5"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="mb-6 bg-black text-white px-4 py-1 mt-4 rounded-full duration-300 hover:bg-white hover:text-black border border-black transition"
                    >
                        ⮜  Back
                    </button>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                        {selectedClass.class_name} ({selectedClass.class_code})
                    </h2>

                    {/* Add student input */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-3">
                        <input
                            className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring focus:ring-blue-300 outline-none"
                            placeholder="Student Username"
                            value={addStudentUsername}
                            onChange={e => setAddStudentUsername(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddStudent(selectedClass.class_code)}
                            className="px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition"
                        >
                            Add Student
                        </button>
                    </div>

                    {/* Students with notes */}
                    <div className="grid gap-4">

                        {students.map(s => (
                            <div
                                key={s.id}
                                className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{s.username}</span>
                                    <button
                                        onClick={() => handleRemoveStudent(selectedClass.class_code, s.id)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Notes of this student */}
                                <div className="mt-3 space-y-2">
                                    {notes
                                        .filter(
                                            n =>
                                                Number(n.uploader_id) === Number(s.id) &&
                                                Number(n.class_id) === Number(selectedClass.class_id)
                                        )
                                        .map(n => (
                                            <div
                                                key={n.note_id}
                                                className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center"
                                            >
                                                <p className="text-sm dark:text-gray-200">{n.topic}</p>
                                                {n.URL && (
                                                    <button
                                                        onClick={() => window.open(n.URL, "_blank")}
                                                        className="ml-3 text-sm text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                    {notes.filter(
                                        n =>
                                            Number(n.uploader_id) === Number(s.id) &&
                                            Number(n.class_id) === Number(selectedClass.class_id)
                                    ).length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">No notes yet</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomeTeacher;
