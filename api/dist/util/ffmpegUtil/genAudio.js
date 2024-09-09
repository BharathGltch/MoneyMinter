import fs from "fs";
import { processTextToSpeech } from "../gtts/gttsUtil.js";
import { concatAudioFilesWithoutSilence, padAudio } from "./ffmpeg.js";
export async function textToSpeechWithSilence(srtFilePath) {
    let finalPath = "downloads/AudioFileWithSilence_" + srtFilePath.slice(0, srtFilePath.length - 4) + ".mp3";
    console.log("The finalPath is ", finalPath);
    let actualSrtFilePath = "downloads/" + srtFilePath;
    let subtitles = await parseSrt(actualSrtFilePath);
    console.log(subtitles);
    let audioFiles = await generateVoiceOvers(subtitles);
    console.log(audioFiles);
    // let silenceDurations=await calculateSilenceDurations(subtitles);
    await concatAudioFilesWithoutSilence(audioFiles, finalPath);
    //let silentFiles=await generateSilenceFiles(silenceDurations);
    // await concatAudioFiles(audioFiles,silentFiles,"downloads/AudioFileWithSilence_"+srtFilePath);
    //await concatAudioFilesWithSilence(audioFiles,silentFiles,"downloads/AudioFileWithSilence_"+srtFilePath);
    return finalPath;
}
//parse audio parts
//generate aduio for each part
//generate silence for each part
//combine parts with silence
async function parseSrt(srtFilePath) {
    const srtData = fs.readFileSync(srtFilePath, 'utf8');
    const subtitleEntries = srtData.split('\n\n');
    const subtitles = [];
    subtitleEntries.forEach(entry => {
        const lines = entry.split("\n");
        if (lines.length >= 2) {
            const timeRange = lines[1].split(` --> `);
            const startTime = timeToSeconds(timeRange[0]);
            const endTime = timeToSeconds(timeRange[1]);
            const text = lines.slice(2).join(` `);
            subtitles.push({ startTime, endTime, text });
        }
    });
    return subtitles;
}
function timeToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const [secs, millis] = seconds.split(',');
    return (parseInt(hours, 10) * 3600 +
        parseInt(minutes, 10) * 60 +
        parseInt(secs, 10) +
        parseInt(millis, 10) / 1000);
}
async function generateVoiceOvers(subtitles) {
    const audioFiles = [];
    for (let i = 0; i < subtitles.length; i++) {
        const outputFilePath = `downloads/voiceover${i}.mp3`;
        await processTextToSpeech(subtitles[i].text, outputFilePath);
        //add padding to these files
        let length = subtitles[i].endTime - subtitles[i].endTime;
        //add Padding
        let outputAudio = await padAudio(outputFilePath, length, i);
        audioFiles.push(outputAudio);
    }
    return audioFiles;
}
function calculateSilenceDurations(subtitles) {
    const silenceDurations = [];
    for (let i = 0; i < subtitles.length - 1; i++) {
        const currentEnd = subtitles[i].endTime;
        const nextStart = subtitles[i + 1].startTime;
        const silenceDuration = nextStart - currentEnd;
        if (silenceDuration > 0) {
            silenceDurations.push(silenceDuration);
        }
    }
    return silenceDurations;
}
