var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonSearchTerms } from "./util/geminiFolder/gemini.js";
import { getPexelsVideo, downloadVideo } from "./util/pexels/pexels.js";
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
app.get("/home", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let videoUrl = yield getPexelsVideo("Beijing is cool");
    let videoName = yield downloadVideo(videoUrl);
    res.json({ message: "Done" });
}));
app.get("/prompt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let message = yield example();
    const query = "Write a story about a magic backpack";
    let searchTerms = yield getJsonSearchTerms(query, message, 3);
    res.send(`The text is ${message}\n and the search terms are ${searchTerms}`);
}));
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "Write a story about a magic backpack";
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        console.log(text);
        return text;
    });
}
