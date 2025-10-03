# StudyShare
- Classroom Notes Management System Developed a role-based web application enabling seamless collaboration between teachers and students.
- Built a role-based web app where teachers manage classes and notes, and students access enrolled class
notes 
- implemented secure JWT authentication with refresh tokens and production-ready backend.

## Class Diagram Of Backend : 
<img width="863" height="645" alt="image" src="https://github.com/user-attachments/assets/b436eb72-53e2-4cd1-aacd-46eac153be08" />

Frontend
 ├─ User Interface (React)
 │   └─ AuthContext / ThemeContext
 │        └─ Pages
 │             ├─ Login
 │             ├─ Register
 │             ├─ HomeStudent
 │             ├─ HomeTeacher
 │             └─ StudentsClassView
 │                  └─ Components (Header, etc.)
 │                       └─ API Calls → Backend API

Backend
 ├─ Express.js Server
 │   └─ Routes
 │        └─ Controllers
 │             ├─ Middleware (JWT, Permit)
 │             ├─ Database (MySQL)
 │             │    └─ Tables: users, classes, class_members, notes, requests
 │             └─ Uploads (multer, uploads folder)
