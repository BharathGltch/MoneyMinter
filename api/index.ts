import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getJsonSearchTerms,
  generateScript,
} from "./util/geminiFolder/gemini.js";
import { getPexelsVideo, downloadVideo } from "./util/pexels/pexels.js";
import { getSrtFile } from "./util/geminiFolder/gemini.js";
import {
  TypedRequestBody,
  ProcessBody,
  processBodySchema,
} from "./@types/index.js";
import { validateBody } from "./middleware/index.js";
import { db } from "./drizzle/db.js";
import {
  createCoin,
  insertFinalVideoPath,
  insertPexelsVideoPath,
  insertResizedVideoPath,
  insertScript,
  insertSearchTerms,
  insertSrtFilePath,
} from "./drizzle/dbUtil/dbUtil.js";
import {
  burnSubtitles,
  combineAudioAndVideo,
  convertSrtToText,
  getVideoDuration,
  resizeVideo,
} from "./util/ffmpegUtil/ffmpeg.js";
import { textToSpeech } from "./util/gtts/gttsUtil.js";
import processRequest from "./util/processUtil/processUtil.js";
import {videoReqAuth, checkAndGiveUserId, CustomRequest } from "./middleware/Authentication/AuthMiddleWare.js";

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const corsOptions = {
  credentials: true,
  origin: "*", // Whitelist the domains you want to allow
};

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : ""
);
app.use(express.json());
app.use(cors(corsOptions));

app.post(
  "/process",
  validateBody(processBodySchema),
  checkAndGiveUserId,
  async (req: TypedRequestBody<{ queryString: string }>, res) => {
    let query = req.body.queryString;
    console.log("The query is " + query);
   let finalVideoPath=await processRequest(query);
    res.json({ finalVideoPath });
  }
);

app.get("/video/:videoId",videoReqAuth,(expressRequest,_res)=>{
      const req=expressRequest as CustomRequest;
      if(req.userId==null)
       return _res.status(400).json({"message":"No userId"});
      

     
      _res.status(200).json({userId: req.userId});
      
})

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
