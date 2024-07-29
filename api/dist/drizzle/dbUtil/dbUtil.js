import { eq, and } from "drizzle-orm";
import { db } from "../db.js";
import { CoinTable } from "../schema.js";
export async function createCoin(query) {
    const coin = await db
        .insert(CoinTable)
        .values({
        idea: query,
        userId: "99415575-834b-4829-9ec2-3552491fba91",
    })
        .returning({
        id: CoinTable.id,
    });
    return coin[0].id;
}
export async function insertScript(coinId, script) {
    await db
        .update(CoinTable)
        .set({ script: script })
        .where(eq(CoinTable.id, coinId));
}
export async function insertSearchTerms(coinId, searchTerm) {
    await db
        .update(CoinTable)
        .set({ searchTerms: searchTerm })
        .where(eq(CoinTable.id, coinId));
}
export async function insertPexelsVideoPath(coinId, pexelsVideoPath) {
    await db
        .update(CoinTable)
        .set({ pexelVideo: pexelsVideoPath })
        .where(eq(CoinTable.id, coinId));
}
export async function insertSrtFilePath(coinId, srtFilePath) {
    await db
        .update(CoinTable)
        .set({ srtFilePath: srtFilePath })
        .where(eq(CoinTable.id, coinId));
}
export async function insertResizedVideoPath(coinId, resizedVideoPath) {
    await db
        .update(CoinTable)
        .set({ subtitledVideo: resizedVideoPath })
        .where(eq(CoinTable.id, coinId));
}
export async function insertFinalVideoPath(coinId, finalVideoPath) {
    await db.update(CoinTable).set({ finalVideoPath: finalVideoPath }).where(eq(CoinTable.id, coinId));
}
export async function checkIfUserOwnsVideo(videoId, userId) {
    const results = await db
        .select()
        .from(CoinTable)
        .where(and(eq(CoinTable.id, videoId), eq(CoinTable.userId, userId)));
    if (results.length == 0) {
        return false;
    }
    return true;
}
