# StudyShare 
A role-based web app where teachers manage classes and notes, and students access enrolled class notes.  
Implemented secure JWT authentication with refresh tokens and a production-ready backend.

## Class Diagram
<img width="643" height="522" alt="image" src="https://github.com/user-attachments/assets/2fdd1616-528f-4d54-8217-a08b75a83062" />

## Directory Structure
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
