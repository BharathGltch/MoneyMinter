import gTTS from "gtts";
import fs from "fs";
import say from "say";
export function textToSpeech(textFilePath) {
    let path = "downloads/" + textFilePath;
    let data = fs.readFileSync(path);
    let text = data.toString();
    let outputPath = "audioMp3" + textFilePath.slice(0, textFilePath.length - 4) + ".mp3";
    let actualOutputPath = "downloads/" + outputPath;
    const gtts = new gTTS(text);
    gtts.save(actualOutputPath, (err) => {
        if (err) {
            console.log("error");
        }
        else {
            console.log("Audio saved");
        }
    });
    return outputPath;
}
function textToSpeechSay(text) {
    say.export(text, undefined, 1.0, "some.mp3", (err) => {
        if (err)
            return console.log(err);
    });
}
