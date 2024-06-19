import gTTS from "gtts";
import fs, { readFileSync } from "fs";
import say from "say";

export async function textToSpeech(textFilePath: string) {
  let path = "downloads/" + textFilePath;
  let data = fs.readFileSync(path);
  let text = data.toString();
  let outputPath =
    "audioMp3" + textFilePath.slice(0, textFilePath.length - 4) + ".mp3";
  let actualOutputPath = "downloads/" + outputPath;
  await processTextToSpeech(text,actualOutputPath);
  return outputPath;
}

export function processTextToSpeech(text:string,actualOutputPath:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    const gtts = new gTTS(text);
  gtts.save(actualOutputPath, (err) => {
    if (err) {
      console.log("error");
      reject();
    } else {
      console.log("Audio saved");
      resolve();
    }
  });
  })
}

function textToSpeechSay(text: string) {
  say.export(text, undefined, 1.0, "some.mp3", (err) => {
    if (err) return console.log(err);
  });
}
