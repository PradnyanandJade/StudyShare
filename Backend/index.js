import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import AuthenticationRouter from './routes/authentication.routes.js';
import NotesRouter from './routes/notes.routes.js';
import ClassesRouter from './routes/classes.routes.js';


dotenv.config();

const PORT = process.env.PORT;
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/uploads', express.static('uploads'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Routes
app.use('/authenticate',AuthenticationRouter);
app.use('/class',ClassesRouter);
app.use('/notes',NotesRouter);
// Routes

app.listen(PORT, (req , res) => {
    console.log(`Application Running on Port ${PORT}`);
})
