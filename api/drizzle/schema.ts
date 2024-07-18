import { pgTable, uuid, varchar,text, boolean } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  registeredUser:boolean("registereduser").notNull()
});

export const CoinTable=pgTable("coin",{
  id:uuid("id").primaryKey().defaultRandom(),
  idea:text("idea").notNull(),
  userId:uuid("userId").references(()=>UserTable.id),
  script:text('text'),
  searchTerms:text("searchTerms"),
  pexelVideo: text("pexelVideo"),
  srtFilePath:text("srtFilePath"),
  subtitledVideo:text("subtitledVideo"),
  audioPath:text("audioPath"),
  finalVideoPath:text("finalVideoPath")
})
