import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent from "fluent-ffmpeg";
import fs from "fs";
import { parse } from "subtitle";
ffmpegfluent.setFfmpegPath(ffmpegStatic);
export async function resizeVideo(originalPath) {
    let returnPath = "resizedVideo_" + originalPath;
    await processResizeVideo(originalPath);
    return returnPath;
}
function processResizeVideo(originalPath) {
    return new Promise((resolve, reject) => {
        let actualPath = "downloads/" + originalPath;
        let videoName = originalPath.slice(0, actualPath.length - 4);
        let outputPath = "downloads/resizedVideo_" + originalPath;
        let returnPath = "resizedVideo_" + originalPath;
        ffmpegfluent(actualPath)
            .size("1080x1920")
            .on("end", () => {
            console.log("\nFFmpeg has completed");
            resolve();
        })
            .on("error", (error) => {
            console.log(error);
            reject(error);
        })
            .save(outputPath);
    });
}
export function burnSubtitles(videoFilePath, srtFilePath) {
    let outputPath = "downloads/subtitlesBurned" + videoFilePath;
    let inputVideoFilePath = "downloads/" + videoFilePath;
    let inputSrtFilePath = "downloads/" + srtFilePath;
    ffmpegfluent(inputVideoFilePath)
        .outputOptions(`-vf`, `subtitles=${inputSrtFilePath}`)
        .on("error", (error) => {
        console.log("The error is " + error);
    })
        .on("complete", () => {
        console.log("complete");
    })
        .on("end", () => {
        console.log("Processing finished succesfully");
    })
        .save(outputPath);
    return outputPath;
}
export function combineAudioAndVideo() {
    ffmpegfluent("output.mp4")
        .input("output.mp3")
        .outputOptions("-c", "copy")
        .outputOptions("-map", "0:v:0")
        .outputOptions("-map", "1:a:0")
        .save("combinedVideo.mp4")
        .on("end", () => {
        console.log("Output Video Created successfully");
    });
}
export function convertSrtToText(srtFilePath) {
    let srtPath = "downloads/" + srtFilePath;
    let fileName = "textSrt_" + srtFilePath;
    let outputPath = "downloads/textSrt_" + srtFilePath;
    let output = "";
    fs.createReadStream(srtPath)
        .pipe(parse())
        .on("data", (node) => {
        output += node.data.text;
    })
        .on("error", console.error)
        .on("finish", () => {
        filehandle: fs.writeFileSync(outputPath, output);
    });
    return fileName;
}
//burnSubtitles("as");
//combineAudioAndVideo();
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//resizeVideo("0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4");
//E:\ReactProjects\MoneyMinter\api\downloads\resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt
// burnSubtitles(
//   "downloads/resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4",
//   "downloads/0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt"
// );
//await resizeVideo("901c1fa3-6c3d-4d25-98fd-0201ecfaa712.mp4");
