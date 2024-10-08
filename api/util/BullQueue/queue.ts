import Bull from "bull";

const videoQueue=new Bull('videoQueue',{
    redis:{
            host:"redis-13173.c51.ap-southeast-2-1.ec2.redns.redis-cloud.com",
            port:13173,
            password:"mF5IVnzMy0Ok5FoTwDYCJtVjsukmUg4V"
    },
});

export default videoQueue;


