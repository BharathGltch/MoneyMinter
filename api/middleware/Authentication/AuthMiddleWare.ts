
import jwt, { JwtPayload } from "jsonwebtoken";
import {Request,Response, NextFunction } from "express";
import dotenv from "dotenv";
import { checkIfUserOwnsVideo, registerTemporaryUser } from '../../drizzle/dbUtil/dbUtil.js';
dotenv.config();
let JwtSecret=process.env.JWTSECRET?process.env.JWTSECRET:"";

export interface CustomRequest extends Request{
    userId:string,
    token:string
}

export interface MyJwtPayload extends JwtPayload{
    userId:string,
}

export async function videoReqAuth(req:Request,res:Response,next:NextFunction){
    
    let videoId=req.params.videoId;
    console.log("videoId is",videoId);
    if(!videoId){
       return res.status(404).json({message:"No videoId"});
    }
    console.log("The headers are",req.headers);
    let authToken=req.headers["authorization"];
    
    console.log("authtoken",authToken);
    if(!authToken){
        console.log("Token is undefined");
        return res.status(404).json({message:"You are unauthorized"})
    }
    
        try{
        let token=authToken.split(" ")[1];
        console.log("The token after splitting is ",token);
        
        let decoded=jwt.verify(token,JwtSecret) as MyJwtPayload;
        console.log("decoded is",decoded);
        
        if(decoded && typeof decoded.userId=="string"){
            //check if the userId and videoId match
        let result= await checkIfUserOwnsVideo(videoId,decoded.userId);
        if(!result){
            res.status(401).json({message:"you are unauthorized"});
            next();
        }

        (req as CustomRequest).userId=decoded.userId;
        next();
        }
        }catch(ex:any){
            console.log("Inside catch");
            console.log("THe error is ",ex?.message)

          return  res.status(404).json({
                message:"You dont have the authorization"
            })
        }


    
}

export async  function checkAndGiveUserId(req:Request,res:Response,next:NextFunction){
   let authToken=req.headers["authorization"];
   if(!authToken){
   
    //create a temp user
    let tempUserId=await registerTemporaryUser();
    (req as CustomRequest).userId=tempUserId;
    let token= jwt.sign({userId:tempUserId,loggedIn:false},JwtSecret,{expiresIn:60*10});
    (req as CustomRequest).token=token;
   
    next();
   }else{
    try{
        let token=authToken.split(" ")[1];
        let decoded=jwt.verify(token,JwtSecret) as MyJwtPayload;
        if(decoded && typeof decoded.userId=="string"){
        (req as CustomRequest).userId=decoded.userId;
        (req as CustomRequest).token=token;
        next();
        }
    }catch(ex){
        res.status(401).json({
            message:"You dont have the authorization",
            logout:true
        })
    }
   }
}