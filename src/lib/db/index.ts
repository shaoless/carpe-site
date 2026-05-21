import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("data/sqlite.db");

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
// Wait up to 10 seconds if database is locked
sqlite.pragma("busy_timeout = 10000");

export const db = drizzle(sqlite, { schema });
