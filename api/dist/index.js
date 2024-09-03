import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import { processBodySchema, } from "./@types/index.js";
import { validateBody } from "./middleware/index.js";
import { getVideoPath, } from "./drizzle/dbUtil/dbUtil.js";
import processRequest from "./util/processUtil/processUtil.js";
import { videoReqAuth, checkAndGiveUserId } from "./middleware/Authentication/AuthMiddleWare.js";
import loginRouter from "./routers/loginRouter.js";
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const corsOptions = {
    credentials: true,
    origin: "*", // Whitelist the domains you want to allow
};
const app = express();
const port = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY : "");
app.use(express.json());
app.use(cors(corsOptions));
app.post("/process", validateBody(processBodySchema), checkAndGiveUserId, async (req, res) => {
    let cusReq = req;
    let query = req.body.queryString;
    let userId = cusReq.userId;
    console.log("The query is " + query);
    let videoId = await processRequest(query, userId);
    res.json({ token: cusReq.token, videoId });
});
app.get("/video/:videoId", videoReqAuth, async (expressRequest, _res) => {
    const req = expressRequest;
    if (req.userId == null)
        return _res.status(400).json({ "message": "No userId" });
    //req.userId to access the userId
    //get the file url from the coinId in the db coin table
    let coinId = req.params["videoId"];
    let videoPath = await getVideoPath(coinId);
    console.log("The video Path is ", videoPath);
    if (videoPath == undefined)
        return _res.status(400).json({ message: "Video Not Found" });
    if (videoPath.finalVideoPath == undefined)
        return _res.status(400).json({ message: "Video Not Found" });
    let videoPathFinal = videoPath.finalVideoPath;
    let filePath = videoPathFinal;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    //get the parts fro the range
    if (range) {
        const parts = range.replace('/bytes=/', '').split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        };
        _res.writeHead(206, head);
        file.pipe(_res);
        return;
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        _res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(_res);
    }
});
app.get("/videos", (req, _res) => {
    //console.log(JSON.stringify(req.headers.authorization));
    console.log("The authorization header is ", req.headers["random"]);
    let filePath = "downloads/demo.mp4";
    const stat = fs.statSync(filePath);
    //console.log(JSON.stringify(stat));
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log("range is", range);
    //get the parts fro the range
    if (range) {
        const parts = range.replace('bytes=', '').split("-");
        console.log("parts ", parts);
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        console.log("start ", start);
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        };
        _res.writeHead(206, head);
        file.pipe(_res);
        return;
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4'
        };
        _res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(_res);
    }
});
app.use("/", loginRouter);
app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
