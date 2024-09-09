import gTTS from "gtts";
import fs from "fs";
export async function textToSpeech(textFilePath) {
    let path = "downloads/" + textFilePath;
    let data = fs.readFileSync(path);
    let text = data.toString();
    let outputPath = "audioMp3" + textFilePath.slice(0, textFilePath.length - 4) + ".mp3";
    let actualOutputPath = "downloads/" + outputPath;
    await processTextToSpeech(text, actualOutputPath);
    return outputPath;
}
export function processTextToSpeech(text, actualOutputPath) {
    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text);
        gtts.save(actualOutputPath, (err) => {
            if (err) {
                console.log("error");
                reject();
            }
            else {
                console.log("Audio saved");
                resolve();
            }
        });
    });
}
