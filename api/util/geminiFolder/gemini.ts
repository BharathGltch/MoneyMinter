import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../environment.js";

export async function getJsonSearchTerms(
  query: string,
  script: string,
  noOfSearchTerms: number
): Promise<string[]> {
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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("The response serach terms are " + text);
  let arr: string[] = JSON.parse(text);
  console.log("The arr length is " + arr.length);
  return arr;
}
