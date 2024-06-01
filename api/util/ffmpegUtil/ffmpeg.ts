import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent from "fluent-ffmpeg";

ffmpegfluent.setFfmpegPath(ffmpegStatic as string);

export function resizeVideo(originalPath: string) {
  let actualPath="downloads/"+originalPath;
  let videoName=originalPath.slice(0,actualPath.length-4);
  let outputPath="downloads/resizedVideo_"+originalPath;
  ffmpegfluent(actualPath)
    .size("1080x1920")
    .on("end", () => {
      console.log("ffmpeg has completed");
    })
    .on("error", (error) => {
      console.log(error);
    })
    .save(outputPath);
    return outputPath;
}

export function burnSubtitles(videoFilePath:string,srtFilePath: string) {
  let outputPath="downloads/"+videoFilePath;
    const xPosition = "(w-text_w)/2"; // Centered horizontally
  const yPosition = "(h-text_h)-30"; // 30 pixels from the bottom
  let subtitles = "downloads/some.srt";
  ffmpegfluent(videoFilePath)
    .outputOptions(`-vf`, `subtitles=${srtFilePath}`)
    .on("error", (error) => {
      console.log(error);
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

//burnSubtitles("as");
//combineAudioAndVideo();
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//resizeVideo("0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4");
//E:\ReactProjects\MoneyMinter\api\downloads\resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt
burnSubtitles("downloads/resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4","downloads/0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt")
