import express from "express";
import { validateBody } from "../middleware";
import { LoginRequestBody, processLoginBody, processRegisterBodySchema, RegisterRequestBody, TypedRequestBody } from "../@types";
import bcrypt from "bcrypt";
import { registerUser, usernameIsPresent } from "../drizzle/dbUtil/dbUtil";

let router=express.Router();


router.post("/login",validateBody(processLoginBody),(req:TypedRequestBody<LoginRequestBody>,res,next)=>{
        let username=req.body.username;
        let password=req.body.password;
})

router.post("/register",validateBody(processRegisterBodySchema),async (req:TypedRequestBody<RegisterRequestBody>,res,next)=>{
        let username=req.body.username;
        let password=req.body.password;

        //check if username is aldready present

       if(await usernameIsPresent(username)){
        res.status(401).json({message:"username is aldready present"});
       }

        bcrypt.hash(password,10,async (err,hash)=>{
            if(err){
                res.status(401).json({message:"An error occurred"})
            }
           let userId=await registerUser(username,hash);

            
        })
})