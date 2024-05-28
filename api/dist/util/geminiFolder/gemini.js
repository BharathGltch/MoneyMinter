import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../environment.js";
import fs from "fs";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ? GEMINI_API_KEY : "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
export async function getJsonSearchTerms(query, script, noOfSearchTerms) {
    const prompt = `Generate ${noOfSearchTerms} search terms for stock videos, depending on the subject of a video
    depending on the subject of a video.
    Subject:${query}

    The search terms are to be returned as a JSON-string Arrays of strings
    Each search term should consist of 1-3 words,  always add the main subject of the video

    here is an example of JSON-array of strings:
    ["search term 1","search term 2","search term 3"]

    Obviously, the search terms should be related to the subject of the video

    ONLY return the array of JSON-array of strings.
    Do not return anything else
    For context here is the full script ${script}
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("The response serach terms are " + text);
    let arr = JSON.parse(text);
    console.log("The arr length is " + arr.length);
    return arr;
}
export async function getSrtFile(inputText) {
    const prompt = `Generate an srt file for a given text  
    

    Only the srt file is to be returned. Dont give anhy other response like Certainly! or anything similar.

    here is an example of a response:
    "1
    00:00:00,000 --> 00:00:06,000
    In Willow Creek, Ethan's life changed when he received a magic backpack from his sorceress aunt.
    
    2
    00:00:06,001 --> 00:00:12,000
    Inside, he found magical items like an illuminating orb, a thirst-quenching canteen, and a true-north compass."


    ONLY return the srt file.
    Do not return anything else
    here is the full text "${inputText}"
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    await writeSrt(text);
    return;
}
async function writeSrt(text) {
    let path = "downloads/some.srt";
    const stream = fs.createWriteStream(path);
    stream.write(text);
    stream.end();
    stream.on("finish", () => {
        console.log("Srt finished");
    });
}
