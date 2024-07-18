import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
let JwtSecret = process.env.JWTSECRET ? process.env.JWTSECRET : "";
console.log("JwtSecret is ", JwtSecret);
export default function videoReqAuth(req, res, next) {
    let userId;
    let authToken = req.headers['authorization'];
    if (!authToken) {
        let tempUserId = uuidv4();
        req.userId = tempUserId;
        let token = jwt.sign({ userId: tempUserId, loggeedIn: false }, JwtSecret, { expiresIn: 60 * 10 });
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
