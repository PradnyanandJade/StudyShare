import express from 'express';
import jwtAuthenticator from '../middleware/jwt.middleware.js';
import checkPermission from '../middleware/permit.middleware.js';
import {createClass,findClassesOfTeacher,addOneStudentToClass,removeOneStudentFromClass,findClassesOfStudent,findStudentsInClass,removeClass} from '../controllers/classes.controllers.js';

const router = express.Router();

router.post('/create',jwtAuthenticator,checkPermission('teacher'),createClass);
router.get('/teacher',jwtAuthenticator,checkPermission('teacher'),findClassesOfTeacher);
router.post('/addStudent',jwtAuthenticator,checkPermission('teacher'),addOneStudentToClass);
router.delete('/removeStudent',jwtAuthenticator,checkPermission('teacher'),removeOneStudentFromClass);
router.get('/getClassesOfStudent',jwtAuthenticator,checkPermission('teacher','student'),findClassesOfStudent);
router.get('/getStudentsOfClass',jwtAuthenticator,findStudentsInClass);
router.delete('/removeClass',jwtAuthenticator,removeClass);

export default router;