import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { processBodySchema, } from "./@types/index.js";
import { validateBody } from "./middleware/index.js";
import processRequest from "./util/processUtil/processUtil.js";
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const corsOptions = {
    credentials: true,
    origin: "*", // Whitelist the domains you want to allow
};
const app = express();
const port = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : "");
app.use(express.json());
app.use(cors(corsOptions));
app.post("/process", validateBody(processBodySchema), async (req, res) => {
    let query = req.body.queryString;
    console.log("The query is " + query);
    let finalVideoPath = await processRequest(query);
    res.json({ finalVideoPath });
});
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
