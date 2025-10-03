import express from 'express';
const router = express.Router();
import jwtAuthenticator from '../middleware/jwt.middleware.js';
import {uploadNotes,requestNotes,getAllRequestsInClass,removeRequestInClass,getNotesInClass} from '../controllers/notes.controllers.js';
import { upload } from '../config/multer.js';


router.post('/upload',jwtAuthenticator,upload.single('file'),uploadNotes);
router.post('/request',jwtAuthenticator,requestNotes);
router.get('/requestsInClass',jwtAuthenticator,getAllRequestsInClass);
router.delete('/removeRequestsInClass',jwtAuthenticator,removeRequestInClass);
router.get('/all',jwtAuthenticator,getNotesInClass);

export default router;
