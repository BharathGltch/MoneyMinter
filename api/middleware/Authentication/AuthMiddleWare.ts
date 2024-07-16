import  {v4 as uuidv4} from 'uuid';
import jwt, { JwtPayload } from "jsonwebtoken";
import {Request,Response, NextFunction } from "express";
import dotenv from "dotenv";

let JwtSecret=process.env.JWTSECRET?process.env.JWTSECRET:"";

export interface CustomRequest extends Request{
    userId:string
}

export interface MyJwtPayload extends JwtPayload{
    userId:string,
    
}

export default function videoReqAuth(req:Request,res:Response,next:NextFunction){
    let authToken=req.headers['authorization'];
    if(!authToken){
        let tempUserId=uuidv4();
       let token= jwt.sign({userId:tempUserId,loggeedIn:false},JwtSecret,{expiresIn:60*10});
        res.setHeader('token',token);
        next();
    }else{
        try{
        let token=authToken.split(" ")[1];
        let decoded=jwt.verify(token,JwtSecret) as MyJwtPayload;
        if(decoded && typeof decoded.userId=="string"){
        (req as CustomRequest).userId=decoded.userId;
        }else{
            throw new Error();
        }
        }catch(ex){
            res.status(404).json({
                message:"You dont have the authorization"
            })
        }


    }
}