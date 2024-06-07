import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../environment.js";
import fs from "fs";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ? GEMINI_API_KEY : "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function getJsonSearchTerms(
  query: string,
  script: string,
  noOfSearchTerms: number
): Promise<string[]> {
  const prompt = `Generate ${noOfSearchTerms} search terms for stock videos, depending on the subject of a video
    depending on the subject of a video.
    Subject:${query}

    The search terms are to be returned as a JSON-string Arrays of strings
    Each search term should consist of 1-3 words,  always add the main subject of the video

    here is an example of JSON-array of strings:
    ["search term 1","search term 2","search term 3"]

    Obviously, the search terms should be related to the subject of the video

    ONLY return the array of JSON-array of strings.
    Do not return anything else like "heres the response" or " \`\`\`json"
    For context here is the full script ${script}
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("The response serach terms are " + text);
  let arr: string[] = JSON.parse(text);
  console.log("The arr length is " + arr.length);
  return arr;
}

export async function getSrtFile(
  srtFileName: string,
  inputText: string
): Promise<string> {
  const prompt = `Generate an srt file for a given text  
    

    Only the srt file is to be returned. Dont give any other response like Certainly! or anything similar.

    here is an example of a response:
    "1
    00:00:00,000 --> 00:00:06,000
    In Willow Creek, Ethan's life changed when he received a magic backpack from his sorceress aunt.
    
    2
    00:00:06,001 --> 00:00:12,000
    Inside, he found magical items like an illuminating orb, a thirst-quenching canteen, and a true-north compass."

    and so on

    It can have any number of lines but should be such that it is can get the maximum number of views for a youtube short.It should be like somebody is narrating the lines. It can be of any duration, but should be short enough to be uploaded to Youtube shorts.


    ONLY return the srt file.
    Do not return anything else
    here is the full text "${inputText}"
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  let srtFilePath = await writeSrt(srtFileName, text);
  return srtFilePath;
}

async function writeSrt(pexelsVideoPath: string, text: string) {
  let path = "downloads/" + pexelsVideoPath + "_srt.srt";
  let returnPath = pexelsVideoPath + "_srt.srt";
  const stream = fs.createWriteStream(path);

  stream.write(text);
  stream.end();

  stream.on("finish", () => {
    console.log("Srt finished");
  });
  return returnPath;
}

export async function generateScript(queryString: string): Promise<string> {
  const prompt = `Generate a script for a Youtube Short based on an idea.
  Only return the text. It should be concise. Dont add anything like Hello or Great to the Response.
  Example: idea:Write a story about C++
  Example Response:"C++ is the mightiest language of all which was created in the year..." and so on.
  Optimize the script so that it might get the maximize views on Youtube. It should be concise if possible.

  Here is the idea:${queryString}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}
