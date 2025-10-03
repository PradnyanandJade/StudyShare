# StudyShare
- Classroom Notes Management System Developed a role-based web application enabling seamless collaboration between teachers and students.
- Built a role-based web app where teachers manage classes and notes, and students access enrolled class
notes 
- implemented secure JWT authentication with refresh tokens and production-ready backend.

## Class Diagram Of Backend : 
<img width="863" height="645" alt="image" src="https://github.com/user-attachments/assets/b436eb72-53e2-4cd1-aacd-46eac153be08" />


## Screenshot
##Student Login
<img width="1918" height="866" alt="image" src="https://github.com/user-attachments/assets/4ee2fa4f-9286-4acd-87c7-c5d9826510c4" />
## Teacher Login
<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/373be9f0-5b3f-45a6-be69-1ee419d5947a" />
## Register User
<img width="1917" height="860" alt="image" src="https://github.com/user-attachments/assets/d719649d-32db-4efb-9a0b-019ca5ba6374" />
## Student Home
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/ad523b74-a132-46ec-87d0-d970ed218e92" />
## Student Class View
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/6f18889a-d8bc-4883-ac5f-69b2c3deb1d0" />
## Teacher Home 
<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/b278e195-cf48-47f5-a80b-77f9edd4f27c" />
## Teacher Class View
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/f3777454-1520-4566-a2e4-9ec091b99fb9" />





## Project Structure :

```text
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
