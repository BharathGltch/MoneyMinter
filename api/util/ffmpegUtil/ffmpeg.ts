import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent from "fluent-ffmpeg";

ffmpegfluent.setFfmpegPath(ffmpegStatic as string);

export function resizeVideo(originalPath: string) {
  ffmpegfluent(originalPath)
    .size("1920x1080")
    .on("end", () => {
      console.log("ffmpeg has completed");
    })
    .on("error", (error) => {
      console.log(error);
    })
    .save("input.mp4");
}

export function burnSubtitles(filePath: string) {
  let someText = "Hello";
  let path =
    "F:\\ProjectsOpenSource\\React-Projects\\MoneyMinter\\MoneyMinter\\api\\downloads\\e67eb29e-a553-4dfd-9590-5561f6a23668.mp4";
  const xPosition = "(w-text_w)/2"; // Centered horizontally
  const yPosition = "(h-text_h)-30"; // 30 pixels from the bottom
  ffmpegfluent(path)
    .outputOptions(
      `-vf`,
      `drawtext=text="${someText}":fontsize=${50}:fontcolor=${"black"}:x=${xPosition}:y=${yPosition}`
    )
    .on("error", (error) => {
      console.log(error);
    })
    .on("complete", () => {
      console.log("complete");
    })
    .on("end", () => {
      console.log("Processing finished succesfully");
    })
    .save("output.mp4");
}

burnSubtitles("as");
