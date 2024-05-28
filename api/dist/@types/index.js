import { z } from "zod";
export const processBodySchema = z.object({
    queryString: z.string()
});
