var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../environment.js";
export function getJsonSearchTerms(query, script, noOfSearchTerms) {
    return __awaiter(this, void 0, void 0, function* () {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY ? GEMINI_API_KEY : "");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        console.log("The response serach terms are " + text);
        let arr = JSON.parse(text);
        console.log("The arr length is " + arr.length);
        return arr;
    });
}
