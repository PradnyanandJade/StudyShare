import jwt from 'jsonwebtoken';
import express from 'express';

const jwtAuthenticator = (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            res.status(401).json({ error: "Unauthorized - No token provided" });
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}

export default jwtAuthenticator;