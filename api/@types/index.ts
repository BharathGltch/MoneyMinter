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
