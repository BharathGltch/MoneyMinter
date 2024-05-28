import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./drizzle/schema.ts",
    dialect: "postgresql",
    out: "./drizzle/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});
