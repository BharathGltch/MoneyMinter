import { createCoin, insertFinalVideoPath, insertPexelsVideoPath, insertResizedVideoPath, insertScript, insertSearchTerms, insertSrtFilePath } from "../../drizzle/dbUtil/dbUtil.js";
import { burnSubtitles, combineAudioAndVideo, convertSrtToText, getVideoDuration, resizeVideo } from "../ffmpegUtil/ffmpeg.js";
import { generateScript, getJsonSearchTerms, getSrtFile } from "../geminiFolder/gemini.js";
import { textToSpeech } from "../gtts/gttsUtil.js";
import { downloadVideo, getPexelsVideo } from "../pexels/pexels.js";

export default async function processRequest(query:string){
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
      return finalVideoPath;
} 