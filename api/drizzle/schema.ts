import { serial } from "drizzle-orm/mysql-core";
import { pgTable, uuid, varchar,text } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  
});

export const CoinTable=pgTable("coin",{
  id:uuid("id").primaryKey().defaultRandom(),
  idea:text("idea").notNull(),
  userId:uuid("userId").references(()=>UserTable.id),
  script:text('text')
})
