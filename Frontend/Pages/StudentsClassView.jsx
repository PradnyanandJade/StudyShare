import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";

function StudentClassView({ selectedClass, students, onBack }) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { user } = useAuth();

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ topic: "", file: null });
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewPdf, setPreviewPdf] = useState(null);
    const [showStudents, setShowStudents] = useState(false);

    useEffect(() => {
        if (selectedClass) {
            fetchNotes(selectedClass.class_code);
        }
    }, [selectedClass]);

    const fetchNotes = async (class_code) => {
        try {
            const res = await axios.get(`${BACKEND_URL}notes/all`, {
                params: { class_code },
                withCredentials: true,
            });
            setNotes(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch notes", err);
        }
    };

    const handleUploadNote = async () => {
        if (!newNote.topic || !newNote.file) {
            alert("Please provide both topic and file");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("class_code", selectedClass.class_code);
            formData.append("topic", newNote.topic);
            formData.append("file", newNote.file);
            formData.append("uploader_id", user.user_id);

            await axios.post(`${BACKEND_URL}notes/upload`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Note uploaded successfully!");
            setNewNote({ topic: "", file: null });
            fetchNotes(selectedClass.class_code);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload note");
        } finally {
            setUploading(false);
        }
    };

    const isImageFile = (url) => /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
    const isPdfFile = (url) => /\.pdf$/i.test(url);

    return (
        <div className=" flex flex-col dark:bg-gray-900">
            {/* HEADER (fixed, not scrolling) */}
            <div className="flex flex-wrap gap-3 relative p-4 max-md:px-0 md:p-6 shrink-0">
                <button
                    onClick={onBack}
                    className="bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded-full text-sm transition"
                >
                    ⮜ Back To Classes
                </button>
                <button
                    onClick={() => setShowStudents(!showStudents)}
                    className="bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded-full text-sm transition"
                >
                    ⌕ Show Students
                </button>

                {showStudents && (
                    <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 p-3 rounded-lg shadow-lg h-60 w-64 overflow-y-auto scrollbar-hide">
                        {students.map((s) => (
                            <div
                                key={s.id}
                                className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {s.username}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CLASS INFO (fixed, not scrolling) */}
            <div className="px-4 max-md:px-0 md:px-6 shrink-0">
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-yellow-100 dark:bg-blue-950">
                    <h1 className="text-lg font-semibold dark:text-white">
                        {selectedClass.class_name} ({selectedClass.class_code})
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Teacher:{" "}
                        <span className="font-medium">{selectedClass.teacher_name}</span>
                    </p>
                </div>
            </div>

            {/* NOTES SECTION (only this scrolls) */}
            <div className="flex-1 overflow-y-auto px-4 max-md:px-0 md:px-6 mt-4 space-y-4 pb-28 max-md:mb-15">
                {notes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No notes uploaded yet.
                    </p>
                ) : (
                    notes.map((n) => {
                        const fileUrl = n.URL.startsWith("http")
                            ? n.URL
                            : `${BACKEND_URL}${n.URL}`;
                        return (
                            <div
                                key={n.note_id}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md transition"
                            >
                                <div className="text-sm dark:text-gray-200">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {students.find((s) => s.id === n.uploader_id)?.username ||
                                            "Unknown Student"}
                                    </span>{" "}
                                    uploaded <b>{n.topic}</b>
                                </div>
                                <div>
                                    {isImageFile(fileUrl) ? (
                                        <button
                                            onClick={() => setPreviewImage(fileUrl)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            (View Image)
                                        </button>
                                    ) : isPdfFile(fileUrl) ? (
                                        <button
                                            onClick={() => setPreviewPdf(fileUrl)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            (View PDF)
                                        </button>
                                    ) : (
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            (Download)
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })
                    
                )}
                
            </div>

            {/* UPLOAD BAR (fixed at bottom) */}
            <div className="fixed left-0 bottom-0 w-full bg-gray-200 border-t-3  dark:bg-gray-600 px-8 py-4">
                <div className="flex flex-col md:flex-row gap-5">
                    <input
                        type="text"
                        placeholder="Topic"
                        className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring focus:ring-blue-300 outline-none"
                        value={newNote.topic}
                        onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
                    />
                    <input
                        type="file"
                        className="text-sm text-gray-600 dark:text-gray-300"
                        onChange={(e) => setNewNote({ ...newNote, file: e.target.files[0] })}
                    />
                    <button
                        
                        className={`px-15 py-2 rounded-sm text-white  transition ${
                            uploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-700 hover:bg-green-700"
                        }`}
                        disabled={uploading}
                        onClick={handleUploadNote}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>

            {/* IMAGE PREVIEW */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-150"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-[90%] max-w-[95%] rounded-lg shadow-xl border-4 border-white"
                    />
                </div>
            )}

            {/* PDF PREVIEW */}
            {previewPdf && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-150"
                    onClick={() => setPreviewPdf(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-[90%] max-h-[90%] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <embed
                            src={previewPdf}
                            type="application/pdf"
                            className="w-[80vw] h-[90vh]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentClassView;
