import {Request,Response,NextFunction} from "express";
import {z, ZodSchema} from "zod";

export const validateBody=(schema:ZodSchema)=>{
   
   return function handleBody(req:Request,res:Response,next:NextFunction){
        try{
            console.log("req.body is "+req.body);
            schema.parse(req.body);
            next();
        }catch(error){
            return res.status(400).json({error:error})
        }
    }
}
