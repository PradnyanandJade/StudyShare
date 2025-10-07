# StudyShare 
A role-based web app where teachers manage classes and notes, and students access enrolled class notes.  
Implemented secure JWT authentication with refresh tokens and a production-ready backend.
Students : 
- Support peers by sharing your notes
- Earn exciting rewards from teachers
Teachers :
- Check Notes Provided By Students
- Provide Rewards To Students


## Class Diagram
<img width="643" height="522" alt="image" src="https://github.com/user-attachments/assets/2fdd1616-528f-4d54-8217-a08b75a83062" />

## Demonstration

## Dark Theme

## Register New User
<img width="1918" height="859" alt="image" src="https://github.com/user-attachments/assets/7a1ffeb3-c169-4b2a-ad89-6681c884e81d" />

## Login Student
<img width="1918" height="852" alt="image" src="https://github.com/user-attachments/assets/0973d5a4-d2b1-4a76-8ff7-994e755cacc4" />

## Login Teacher
<img width="1917" height="858" alt="image" src="https://github.com/user-attachments/assets/7beeaeae-8877-491d-beb5-a788d8ff65fb" />

## Student Home Page
<img width="1918" height="865" alt="image" src="https://github.com/user-attachments/assets/6a0619c0-0cf0-4b5a-aada-057e6ec7f295" />

## Student Class 
<img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/edf64ac8-9376-441a-bb87-e94b16181c8a" />

## Teacher Home Page
<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/a3e50f12-5a6e-4edd-a426-f92c748d368f" />

## Teacher Class View
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/3d213232-e291-4542-b5a9-bbe2070a9ebd" />

## Light Theme

## Register New User
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/e7840e37-5541-4926-b6d0-898a2d46ba35" />

## Login Student
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/efe5bd9d-1c36-4fd3-b3cf-14f44d6730ae" />

## Login Teacher
<img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/fe53170c-728a-4978-9705-adeac6312df2" />

## Student Home Page
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/35b07025-7424-423a-9520-22e2d428bbbb" />

## Student Class View
<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/58ada0f2-02eb-4442-b2e5-43efb3891614" />

## Teacher Home Page
<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/ba25c490-d2c2-4627-a1a9-fc88ff4e963a" />

## Teacher Class View
<img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/a5c6851d-ea3f-4a39-b173-68280ee5e46f" />

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
