import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonSearchTerms } from "./util/geminiFolder/gemini.js";
import { getPexelsVideo, downloadVideo } from "./util/pexels/pexels.js";
import { getSrtFile } from "./util/geminiFolder/gemini.js";
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
app.get("/home", async (req, res) => {
    let videoUrl = await getPexelsVideo("Beijing is cool");
    let videoName = await downloadVideo(videoUrl);
    res.json({ message: "Done" });
});
app.get("/prompt", async (req, res) => {
    let message = await example();
    const query = "Write a story about a magic backpack";
    let searchTerms = await getJsonSearchTerms(query, message, 3);
    await getSrtFile(message);
    res.send(`The text is ${message}\n and the search terms are ${searchTerms}`);
});
app.get("/process", async (req, res) => {
    let query = req.body.queryString;
    console.log("The query is " + query);
    res.json({ query });
});
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
async function example() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Write a story about a magic backpack";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
}
