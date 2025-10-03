import express from 'express';
import db from '../config/db.js';

export const uploadNotes = async (req,res) => {
    try {
        const user = req.user;
        const class_code = req.body.class_code;
        const [classRow] = await db.query("SELECT class_id FROM classes WHERE class_code = ?", [class_code]);
        if (!classRow || classRow.length === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const class_id = classRow[0].class_id;
        const uploader_id = req.body.user_id || user.user_id;
        const topic=req.body.topic;
        const URL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const time = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        const timestamp = time.getFullYear()+"-"+pad(time.getMonth()+1)+"-"+pad(time.getDate())+" "+pad(time.getHours())+":"+pad(time.getMinutes())+":"+pad(time.getSeconds());
        await db.query("INSERT INTO notes(class_id,uploader_id,topic,URL,timestamp) VALUES(?,?,?,?,?)",[class_id,uploader_id,topic,URL,timestamp]);
        return res.json({
            success:true,
            message:'File uploaded successfully!',
            URL:URL
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"(/upload failed)"+error
        });
    }
};


export const requestNotes = async (req,res)=>{
    try {
        const user = req.user;
        if(!user) return res.status(403).json({
            success:false,
            message:"User not authorized"
        });
        const class_id=req.body.class_id;
        const topic=req.body.topic;
        const requestor_id=user.user_id;
        const [prev] = await db.query("SELECT * FROM requests WHERE class_id=? AND topic=? AND requestor_id=?",[class_id,topic,requestor_id]);
        if(prev.length>0){
            return res.status(403).json({
                success:false,
                message:"You have already requested for notes on given topic in the same class"
            });
        }
        await db.query("INSERT INTO requests(topic,class_id,requestor_id) VALUES(?,?,?)",[topic,class_id,requestor_id]);
        return res.status(200).json({
            success:true,
            message:`Requestor id : ${requestor_id} requested notes on topic ${topic} on class_id: ${class_id} Successfully.`
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"+error
        });
    }
};

export const getAllRequestsInClass = async (req,res) =>{
    try {
        const class_id = req.body.class_id;
        const[rows]=await db.query("SELECT * FROM requests WHERE class_id=?",[class_id]);
        return res.status(200).json({
            success:true,
            message:`Fetced all requests from class_id : ${class_id}`,
            data:rows
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error "+error
        });
    }
};

export const removeRequestInClass = async(req,res) =>{
    try {
        const class_id = req.body.class_id; 
        const topic = req.body.topic; 
        const [rows] = await db.query("SELECT * FROM requests WHERE class_id=? AND topic=?",[class_id,topic]);
        if(rows.length==0){
            return res.status(403).json({
                success:false,
                message:"User request not found"
            });
        }
        await db.query("DELETE FROM requests WHERE class_id=? AND topic=?",[class_id,topic]);
        return res.status(200).json({
            success:true,
            message:`Removed -> Class id : ${class_id} topic : ${topic}`
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"+error
        });
    }
};

export const getNotesInClass = async (req,res) => {
    try {
        const class_code=req.query.class_code;

        const [classRow] = await db.query("SELECT class_id FROM classes WHERE class_code = ?", [class_code]);
        if (!classRow || classRow.length === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
        }
        const class_id = classRow[0].class_id;
        const [row] = await db.query('SELECT * FROM notes WHERE class_id=?',[class_id]);
        console.log(row);
        if(row.length===0){
            return res.status(404).json({
                'success':false,
                'message':`No notes in this class`,
                data:[]
            });
        }
        return res.status(200).json({
            'success':true,
            'message':`Notes from class code : ${class_code} are fetched `,
            data:row
        });
    } catch (error) {
        return res.status(500).json({
            'success':false,
            'message':"Internal Server Error "+error
        });
    }
};