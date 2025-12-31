import express from "express"
import z from "zod"
import jwt from "jsonwebtoken"
import { UserModel } from "./db"
import 'dotenv/config'

const user = express.Router()

const signinBody = z.object({
    email : z.string(),
    password : z.string()
})

user.post('/signin',async (req,res)=>{
    const parseBody = signinBody.safeParse(req.body)
    if(parseBody.error){
        return res.status(403).json({
            message : 'user data not valid'
        })
    }
    const { email , password } = req.body
    const user = await UserModel.findOne({
        email,
        password
    })
    if(!user){
        return res.status(403).json({
            message : 'user does not exist'
        })
    }
    const token = jwt.sign({id : user._id},process.env.JWT_SECRET || '')
    res.json({
        message : 'user login successfully',
        token : token
    })
})

const signupBody = z.object({
    email : z.string(),
    password : z.string(),
    username : z.string()
})

user.post('/signup',async (req,res)=>{
    const parseBody = signupBody.safeParse(req.body) 
    if(parseBody.error){
        return res.status(403).json({
           message : 'user data not valid'
        })
    }
    const {email,username,password} = req.body
    const alreadyExist = await UserModel.findOne({
        email,
        password
    })
    if(alreadyExist){
        return res.status(403).json({
            message : 'user already exist'
        })
    }
    const user = await UserModel.create({
        username,
        password,
        email
    })
    const token = jwt.sign({id : user._id},process.env.JWT_SECRET || '')
    res.json({
        message : 'user signup successfully',
        token : token
    })
})

export default user 