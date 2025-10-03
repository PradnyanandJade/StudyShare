import db from '../config/db.js';

export const createClass = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({
            success: false,
            message: "User not authorized"
        });
        const class_name = req.body.class_name;
        const class_code = req.body.class_code;
        const teacher_id = user.user_id;
        const [prev] = await db.query('SELECT * FROM classes WHERE teacher_id=? AND class_name=? AND class_code=?', [teacher_id, class_name, class_code]);
        if (prev.length > 0) {
            return res.status(403).json({
                success: false,
                message: "Class of given teacher is already present with same name"
            });
        }
        console.log(prev);
        console.log(class_code + class_name + teacher_id)
        const [rows] = await db.query('INSERT INTO classes(teacher_id,class_name,class_code) VALUES(?,?,?)', [teacher_id, class_name, class_code]);
        return res.status(200).json({
            success: true,
            message: "Created Class Successfully",
        });
    } catch (error) {
        return res.status(500).json({ 'error': "Internal Server Error" + error });
    }
};

export const addOneStudentToClass = async (req, res) => {
    try {
        const user = req.user;
        const username = req.body.username;
        const class_code = req.body.class_code;
        const [classRows] = await db.query("SELECT class_id FROM classes WHERE class_code=?", [class_code]);

        if (classRows.length === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        console.log(classRows);
        const class_id = classRows[0].class_id;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authorized"
            });
        }

        // Check if the student exists and has role 'student'
        const [students] = await db.query(
            "SELECT id FROM users WHERE username=? AND role='student'",
            [username]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No student found with username: ${username}`
            });
        }

        const student_id = students[0].id;

        // Check if the student is already in the class
        const [prev] = await db.query(
            "SELECT * FROM class_members WHERE class_id=? AND student_id=?",
            [class_id, student_id]
        );

        if (prev.length > 0) {
            return res.status(403).json({
                success: false,
                message: "The student is already enrolled in this class"
            });
        }

        // Add student to class
        await db.query(
            "INSERT INTO class_members(class_id, student_id) VALUES(?, ?)",
            [class_id, student_id]
        );

        return res.status(200).json({
            success: true,
            message: `Student '${username}' added to class id ${class_id} successfully`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error
        });
    }
};


export const removeOneStudentFromClass = async (req, res) => {
    try {
        const user = req.user;
        const student_id = req.query.student_id;
        const class_code = req.query.class_code;
        const [classRows] = await db.query("SELECT class_id FROM classes WHERE class_code=?", [class_code]);
        if (classRows.length === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const class_id = classRows[0].class_id;
        if (!user) return res.status(401).json({
            success: false,
            message: "User not authorized"
        });
        const [prev] = await db.query("SELECT * FROM class_members WHERE class_id=? AND student_id=?", [class_id, student_id]);
        if (prev.length == 0) {
            return res.status(403).json({
                success: false,
                message: "The Student you are trying to remove from the class is already not found in the class"
            });
        }
        await db.query("DELETE FROM class_members WHERE class_id=? AND student_id=?", [class_id, student_id]);
        return res.status(200).json({
            success: true,
            message: `Student id: ${student_id} is removed from class id : ${class_id} successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error" + error
        });
    }
}

export const findClassesOfTeacher = async (req, res) => {
    try {
        const user = req.user || req.body.teacher_id;
        if (!user) return res.status(401).json({
            success: false,
            message: "User not authorized"
        });
        const [rows] = await db.query("SELECT * FROM classes WHERE teacher_id=?", [user.user_id]);
        return res.status(200).json({
            success: true,
            count: rows.length,
            classes: rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error" + error
        });
    }
};

export const findClassesOfStudent = async (req, res) => {
    try {
        const student_id = req.query.user_id;
        const [row] = await db.query("SELECT c.class_name AS class_name,c.class_code AS class_code,ut.username AS teacher_name FROM class_members AS cm INNER JOIN classes AS c ON cm.class_id=c.class_id INNER JOIN users AS ut ON c.teacher_id=ut.id WHERE cm.student_id=?", [student_id])
        if (row.length == 0) {
            return res.status(403).json({
                'success': false,
                message: 'Student is not registered to any class',
                data: []
            });
        }
        return res.status(200).json({
            'success': true,
            message: `list of all classes information for student_id:${student_id} is fetched`,
            data: row
        });
    } catch (error) {
        return res.status(500).json({
            'success': false,
            'message': "Internal Server Error" + error
        })
    }
};

export const findStudentsInClass = async (req, res) => {
    try {
        const class_code = req.query.class_code;
        const [classRows] = await db.query("SELECT class_id FROM classes WHERE class_code=?", [class_code]);
        if (classRows.length === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const class_id = classRows[0].class_id;
        const [row] = await db.query("SELECT u.username,u.id FROM class_members AS c INNER JOIN users AS u ON c.student_id=u.id WHERE c.class_id=?", [class_id]);
        if (row.size == 0) {
            return res.status(200).json({
                'success': true,
                message: 'There are no students in given class',
                data: []
            });
        }
        return res.status(200).json({
            'success': true,
            message: 'Students in class are fetched',
            data: row
        });
    } catch (error) {
        return res.status(500).json({
            'success': false,
            'message': "Internal Server Error " + error
        });
    }
};

export const removeClass = async (req, res) => {
    try {
        const { class_id } = req.query; // or req.body, depending on how you send it
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authorized",
            });
        }

        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required",
            });
        }

        // Optional: ensure only the teacher who created the class can delete it
        const [check] = await db.query(
            "SELECT * FROM classes WHERE class_id = ? AND teacher_id = ?",
            [class_id, user.user_id]
        );

        if (check.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found or not owned by you",
            });
        }

        // Delete the class
        await db.query("DELETE FROM notes WHERE class_id = ?", [class_id]);
        await db.query("DELETE FROM class_members WHERE class_id = ?", [class_id]);
        await db.query("DELETE FROM classes WHERE class_id = ?", [class_id]);
        return res.json({
            success: true,
            message: "Class deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
