import cron from "node-cron";
import fs from "fs";
import path from "path";
import { videoQueue, VideoJobData } from "../BullQueue/queue";

cron.schedule('/10 * * * *', async () => {
     console.log('Running cron job to delete videos older than 10 minutes.');
     const videoPath = path.resolve("../downloads");
     console.log(`Video path is ${videoPath}`);


     let jobs = await videoQueue.getWaiting();

     for (let job of jobs) {
          try {
               const { videoPath } = job.data;
               fs.unlinkSync(path.resolve(__dirname,"..","..","downloads",videoPath));
               await job.moveToCompleted('done', true);

          } catch (ex) {
               console.log(`Error processing the job ${job.id}`)
          }
     }


})