import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export interface AuthRequest extends Request {
  userId?: string;
}

export async function middleware(req:AuthRequest,res:Response,next:NextFunction){
    const usertoken = req.headers.authorization
    if(!usertoken || !usertoken.startsWith('Task')){
        return res.json({
            message : 'user not authorized'
        })
    }
    const token = usertoken.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}