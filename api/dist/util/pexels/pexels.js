var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PEXELS_API_KEY } from "../environment.js";
import fs from "fs";
import https from "https";
import { v4 as uuidv4 } from "uuid";
export function getPexelsVideo(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch(`https://api.pexels.com/videos/search?query=${searchTerm}&per_page=1`, {
            headers: {
                Authorization: PEXELS_API_KEY ? PEXELS_API_KEY : "",
            },
        });
        let jsonResponse = yield response.json();
        console.log(JSON.stringify(jsonResponse.videos[0].video_files));
        let videoUrl = jsonResponse.videos[0].video_files[0].link;
        return videoUrl;
    });
}
export function downloadVideo(videoUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let uuidString = uuidv4();
        let tempString = videoUrl.split(".");
        let videoExtension = tempString[tempString.length - 1];
        let videoName = uuidString + "." + videoExtension;
        let path = "downloads/" + videoName;
        const stream = fs.createWriteStream(path);
        https.get(videoUrl, (response) => {
            response.pipe(stream);
        });
        return videoName;
    });
}
