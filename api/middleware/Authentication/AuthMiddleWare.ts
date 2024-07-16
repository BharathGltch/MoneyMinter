import  {v4 as uuidv4} from 'uuid';
import jwt from "jsonwebtoken";
import {Request,Response, NextFunction } from "express";
import dotenv from "dotenv";

let JwtSecret=process.env.JWTSECRET?process.env.JWTSECRET:"";

export default function auth(req:Request,res:Response,next:NextFunction){
    let authToken=req.headers['authorization'];
    if(!authToken){
        let tempUserId=uuidv4();
       let token= jwt.sign({userId:tempUserId,loggeedIn:false},JwtSecret,{expiresIn:60*10});
        res.setHeader('token',token);
        next();
    }else{
        
    }
}