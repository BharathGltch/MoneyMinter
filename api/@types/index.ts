import {Request} from "express";
import {z} from "zod";
export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface ProcessBody{
  queryString:string
}

export const processBodySchema=z.object({
  queryString:z.string()
})

export const processLoginBody=z.object({
  username:z.string(),
  password:z.string()
})

export const processRegisterBodySchema=z.object({
  username:z.string(),
  password:z.string()
})


export type LoginRequestBody={
    username:string,
    password:string
}

export type RegisterRequestBody={
  username:string,
  password:string
}