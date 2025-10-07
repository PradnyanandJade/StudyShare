# StudyShare
StudyShare– Classroom Notes Management System Developed a role-based web application enabling seamless collaboration between teachers and students.


```text
Frontend
 ├── User Interface (React)
 │    └── AuthContext / ThemeContext
 │         └── Pages
 │              ├── Login
 │              ├── Register
 │              ├── HomeStudent
 │              ├── HomeTeacher
 │              └── StudentsClassView
 │                   └── Components (Header, etc.)
 │                        └── API Calls → Backend API
 │
Backend
 ├── Express.js Server
 │    └── Routes
 │         └── Controllers
 │              ├── Middleware (JWT, Permit)
 │              ├── Database (MySQL)
 │              │    └── Tables: users, classes, class_members, notes, requests
 │              └── Uploads (multer, uploads folder)
