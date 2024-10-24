import ffmpegStatic from "ffmpeg-static";
import ffmpegfluent, { ffprobe } from "fluent-ffmpeg";
import  {path as ffprobePath} from "ffprobe-static";
import fs, { writeFileSync } from "fs";
import { parse } from "subtitle";
import os from "os";
import path from "path";

ffmpegfluent.setFfmpegPath(ffmpegStatic as string);
ffmpegfluent.setFfprobePath(ffprobePath);

const numCores=os.cpus().length;

export async function resizeVideo(originalPath: string) {
  let returnPath = "resizedVideo_" + originalPath;
  await processResizeVideo(originalPath);
  return returnPath;
}

function processResizeVideo(originalPath:string):Promise<void>{
    return new Promise((resolve,reject)=>{
      let actualPath = "downloads/" + originalPath;
  let outputPath = "downloads/resizedVideo_" + originalPath;
   ffmpegfluent(actualPath)
    .size("1080x1920")
    .outputOptions([
      "-c:v libx264", 
      `-threads ${numCores}`,
      `-preset faster`,
      `-b:v 1000k`,
      `-crf 28`
    ])
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
      .outputOptions([
        `-vf subtitles=${inputSrtFilePath}`,
        "-c:v libx264",
        `-crf 32`,
        `-preset ultrafast`,
        `-b:v 1000k`
      ])
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

  try{
  let outputPath:string="downloads/finalVideo"+videoPath;
  let actualVideoPath="downloads/"+videoPath;
  let actualAudioPath=audioPath;
  await processCombiningAudioAndVideo(actualVideoPath,actualAudioPath,outputPath);
  return outputPath;}catch(err){
    console.log("Error inside combineAudioAndVideo ",err);
    return "";
  }
}

async function processCombiningAudioAndVideo(actualVideoPath:string,actualAudioPath:string,outputPath:string):Promise<void>{
  return new Promise((resolve,reject)=>{
    ffmpegfluent(actualVideoPath)
    .input(actualAudioPath)
    .outputOptions([
      "-c copy",   
      "-map 0:v:0", 
      "-map 1:a:0",
      `-threads ${numCores}`,
      `-b:v 1000k`,
      `-b:a 128k`,
      `-preset faster`
    ])
    .save(outputPath)
    .on("end", () => {
      console.log("Output Video Created successfully");
      resolve();
    }).on("error",(err)=>{
        console.log(err);
        reject(err);
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
    let output:string[]=[];
  return new Promise((resolve,reject)=>{
    fs.createReadStream(srtPath)
    .pipe(parse())
    .on("data", (node) => {
      output.push(node.data.text);
    })
    .on("error", (error)=>{
      reject(error);
    })
    .on("finish", async  () => {
      try{
      await fs.writeFileSync(outputPath, output.join(" "));
      resolve();
      }catch(ex){
        reject(ex);
      }
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
        .outputOptions([
           "-c:v libx264", 
          `-threads ${numCores}`,
          `-b:v 1000k`,
          `-b:a 128k`,
          `-preset fast`,
          `-crf 28`
        ])
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

export function generateSilenceFiles(silenceDurations: number[]): Promise<string[]> {
  const silenceFiles: string[] = [];
  // Temporary directory for storing silence files

  // Ensure the temporary directory exists
 

  // Helper function to generate silence file
  const generateSilenceFile = (duration: number, index: number): Promise<string> => {
      return new Promise((resolve, reject) => {
          const silenceFile = `downloads/silence${index}.mp3`;

          ffmpegfluent()
              .input('anullsrc=r=44100:cl=stereo') // Input source: silence
              .inputFormat('lavfi') // Format for the input
              .audioFilters(`aformat=channel_layouts=stereo`)
              .outputOptions([`-threads ${numCores}`,
                `-preset fast`,
                `-crf 30`
              ]) // Set duration of silence
              .output(silenceFile) // Output file path
              .audioCodec('libmp3lame') // MP3 codec
              .audioBitrate('128k') // Set audio bitrate
              .on('end', () => {
                  console.log(`Silence file created: ${silenceFile}`);
                  resolve(silenceFile);
              })
              .on('error', (err) => {
                  console.error('Error creating silence file:', err);
                  reject(err);
              })
              .run(); // Start the process
      });
  };

  // Create silence files for all durations
  const promises = silenceDurations.map((duration, index) => generateSilenceFile(duration, index));
  
  return Promise.all(promises)
      .then((files) => {
          return files; // Return the array of silence file paths
      })
      .catch((err) => {
          console.error('Error generating silence files:', err);
          throw err;
      });
}


export async function concatAudioFiles(audioFiles:string[],silentFiles:string[],outputFilePath:string):Promise<void>{
  const tempFolder="/downloads";
  if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
}
  return new Promise((resolve, reject) => {
    const command = ffmpegfluent();

    // Add each audio file to the ffmpeg input
    audioFiles.forEach((file,index) => {
      command.input(file);
      if (silentFiles[index]) {
        command.input(silentFiles[index]); // Add corresponding silence file
      }
    });

    // Concatenate the audio files
    command.outputOptions([
      `-threads ${numCores}`
    ])
    .audioCodec("copy")
    .on('start',(cmd)=>{
      console.log('FFmpeg command:', cmd);
    })
      .on('end', () => {
        console.log(`Concatenation finished successfully. Output file: ${outputFilePath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during concatenation:', err?.message);
        reject(err);
      })
      .mergeToFile(outputFilePath,tempFolder);  // Specify the output file path
  });
}





export async function concatAudioFilesWithSilence(
  audioFiles: string[],
  silentFiles: string[],
  outputFilePath: string
): Promise<void> {
  // const tempFolder = "/downloads";
  // if (!fs.existsSync(tempFolder)) {
  //   fs.mkdirSync(tempFolder);
  // }

  return new Promise((resolve, reject) => {
    const inputs = [...audioFiles, ...silentFiles];
    const inputOptions = inputs.map((file) => `-i ${file}`).join(' ');

    const concatFilter = inputs
      .map((_, i) => `[${i}:a]`)
      .join('') + `concat=n=${inputs.length}:v=0:a=1[outa]`;

    ffmpegfluent()
      .inputOptions(inputOptions)
      .complexFilter([concatFilter], 'outa')
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('end', () => {
        console.log(`Concatenation finished successfully. Output file: ${outputFilePath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during concatenation:', err?.message);
        reject(err);
      })
      .save(outputFilePath)
      .outputOptions('-map', '[outa]')
      .outputOptions('-acodec', 'copy');
  });
}

export async function padAudio(audioPath:string,length:number,index:number):Promise<string>{
  let fileName=`downloads/audioPaddedFile${index}.mp3`;
  return new Promise((resolve,reject)=>{
    ffmpegfluent(audioPath)
    .duration(5) // Set the duration to 5 seconds
    .audioFilters(`apad=pad_dur=${length}`) // Pad the audio to 5 seconds if shorter
    .on('end', () => {
      console.log('Audio padded or trimmed to 5 seconds');
      resolve(fileName);
    })
    .on('error', (err) => {
      console.error('Error processing audio:', err);
      reject();
    })
    .save(fileName);
  })

}

export async function concatAudioFilesWithoutSilence(audioFiles:string[],savePath:string):Promise<void>{
    return new Promise((resolve,reject)=>{
      let command=ffmpegfluent();

        audioFiles.forEach((audioPath)=>{
          if(fs.existsSync(audioPath)){
            command.input(audioPath);
          }
        })

        command
        .complexFilter([
          {
            filter: 'concat',
            options: {
              n: audioFiles.length,
              v: 0, // No video
              a: 1, // Audio only
            },
          },
        ])
    .on('start', function(cmdline) {
        console.log('Start: Command line:', cmdline);
    })
    .on('progress', function(progress) {
        console.info(`Processing: ${progress.percent}% done`);
    })
    .on('codecData', function(data) {
        console.log('Codec Data:', data);
    })
    .on('end', function() {
        console.log('File has been successfully concatenated');
        resolve();
    })
    .on('stderr',(stdErrLine)=>{
        console.log('StdErr Output : ',stdErrLine);
    })
    .on('error', function(err) {
        console.log("Inside the error")
        console.log('An error occurred: ' + err.message);
        reject();
    }).save(savePath)
    .run();
    })
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
