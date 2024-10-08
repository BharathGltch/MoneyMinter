import cron from "node-cron";
import fs from "fs";
import path from "path";
import videoQueue from "../BullQueue/queue";

cron.schedule('/10 * * * *',async ()=>{
    console.log('Running cron job to delete videos older than 10 minutes.');
    const videoPath=path.resolve("../dwonloads");

    try{
           let jobs=await videoQueue.getWaiting();

           for(let job of jobs){
                await job.moveToCompleted('done',true);
                const {videoPath}=job.data;
                fs.unlink
           }
        }
        catch(ex){
            
        }
})