import Bull from "bull";
const videoQueue = new Bull('videoQueue', {
    redis: {
        host: "redis-13173.c51.ap-southeast-2-1.ec2.redns.redis-cloud.com",
        port: 13173,
        password: "mF5IVnzMy0Ok5FoTwDYCJtVjsukmUg4V"
    },
});
const insertQueue = async (videoPath) => {
    const delayTime = 1 * 60 * 1000;
    await videoQueue.add({ videoPath }, { delay: delayTime });
};
export { videoQueue, insertQueue };
