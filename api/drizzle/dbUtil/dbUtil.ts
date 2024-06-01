import { eq } from "drizzle-orm";
import { string } from "zod";
import {db} from "../db.js";
import { CoinTable } from "../schema.js";


export async function createCoin(query:string):Promise<string>{

   const coin=await db.insert(CoinTable).values({
        idea:query,
        userId:"66fb9179-52f8-482c-8872-82bfa3bf3dc4"
    }).returning({
        id:CoinTable.id
    })
return coin[0].id ;
}
export async function insertScript(coinId:string,script:string){
    await db.update(CoinTable).set({script:script}).where(eq(CoinTable.id,coinId));
}

export async function insertSearchTerms(coinId:string,searchTerm:string){
    await db.update(CoinTable).set({searchTerms:searchTerm}).where(eq(CoinTable.id,coinId));
}

export async function insertPexelsVideoPath(coinId:string,pexelsVideoPath:string){
    await db.update(CoinTable).set({pexelVideo:pexelsVideoPath}).where(eq(CoinTable.id,coinId));
}

export async function insertSrtFilePath(coinId:string,srtFilePath:string){
    await db.update(CoinTable).set({srtFilePath:srtFilePath}).where(eq(CoinTable.id,coinId));
}

export async function insertResizedVideoPath(coinId:string,resizedVideoPath:string){
        await db.update(CoinTable).set({subtitledVideo:resizedVideoPath}).where(eq(CoinTable.id,coinId));
}
