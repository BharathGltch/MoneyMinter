import express from "express";
import { validateBody } from "../middleware/index.js";
import { LoginRequestBody, processLoginBody, processRegisterBodySchema, RegisterRequestBody, TypedRequestBody } from "../@types/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { recordWithUsername, registerUser, usernameIsPresent } from "../drizzle/dbUtil/dbUtil.js";
import { verifyUser } from "../middleware/Authentication/AuthMiddleWare.js";
dotenv.config()
let router=express.Router();
let JwtSecret=process.env.JWTSECRET?process.env.JWTSECRET:"";


router.post("/login",validateBody(processLoginBody),async (req:TypedRequestBody<LoginRequestBody>,res,next)=>{
        let username=req.body.username;
        let password=req.body.password;

        console.log("Inside login",username+" ",password);
        //check if the username exists
        let record=await recordWithUsername(username);
        if(!record){
              return  res.status(404).json({message:"Account not found"});
        }
       
        //convert into hash and check using bcrypt
        let hash=record.password;
        if(hash==null){
             return res.status(404).json({message:"Creden"}); 
        }
        let result=await bcrypt.compare(password,hash);
        if(!result){
              return  res.status(403).json({message:"Credentials do not match"});
        }

       let token=jwt.sign({id:record.id,loggedIn:true},JwtSecret,{expiresIn:'1m'});
       console.log("Token in Login is ",token);
       return  res.status(200).json({token:token});
})

router.post("/register",validateBody(processRegisterBodySchema),async (req:TypedRequestBody<RegisterRequestBody>,res,next)=>{
        let username=req.body.username;
        let password=req.body.password;

        //check if username is aldready present

       if(await usernameIsPresent(username)){
       return  res.status(401).json({message:"username is already present"});
       }
        
        bcrypt.hash(password,10,async (err,hash)=>{
            if(err){
               return res.status(401).json({message:"An error occurred"})
            }
           let userId=await registerUser(username,hash);
          let token=jwt.sign({id:userId,loggedIn:true},JwtSecret,{expiresIn:'1h'});
          return res.status(200).json(token);
        })
})

router.get("/me",verifyUser,(req,res)=>{
     let loggedIn=true;
     return res.status(200).json({loggedIn});
})


export default router;