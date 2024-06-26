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

app.get(
  "/process",
  validateBody(processBodySchema),
  async (req: TypedRequestBody<{ queryString: string }>, res) => {
    let query = req.body.queryString;
    console.log("The query is " + query);

    let coinId = await createCoin(query);
    //generate the script
    let generatedScript = await generateScript(query);
    //Insert Script into Table
    await insertScript(coinId, generatedScript);
    //generate the jsonSearchTerms
    let searchTerms = await getJsonSearchTerms(query, generatedScript, 3);
    //insert the searchTerms
    await insertSearchTerms(coinId, searchTerms[0]);
    //Get the Pexels video link
    let videoLink = await getPexelsVideo(searchTerms[0]);
    //download Video
    let pexelsVideoPath = await downloadVideo(videoLink);
    console.log("The pexels video path is "+pexelsVideoPath);
    //save the path to the db
    await insertPexelsVideoPath(coinId, pexelsVideoPath);
    //generate the srt file
    let videoDuration=await  getVideoDuration(pexelsVideoPath);
    console.log("Video duration is",videoDuration);

    let fileName = pexelsVideoPath.slice(0, pexelsVideoPath.length - 4);
    let srtFilePath = await getSrtFile(fileName, generatedScript,videoDuration);
    console.log("The srtFiePath is " + srtFilePath);

    //insert the srt file path
    await insertSrtFilePath(coinId, srtFilePath);

    //add subtitles to the resized video
    console.log("The pexels Video Path is " + pexelsVideoPath);
    let resizedVideoPath = await resizeVideo(pexelsVideoPath);
    console.log("The resizedVideopath in index is " + resizedVideoPath);

    //add subtitles to the resized video path
    let inputForSubtitlesVideo = resizedVideoPath;
    let inputForSubtitlesSrt = srtFilePath;
    let subtitledVideoPath = await burnSubtitles(
      inputForSubtitlesVideo,
      inputForSubtitlesSrt
    );
    console.log(subtitledVideoPath);
    //insert the subtitled video path into the db
    await insertResizedVideoPath(coinId, subtitledVideoPath);
    //generate text from subtitles
    let textFilePath = await convertSrtToText(srtFilePath);
    console.log(textFilePath);

    //generate audio from the textFile
     let audioFilePath =await textToSpeech(textFilePath);
     console.log ("The aduioFilePath is", audioFilePath);
      
     //combine audio with video files
     let finalVideoPath=await combineAudioAndVideo(subtitledVideoPath,audioFilePath);
      //insert the videoPath
      insertFinalVideoPath(coinId,finalVideoPath);
     
    
    res.json({ finalVideoPath });
  }
);

app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
