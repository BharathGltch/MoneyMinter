import axios from "axios";
import { PEXELS_API_KEY } from "../environment.js";
import fs from "fs";
import https from "https";
import { v4 as uuidv4 } from "uuid";

export async function getPexelsVideo(searchTerm: string): Promise<string> {
  let response = await fetch(
    `https://api.pexels.com/videos/search?query=${searchTerm}&per_page=1`,
    {
      headers: {
        Authorization: PEXELS_API_KEY ? PEXELS_API_KEY : "",
      },
    }
  );
  let jsonResponse = await response.json();
  console.log(JSON.stringify(jsonResponse.videos[0].video_files));
  let videoUrl = jsonResponse.videos[0].video_files[0].link;
  return videoUrl;
}

export async function downloadVideo(videoUrl: string) {
  let uuidString = uuidv4();
  let tempString = videoUrl.split(".");
  let videoExtension = tempString[tempString.length - 1];
  let videoName = uuidString + "." + videoExtension;
  let path = "downloads/" + videoName;
   await processDownloadVideo(videoUrl,path);
  return videoName;
}

async function processDownloadVideo(videoUrl:string,path:string):Promise<void>{

  return new Promise((resolve,reject)=>{
    const stream = fs.createWriteStream(path);
    https.get(videoUrl,(response)=>{
      response.pipe(stream);
      resolve();
  })
  })
 
}
