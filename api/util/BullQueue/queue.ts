import Bull from "bull";

interface VideoJobData{
    videoPath:string
}

const videoQueue=new Bull<VideoJobData>('videoQueue',{
    redis:{
            host:"redis-13173.c51.ap-southeast-2-1.ec2.redns.redis-cloud.com",
            port:13173,
            password:"mF5IVnzMy0Ok5FoTwDYCJtVjsukmUg4V"
    },
});

const insertQueue=(videoPath:string)=>{
        videoQueue.add({videoPath});
}

export { VideoJobData,videoQueue,insertQueue};


