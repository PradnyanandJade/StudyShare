import express from 'express';
import jwtAuthenticator from '../middleware/jwt.middleware.js';
import {loginUser,registerUser,logoutUser,refreshToken,checkAuth} from '../controllers/authentication.controllers.js';

const router = express.Router();

// login , new user 

router.post('/login',loginUser);
router.post('/register',registerUser);
router.delete('/logout',jwtAuthenticator,logoutUser);
router.post('/refreshtoken',refreshToken);
router.get('/check', checkAuth);


export default router;