import cron from "node-cron";
import fs from "fs";
import path from "path";
import { videoQueue } from "../BullQueue/queue.js";
cron.schedule('*/10 * * * *', async () => {
    console.log('Running cron job to delete videos older than 10 minutes.');
    let jobs = await videoQueue.getWaiting();
    console.log("The jobs in waiting stage are ", jobs.length);
    for (let job of jobs) {
        try {
            const { videoPath } = job.data;
            console.log("The videoPath of the job is ", videoPath);
            const fullPath = path.resolve(import.meta.dirname, "../", "..", "..", "downloads", videoPath);
            console.log("full PAth is ", fullPath);
            if (fs.existsSync(fullPath)) {
                console.log("File Exists");
                fs.unlinkSync(fullPath); // Delete the file
                job.moveToCompleted('done', true); // Move job to completed state
                console.log(`Deleted and completed job ${job.id}`);
            }
            else {
                console.log(`File Does not exist: ${fullPath}`);
                job.remove(); // Move job to failed state
                console.log(`Moved job ${job.id} to failed state`);
            }
        }
        catch (ex) {
            console.log(`Error processing the job ${job.id}`);
            console.log("Error is ", ex);
            job.remove();
        }
    }
});
