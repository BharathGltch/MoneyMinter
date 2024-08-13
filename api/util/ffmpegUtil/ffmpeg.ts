import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent, { ffprobe } from "fluent-ffmpeg";
import  {path as ffprobePath} from "ffprobe-static";
import fs, { writeFileSync } from "fs";
import { parse } from "subtitle";

ffmpegfluent.setFfmpegPath(ffmpegStatic as string);
ffmpegfluent.setFfprobePath(ffprobePath);

export async function resizeVideo(originalPath: string) {
  let returnPath = "resizedVideo_" + originalPath;
  await processResizeVideo(originalPath);
  return returnPath;
}

function processResizeVideo(originalPath:string):Promise<void>{
    return new Promise((resolve,reject)=>{
      let actualPath = "downloads/" + originalPath;
  let videoName = originalPath.slice(0, actualPath.length - 4);
  let outputPath = "downloads/resizedVideo_" + originalPath;
  let returnPath = "resizedVideo_" + originalPath;
   ffmpegfluent(actualPath)
    .size("1080x1920")
    .on("end", () => {
      console.log("\nFFmpeg has completed");
      resolve();
    })
    .on("error", (error) => {
      console.log(error);
      reject(error);
    })
    .save(outputPath);
    })
}

export async function burnSubtitles(videoFilePath: string, srtFilePath: string) {
  let retPath="subtitlesBurned"+videoFilePath;
  let outputPath = "downloads/subtitlesBurned" + videoFilePath;
  let inputVideoFilePath = "downloads/" + videoFilePath;
  let inputSrtFilePath = "downloads/" + srtFilePath;
  await processburningSubtitles(inputVideoFilePath,inputSrtFilePath,outputPath);
  return retPath;
}

 export async function processburningSubtitles(inputVideoFilePath:string,inputSrtFilePath:string,outputPath:string):Promise<void>{
    return new Promise((resolve,reject)=>{
      ffmpegfluent(inputVideoFilePath)
      .outputOptions(`-vf`, `subtitles=${inputSrtFilePath}`)
      .on("error", (error) => {
        console.log("The error is "+error);
        reject(error);
      })
      .on("complete", () => {
        console.log("complete");
      })
      .on("end", () => {
        console.log("Processing finished succesfully");
        resolve();
      })
      .save(outputPath);
    return outputPath;
    })
 }  

export async function combineAudioAndVideo(videoPath:string,audioPath:string) {
  let outputPath:string="downloads/finalVideo"+videoPath;
  let actualVideoPath="downloads/"+videoPath;
  let actualAudioPath="downloads/"+audioPath;
  await processCombiningAudioAndVideo(actualVideoPath,actualAudioPath,outputPath);
    return outputPath;
}

async function processCombiningAudioAndVideo(actualVideoPath:string,actualAudioPath:string,outputPath:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    ffmpegfluent(actualVideoPath)
    .input(actualAudioPath)
    .outputOptions("-c", "copy")
    .outputOptions("-map", "0:v:0")
    .outputOptions("-map", "1:a:0")
    .save(outputPath)
    .on("end", () => {
      console.log("Output Video Created successfully");
      resolve();
    }).on("error",(err)=>{
        console.log(err);
        reject();
    });

  })
}

export async function convertSrtToText(srtFilePath: string) {
  let srtPath = "downloads/" + srtFilePath;
  let fileName = "textSrt_" + srtFilePath;
  let outputPath = "downloads/textSrt_" + srtFilePath;
  await processConvertingSrtToText(srtPath,outputPath);
  return fileName;
}

async function processConvertingSrtToText(srtPath:string,outputPath:string):Promise<void>{
    let output="";
  return new Promise((resolve,reject)=>{
    fs.createReadStream(srtPath)
    .pipe(parse())
    .on("data", (node) => {
      output += node.data.text+" ";
    })
    .on("error", (error)=>{
      reject(error);
    })
    .on("finish", () => {
      filehandle: fs.writeFileSync(outputPath, output);
      resolve();
    });
  })

}

async function processGetVideoDuration(videoPath:string):Promise<number>{
  console.log(videoPath," in processGetVideoDuration");
  return new Promise((resolve,reject)=>{
      ffmpegfluent.ffprobe(videoPath,(err,metadata)=>{
        if(err){
          console.log(err,"At processGetVideoDuration");
          reject();
        }else{
          console.log("Processing finished");
          if(typeof metadata.format.duration==undefined)
          {
            console.log("Metadata is  nor formatted correctly in getting video Duration");
          reject();
          }
          resolve(metadata.format.duration as number );
        }
      })
  })
}
export async function getVideoDuration(videoPath:string){

      let fullPath="downloads/"+videoPath;
      console.log("full path is"+fullPath);
      let duration= await processGetVideoDuration(fullPath);
      let retDuration=duration as number;
      return retDuration;
}

export async function cutVideo(videoPath:string):Promise<string>{
    let videoName=videoPath.slice(0,videoPath.length-4);
    console.log("videoName is ",videoName);
    let outputPath=videoName+ "cutVideo"+".mp4";
    console.log("outpt Path is",outputPath);
    await processCuttingVideo("downloads/"+videoPath,"downloads/"+outputPath);
    return outputPath;
}

async function processCuttingVideo(videoPath:string,outputPath:string):Promise<void>{
  try{
   return new Promise((resolve,reject)=>{
    console.log("Path inside the Promise is", videoPath);
        ffmpegfluent(videoPath)
        .output(outputPath)
        .setStartTime(0)
        .setDuration(30)
        .withVideoCodec('copy')
        .withAudioCodec('copy')
        .on('end',function(err){
          if(!err){
            console.log("Cuting done");
            resolve();
          }
        })
        .on('error',function(err){
          console.log('error:',err);
          reject(err);
        })
        .run();
   })
  }catch(e){
    
    if (typeof e === "string") {
        e.toUpperCase() // works, `e` narrowed to string
    } else if (e instanceof Error) {
        e.message // works, `e` narrowed to Error
    }
  }
}




//burnSubtitles("as");
//combineAudioAndVideo();
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//resizeVideo("0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4");
//E:\ReactProjects\MoneyMinter\api\downloads\resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4
//E:\ReactProjects\MoneyMinter\api\downloads\0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt
// burnSubtitles(
//   "downloads/resizedVideo_0010aa5c-98c0-4489-ba3b-80c6f953b6a6.mp4",
//   "downloads/0010aa5c-98c0-4489-ba3b-80c6f953b6a6_srt.srt"
// );
//await resizeVideo("901c1fa3-6c3d-4d25-98fd-0201ecfaa712.mp4");
