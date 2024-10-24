import { createCoin, insertFinalVideoPath } from "../../drizzle/dbUtil/dbUtil.js";
import { burnSubtitles, combineAudioAndVideo, convertSrtToText, cutVideo, getVideoDuration, resizeVideo } from "../ffmpegUtil/ffmpeg.js";
import { textToSpeechWithSilence } from "../ffmpegUtil/genAudio.js";
import { generateScript, getJsonSearchTerms, getSrtFile } from "../geminiFolder/gemini.js";
import { downloadVideo, getPexelsVideo } from "../pexels/pexels.js";
import { filesToBeDeletedArray } from "../BullQueue/FilesToBeDeletedArray.js";
export default async function processRequest(query, userId) {
    let coinId = await createCoin(query, userId);
    //generate the script
    let generatedScript = await generateScript(query);
    //Insert Script into Table
    // await insertScript(coinId, generatedScript);
    //generate the jsonSearchTerms
    let searchTerms = await getJsonSearchTerms(query, generatedScript, 3);
    //insert the searchTerms
    // await insertSearchTerms(coinId, searchTerms[0]);
    //Get the Pexels video link
    let videoLink = await getPexelsVideo(searchTerms[0]);
    //download Video
    let pexelsVideoPath = await downloadVideo(videoLink);
    //add pexelsVideoPath to the deletion queue
    console.log("The pexels video path after downloading is " + pexelsVideoPath);
    //save the path to the db
    // await insertPexelsVideoPath(coinId, pexelsVideoPath);
    filesToBeDeletedArray.push(pexelsVideoPath);
    console.log("Inserted Pexel Video Path");
    //generate the srt file
    let videoDuration = await getVideoDuration(pexelsVideoPath);
    console.log("Video duration is", videoDuration);
    if (videoDuration > 30) {
        console.log("Inside cut video\n");
        pexelsVideoPath = await cutVideo(pexelsVideoPath);
        filesToBeDeletedArray.push(pexelsVideoPath);
        videoDuration = 30;
        console.log("Outside cut video\n");
    }
    let fileName = pexelsVideoPath.slice(0, pexelsVideoPath.length - 4);
    let srtFilePath = await getSrtFile(fileName, generatedScript, videoDuration);
    filesToBeDeletedArray.push(srtFilePath);
    console.log("The srtFilePath is " + srtFilePath);
    //insert the srt file path
    // await insertSrtFilePath(coinId, srtFilePath);
    //add subtitles to the resized video
    console.log("The pexels Video Path is " + pexelsVideoPath);
    let resizedVideoPath = await resizeVideo(pexelsVideoPath);
    filesToBeDeletedArray.push(resizedVideoPath);
    console.log("The resizedVideopath in index is " + resizedVideoPath);
    //add subtitles to the resized video path
    let inputForSubtitlesVideo = resizedVideoPath;
    let inputForSubtitlesSrt = srtFilePath;
    let subtitledVideoPath = await burnSubtitles(inputForSubtitlesVideo, inputForSubtitlesSrt);
    filesToBeDeletedArray.push(subtitledVideoPath);
    console.log("The subtitled video Path is ", subtitledVideoPath);
    //insert the subtitled video path into the db
    //generate text from subtitles
    let textFilePath = await convertSrtToText(srtFilePath);
    console.log("The TextFilePath is ", textFilePath);
    filesToBeDeletedArray.push(textFilePath);
    let audioWithSilence = await textToSpeechWithSilence(srtFilePath, coinId);
    console.log("The audioWithSilence Path in process.js  is ", audioWithSilence);
    filesToBeDeletedArray.push(audioWithSilence);
    //generate audio from the textFile
    //let audioFilePath =await textToSpeech(textFilePath);
    let audioFilePath = audioWithSilence;
    console.log("The audioFilePath is", audioFilePath);
    //combine audio with video files
    let finalVideoPath = await combineAudioAndVideo(subtitledVideoPath, audioFilePath);
    //insert the videoPath
    console.log("\n\n Final Video Path is ", finalVideoPath);
    await insertFinalVideoPath(coinId, finalVideoPath);
    filesToBeDeletedArray.push(finalVideoPath);
    return coinId;
}
