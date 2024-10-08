import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { checkIfUserOwnsVideo, registerTemporaryUser } from '../../drizzle/dbUtil/dbUtil.js';
dotenv.config();
let JwtSecret = process.env.JWTSECRET ? process.env.JWTSECRET : "";
export async function videoReqAuth(req, res, next) {
    let videoId = req.params.videoId;
    console.log("videoId is", videoId);
    if (!videoId) {
        return res.status(404).json({ message: "No videoId" });
    }
    console.log("The headers are", req.headers);
    let authToken = req.headers["authorization"];
    console.log("authtoken", authToken);
    if (!authToken) {
        console.log("Token is undefined");
        return res.status(404).json({ message: "You are test unauthorized" });
    }
    try {
        let token = authToken.split(" ")[1];
        console.log("The token after splitting is ", token);
        let decoded = jwt.verify(token, JwtSecret);
        console.log("decoded is", decoded);
        if (decoded && typeof decoded.userId == "string") {
            //check if the userId and videoId match
            let result = await checkIfUserOwnsVideo(videoId, decoded.userId);
            if (!result) {
                return res.status(401).json({ message: "you are unauthorized" });
            }
            req.userId = decoded.userId;
            next();
        }
    }
    catch (ex) {
        console.log("Inside catch");
        console.log("THe error is ", ex === null || ex === void 0 ? void 0 : ex.message);
        return res.status(404).json({
            message: "You dont have the authorization"
        });
    }
}
export async function checkAndGiveUserId(req, res, next) {
    let authToken = req.headers["authorization"];
    if (!authToken) {
        //create a temp user
        let tempUserId = await registerTemporaryUser();
        req.userId = tempUserId;
        let token = jwt.sign({ userId: tempUserId, loggedIn: false }, JwtSecret, { expiresIn: 60 * 10 });
        req.token = token;
        next();
    }
    else {
        try {
            let token = authToken.split(" ")[1];
            let decoded = jwt.verify(token, JwtSecret);
            if (decoded && typeof decoded.userId == "string") {
                req.userId = decoded.userId;
                req.token = token;
                next();
            }
        }
        catch (ex) {
            res.status(401).json({
                message: "You dont have the authorization",
                logout: true
            });
        }
    }
}
export async function verifyUser(req, res, next) {
    let authToken = req.headers["authorization"];
    if (!authToken) {
        return res.status(401).json({
            message: "You are not authorized"
        });
    }
    try {
        let token = authToken.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "You are not authorized"
            });
        }
        let payload = jwt.verify(token, JwtSecret);
        console.log("payload is ", payload);
        console.log("Verified");
        if (payload.loggedIn == false) {
            return res.status(401).json({
                message: "You are not authorized"
            });
        }
        next();
    }
    catch (ex) {
        return res.status(401).json({
            message: "You are not authorized"
        });
    }
}
