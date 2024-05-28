import gTTS from "gtts";
import say from "say";

export function textToSpeech(text: string) {
  const gtts = new gTTS(text);
  gtts.save("output.mp3", (err) => {
    if (err) {
      console.log("error");
    } else {
      console.log("Audio saved");
    }
  });
}

function textToSpeechSay(text: string) {
  say.export(text, undefined, 1.0, "some.mp3", (err) => {
    if (err) return console.log(err);
  });
}

try {
  textToSpeech("Hello how are you");
  //   textToSpeechSay("Hello how are you");
} catch (ex) {
  console.log(ex);
}
