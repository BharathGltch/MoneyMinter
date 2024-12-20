import { eq,and} from "drizzle-orm";
import { string } from "zod";
import { db } from "../db.js";
import { CoinTable, UserTable } from "../schema.js";

export async function createCoin(query: string,userId:string): Promise<string> {
  const coin = await db
    .insert(CoinTable)
    .values({
      idea: query,
      userId: userId,
    })
    .returning({
      id: CoinTable.id,
    });
  return coin[0].id;
}
export async function insertScript(coinId: string, script: string) {
  await db
    .update(CoinTable)
    .set({ script: script })
    .where(eq(CoinTable.id, coinId));
}

export async function insertSearchTerms(coinId: string, searchTerm: string) {
  await db
    .update(CoinTable)
    .set({ searchTerms: searchTerm })
    .where(eq(CoinTable.id, coinId));
}

export async function insertPexelsVideoPath(
  coinId: string,
  pexelsVideoPath: string
) {
  await db
    .update(CoinTable)
    .set({ pexelVideo: pexelsVideoPath })
    .where(eq(CoinTable.id, coinId));
}

export async function insertSrtFilePath(coinId: string, srtFilePath: string) {
  await db
    .update(CoinTable)
    .set({ srtFilePath: srtFilePath })
    .where(eq(CoinTable.id, coinId));
}

export async function insertResizedVideoPath(
  coinId: string,
  resizedVideoPath: string
) {
  await db
    .update(CoinTable)
    .set({ subtitledVideo: resizedVideoPath })
    .where(eq(CoinTable.id, coinId));
}

export async function insertFinalVideoPath(coinId:string,finalVideoPath:string){
  await db.update(CoinTable).set({finalVideoPath:finalVideoPath}).where(eq(CoinTable.id,coinId));
}

export async function checkIfUserOwnsVideo(videoId:string,userId:string){
 const results= await db
  .select()
  .from(CoinTable)
  .where(
    and(eq(CoinTable.id,videoId),eq(CoinTable.userId,userId))
  );
  if(results.length==0){
    return false;
  }
  return true;


}

export async function getVideoPath(coinId:string){
  const result=await db.query.CoinTable.findFirst({
    where:eq(CoinTable.id,coinId),
    columns:{
      finalVideoPath:true
    }
  })
  return result;
}


export async function registerUser(username:string,password:string):Promise<string>{
 let id= await db.insert(UserTable).values({
    name:username,
    registeredUser:true,
    password:password
  })
  .returning({
    id:UserTable.id
  })
  return id[0].id;
}

export const registerTemporaryUser=async ()=>{
  let id=await db.insert(UserTable).values({
    name:"Temp",
    registeredUser:false
  })
  .returning({
    id:UserTable.id
  });
  return id[0].id
}

export async function usernameIsPresent(username:string){
  let record=await db.query.UserTable.findFirst({
    where:eq(UserTable.name,username)
  })
  if(record)
    return true;
  return false;
}

export async function recordWithUsername(username:string){
  let record=await db.query.UserTable.findFirst({
    where:eq(UserTable.name,username)
  })
  return record;
}