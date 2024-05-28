import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent from "fluent-ffmpeg";
ffmpegfluent.setFfmpegPath(ffmpegStatic);
export function resizeVideo(originalPath) {
    ffmpegfluent(originalPath)
        .size("1080x1920")
        .on("end", () => {
        console.log("ffmpeg has completed");
    })
        .on("error", (error) => {
        console.log(error);
    })
        .save("input.mp4");
}
export function burnSubtitles(filePath) {
    let someText = "Hello";
    let path = "F:\\ProjectsOpenSource\\React-Projects\\MoneyMinter\\MoneyMinter\\api\\downloads\\e67eb29e-a553-4dfd-9590-5561f6a23668.mp4";
    const xPosition = "(w-text_w)/2"; // Centered horizontally
    const yPosition = "(h-text_h)-30"; // 30 pixels from the bottom
    let subtitles = "downloads/some.srt";
    ffmpegfluent(path)
        .outputOptions(`-vf`, `subtitles=${subtitles}`)
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
combineAudioAndVideo();
