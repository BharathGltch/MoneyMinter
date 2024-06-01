import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getJsonSearchTerms,generateScript } from "./util/geminiFolder/gemini.js";
import { getPexelsVideo, downloadVideo } from "./util/pexels/pexels.js";
import { getSrtFile } from "./util/geminiFolder/gemini.js";
import { TypedRequestBody,ProcessBody,processBodySchema } from "./@types/index.js";
import {validateBody} from "./middleware/index.js";
import {db} from "./drizzle/db.js";
import {createCoin, insertPexelsVideoPath, insertResizedVideoPath, insertScript,insertSearchTerms, insertSrtFilePath} from "./drizzle/dbUtil/dbUtil.js";
import { burnSubtitles, resizeVideo } from "./util/ffmpegUtil/ffmpeg.js";

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

app.get("/home", async (req, res) => {
  let videoUrl = await getPexelsVideo("Beijing is cool");
  let videoName = await downloadVideo(videoUrl);
  res.json({ message: "Done" });
});

app.get("/prompt", async (req, res) => {
  let message = await example();
  const query = "Write a story about a magic backpack";
  let searchTerms = await getJsonSearchTerms(query, message, 3);
  //await getSrtFile(message);
  res.send(`The text is ${message}\n and the search terms are ${searchTerms}`);
});

app.get(
  "/process",validateBody(processBodySchema),
  async (req: TypedRequestBody<{ queryString: string }>, res) => {
    let query = req.body.queryString;
    console.log("The query is " + query);

    let coinId=await createCoin(query);
    //generate the script
   let generatedScript= await generateScript(query);
    //Insert Script into Table
    await insertScript(coinId,generatedScript);
    //generate the jsonSearchTerms
    let searchTerms= await getJsonSearchTerms(query,generatedScript,3);
    //insert the searchTerms
    await insertSearchTerms(coinId,searchTerms[0]);
    //Get the Pexels video link
   let videoLink= await getPexelsVideo(searchTerms[0]);
   //download Video
   let pexelsVideoPath= await downloadVideo(videoLink);
   //save the path to the db
   await insertPexelsVideoPath(coinId,pexelsVideoPath);
    //generate the srt file 
   let fileName=pexelsVideoPath.slice(0,pexelsVideoPath.length-4);
   let srtFilePath=await getSrtFile(fileName,generatedScript);
   console.log(srtFilePath);

   //insert the srt file path
    await insertSrtFilePath(coinId,srtFilePath);
    
    //add subtitles to the resized video

     let resizedVideoPath=await resizeVideo(pexelsVideoPath);

     //add subtitles to the resized video path
      let inputForSubtitlesVideo="downloads/"+resizedVideoPath;
      let inputForSubtitlesSrt="downloads/"+srtFilePath;
     let subtitledVideoPath=await burnSubtitles(inputForSubtitlesVideo,inputForSubtitlesSrt);
     //insert the subtitled video path into the db   
      await insertResizedVideoPath(coinId,subtitledVideoPath);
      //generate the audio file
   res.json({message:"Done"});

  }
);

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
