import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { checkIfUserOwnsVideo } from '../../drizzle/dbUtil/dbUtil.js';
dotenv.config();
let JwtSecret = process.env.JWTSECRET ? process.env.JWTSECRET : "";
export async function videoReqAuth(req, res, next) {
    let videoId = req.params.videoId;
    console.log("videoId is", videoId);
    if (!videoId) {
        res.status(404).json({ message: "No videoId" });
    }
    let authToken = req.headers['authorization'];
    console.log("authtoken", authToken);
    if (!authToken) {
        res.status(401).json({ message: "You are not authorized" });
    }
    else {
        try {
            let token = authToken.split(" ")[1];
            let decoded = jwt.verify(token, JwtSecret);
            console.log("decoded is", decoded);
            if (decoded && typeof decoded.userId == "string") {
                //check if the userId and videoId match
                let result = await checkIfUserOwnsVideo(videoId, decoded.userId);
                if (!result) {
                    res.status(401).json({ message: "you are unauthorized" });
                    next();
                }
                req.userId = decoded.userId;
                next();
            }
            else {
                throw new Error();
            }
        }
        catch (ex) {
            res.status(404).json({
                message: "You dont have the authorization"
            });
        }
    }
}
export function checkAndGiveUserId(req, res, next) {
    let authToken = req.headers["authorization"];
    if (!authToken) {
        let tempUserId = uuidv4();
        req.userId = tempUserId;
        let token = jwt.sign({ userId: tempUserId, loggedIn: false }, JwtSecret, { expiresIn: 60 * 10 });
        res.setHeader('token', token);
        next();
    }
    else {
        try {
            let token = authToken.split(" ")[1];
            let decoded = jwt.verify(token, JwtSecret);
            if (decoded && typeof decoded.userId == "string") {
                req.userId = decoded.userId;
                next();
            }
        }
        catch (ex) {
            res.status(401).json({
                message: "You dont have the authorization"
            });
        }
    }
}
