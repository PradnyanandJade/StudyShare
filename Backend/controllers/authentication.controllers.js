import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUser = async (req , res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = req.body.role;
        if(!username || !password || !role){
            return res.status(403).json({
                success:false,
                message:"All fields are compulsory to fill before requesting backend"
            });
        }
        const [rows] = await db.query('SELECT * FROM users WHERE username=?',[username]);
        if(rows.length>0){
            return res.status(403).json({
                success : false,
                message:"User with given username already found. Choose Different Username."
            });
        }
        const hashPassword = await bcrypt.hash(password,10);
        const[result] = await db.query("INSERT INTO users(username,password,role) VALUES(?,?,?)",[username,hashPassword,role]);
        const user_id = result.insertId;
        const jwt_token = await jwt.sign({
            username:username,
            user_id:user_id,
            role:role
        },process.env.JWT_SECRET,{expiresIn:process.env.JWT_TOKEN_DURATION_STRING});
        const jwt_refresh_token = await jwt.sign({
            username:username,
            user_id:user_id,
            role:role
        },process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_TOKEN_DURATION_STRING});
        res.cookie("token",jwt_token,{
            httpOnly:true, // cannot be accessed via JS
            secure:process.env.NODE_ENV === "production", // set true in production with HTTPS
            sameSite:'strict',// CSRF protection
            maxAge:15*60*1000 // 15min
        });
        res.cookie("refresh_token",jwt_refresh_token,{
            httpOnly:true, // cannot be accessed via JS
            secure:process.env.NODE_ENV === "production", // set true in production with HTTPS
            sameSite:'strict',// CSRF protection
            maxAge:7*24*60*60*1000 // 7day
        });
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user_id:user_id,
            username:username
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error - "+error
        });
    }
}


export const loginUser = async (req , res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = req.body.role;
        if(!username || !password || !role){
            return res.status(403).json({
                success:false,
                message:"All fields are compulsory to fill before requesting backend"
            });
        }
        const [rows] = await db.query("SELECT * FROM users WHERE username=?",[username]);
        if(rows.length == 0){
            return res.status(404).json({
                success:false,
                message:"There is no user registered with given username"
            });
        }
        if(role!=rows[0].role){
            return res.status(403).json({
                success:false,
                message:"Username is not suitable for given role"
            });
        }
        const hashedPassword = rows[0].password;
        const isCorrectPassword = await bcrypt.compare(password,hashedPassword);
        if(!isCorrectPassword){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            });
        }
        const jwt_token = await jwt.sign({
            username:username,
            user_id:rows[0].id,
            role:role
        },process.env.JWT_SECRET,{expiresIn:process.env.JWT_TOKEN_DURATION_STRING});
        const jwt_refresh_token = await jwt.sign({
            username:username,
            user_id:rows[0].id,
            role:role
        },process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_TOKEN_DURATION_STRING});
        res.cookie("token",jwt_token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'strict',
            maxAge:15*60*1000
        });
        res.cookie("refresh_token",jwt_refresh_token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        });
        return res.status(200).json({
            success:true,
            user_id:rows[0].id,
            username:username,
            message:"Logged In Successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message : '(/loginUser) failed : '+error
        });
    }
}

export const logoutUser = (req , res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // cookie only sent over HTTPS in prod
    sameSite: "strict",
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // cookie only sent over HTTPS in prod
    sameSite: "strict",
  });
  return res.status(200).json({
    success:true, 
    message: "Logged out successfully" 
});
}

export const refreshToken = async (req , res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) return res.status(401).json({
            success:false, 
            message: "No refresh token" 
            });
        let user;
        try {
            user = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(403).json({ 
                success:false,
                message: "Invalid refresh token" 
            });
        }
        const jwt_token=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:process.env.JWT_TOKEN_DURATION_STRING});
        res.cookie('token',jwt_token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:'strict',
            maxAge:15*60*1000
        })
        res.status(200).json({
            success:true,
            message:"New token generated from refresh token"
        });
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"(/refreshToken) failed : "+error
        })
    }
}