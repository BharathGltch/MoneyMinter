import { z } from "zod";
export const processBodySchema = z.object({
    queryString: z.string()
});
export const processLoginBody = z.object({
    username: z.string(),
    password: z.string()
});
export const processRegisterBodySchema = z.object({
    username: z.string(),
    password: z.string()
});
