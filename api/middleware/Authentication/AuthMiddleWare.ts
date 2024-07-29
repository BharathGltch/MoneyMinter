import  {v4 as uuidv4} from 'uuid';
import jwt, { JwtPayload } from "jsonwebtoken";
import {Request,Response, NextFunction } from "express";
import dotenv from "dotenv";
import { checkIfUserOwnsVideo } from '../../drizzle/dbUtil/dbUtil.js';
dotenv.config();
let JwtSecret=process.env.JWTSECRET?process.env.JWTSECRET:"";

export interface CustomRequest extends Request{
    userId:string
}

export interface MyJwtPayload extends JwtPayload{
    userId:string,
}

export async function videoReqAuth(req:Request,res:Response,next:NextFunction){
    
    let videoId=req.params.videoId;
    console.log("videoId is",videoId);
    if(!videoId){
        res.status(404).json({message:"No videoId"});
    }
    let authToken=req.headers['authorization'];
    console.log("authtoken",authToken);
    if(!authToken){
       res.status(401).json({message:"You are not authorized"});
       
    }else{
        try{
        let token=authToken.split(" ")[1];
        let decoded=jwt.verify(token,JwtSecret) as MyJwtPayload;
        
        if(decoded && typeof decoded.userId=="string"){
            //check if the userId and videoId match
        let result= await checkIfUserOwnsVideo(videoId,decoded.userId);
        if(!result){
            res.status(401).json({message:"you are unauthorized"});
            next();
        }

        (req as CustomRequest).userId=decoded.userId;
        next();
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

export function checkAndGiveUserId(req:Request,res:Response,next:NextFunction){
   let authToken=req.headers["authorization"];
   if(!authToken){
    let tempUserId=uuidv4();
    (req as CustomRequest).userId=tempUserId;
   let token= jwt.sign({userId:tempUserId,loggedIn:false},JwtSecret,{expiresIn:60*10});
    res.setHeader('token',token);
    next();
   }else{
    try{
        let token=authToken.split(" ")[1];
        let decoded=jwt.verify(token,JwtSecret) as MyJwtPayload;
        if(decoded && typeof decoded.userId=="string"){
        (req as CustomRequest).userId=decoded.userId;
        next();
        }
    }catch(ex){
        res.status(401).json({
            message:"You dont have the authorization"
        })
    }
   }
}