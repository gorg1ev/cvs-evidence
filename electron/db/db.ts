import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as path from "node:path";
import { require, APP_ROOT, VITE_DEV_SERVER_URL } from "../utils";
import * as schema from "./schema";
const Database = require("better-sqlite3");

let sqlitePath = path.join(APP_ROOT, "./data/employees.db");
if (!VITE_DEV_SERVER_URL) {
  sqlitePath = path.join(process.resourcesPath, "data/employees.db");
}

let migrationsFolderPath = path.join(APP_ROOT, "drizzle");
if (!VITE_DEV_SERVER_URL) {
  migrationsFolderPath = path.join(process.resourcesPath, "drizzle");
}

const sqlite = new Database(sqlitePath);
export const db = drizzle(sqlite, { schema });

migrate(db, {
  migrationsFolder: migrationsFolderPath,
});
