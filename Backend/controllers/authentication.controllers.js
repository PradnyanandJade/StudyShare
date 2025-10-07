import express from 'express';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const generateTokens = (user) => {
    const payload = { user_id: user.id, username: user.username, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_DURATION_STRING || '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION_STRING || '7d',
    });
    return { accessToken, refreshToken };
};


export const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [existingUser] = await db.query('SELECT * FROM users WHERE username=?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users(username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        const user = { id: result.insertId, username, role };
        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token in DB (optional, for logout/invalidation)
        await db.query('UPDATE users SET refresh_token=? WHERE id=?', [refreshToken, user.id]);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE, 10) 
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE, 10) 
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: user.id, username, role },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const [rows] = await db.query('SELECT * FROM users WHERE username=?', [username]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = rows[0];
        if (user.role !== role)
            return res.status(403).json({ message: 'Incorrect role for this username' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token
        await db.query('UPDATE users SET refresh_token=? WHERE id=?', [refreshToken, user.id]);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  parseInt(process.env.JWT_COOKIE_MAX_AGE, 10)
            
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE, 10) 
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed: ' + err.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        console.log("Logging out")
        const { user_id } = req.user;
        // Invalidate the refresh token in the database
        await db.query('UPDATE users SET refresh_token=NULL WHERE id=?', [user_id]);

        // MUST include the same options used to set the cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.clearCookie('token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Logout failed: ' + err.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

        // Check if token exists in DB
        const [userRows] = await db.query('SELECT * FROM users WHERE refresh_token=?', [refreshToken]);
        if (userRows.length === 0) return res.status(403).json({ message: 'Invalid refresh token' });

        const user = userRows[0];

        // Verify and rotate
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Update new refresh token in DB
        await db.query('UPDATE users SET refresh_token=? WHERE id=?', [newRefreshToken, user.id]);

        // Set new cookies
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  parseInt(process.env.JWT_COOKIE_MAX_AGE, 10) 
        });

        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge:  parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE, 10)
        });

        return res.json({ success: true, message: 'Access token refreshed successfully' });
    } catch (error) {
        return res.status(403).json({ message: 'Refresh failed: ' + error.message });
    }
};


export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // If verification is successful, send success response
            return res.json({ success: true, user: decoded });
        } catch (err) {
            // Token has expired
            if (err.name === "TokenExpiredError") {
                const refreshToken = req.cookies.refresh_token;
                if (!refreshToken) return res.status(401).json({ success: false, message: "Session expired, no refresh token" });

                try {
                    const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                    const [userRows] = await db.query("SELECT * FROM users WHERE id=? AND refresh_token=?", [decodedRefresh.user_id, refreshToken]);

                    if (userRows.length === 0) {
                        // Refresh token is invalid or not found
                        res.clearCookie('token');
                        res.clearCookie('refresh_token');
                        return res.status(401).json({ success: false, message: "Invalid refresh token" });
                    }

                    const user = userRows[0];
                    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

                    // Update new refresh token in DB
                    await db.query("UPDATE users SET refresh_token=? WHERE id=?", [newRefreshToken, user.id]);

                    // Set new cookies
                    res.cookie("token", accessToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: process.env.NODE_ENV === "production",
                        maxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE, 10),
                    });
                    res.cookie("refresh_token", newRefreshToken, {
                        httpOnly: true,
                        sameSite: "strict",
                        secure: process.env.NODE_ENV === "production",
                        maxAge: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE, 10),
                    });

                    // Token refreshed successfully
                    return res.json({ success: true, user: decodedRefresh });
                } catch (refreshErr) {
                    // Refresh token expired or is invalid
                    res.clearCookie('token');
                    res.clearCookie('refresh_token');
                    return res.status(401).json({ success: false, message: "Invalid refresh token" });
                }
            }

            // Some other error occurred with the token
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    } catch (err) {
        // Handle unexpected errors
        return res.status(500).json({ success: false, message: "Server error: " + err.message });
    }
};

