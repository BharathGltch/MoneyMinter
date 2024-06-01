import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { CoinTable } from "../schema.js";
export async function createCoin(query) {
    const coin = await db.insert(CoinTable).values({
        idea: query,
        userId: "66fb9179-52f8-482c-8872-82bfa3bf3dc4"
    }).returning({
        id: CoinTable.id
    });
    return coin[0].id;
}
export async function insertScript(coinId, script) {
    await db.update(CoinTable).set({ script: script }).where(eq(CoinTable.id, coinId));
}
export async function insertSearchTerms(coinId, searchTerm) {
    await db.update(CoinTable).set({ searchTerms: searchTerm }).where(eq(CoinTable.id, coinId));
}
export async function insertPexelsVideoPath(coinId, pexelsVideoPath) {
    await db.update(CoinTable).set({ pexelVideo: pexelsVideoPath }).where(eq(CoinTable.id, coinId));
}
