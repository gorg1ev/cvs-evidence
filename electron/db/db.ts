import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as path from "node:path";
import { require, APP_ROOT, VITE_DEV_SERVER_URL } from "../utils";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { addDays, differenceInBusinessDays, differenceInDays } from "date-fns";
import { countOverlappingHolidays } from "../services/holidayService";
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

async function postAbsent() {
  const rows = await db
    .select()
    .from(schema.absent)
    .where(eq(schema.absent.total, 0));

  for (const row of rows) {
    if (row.total === 0) return;

    const total = row.timeTo - row.timeFrom;
    await db
      .update(schema.absent)
      .set({ total })
      .where(eq(schema.absent.id, row.id))
      .execute();
  }
}
async function postSickLeave() {
  const rows = await db
    .select()
    .from(schema.sickLeave)
    .where(eq(schema.sickLeave.total, 0));

  for (const row of rows) {
    if (row.total === 0) return;

    const total = differenceInDays(addDays(row.dateTo, 1), row.dateFrom);
    await db
      .update(schema.sickLeave)
      .set({ total })
      .where(eq(schema.sickLeave.id, row.id))
      .execute();
  }
}
async function postVacation() {
  const rows = await db
    .select()
    .from(schema.vacation)
    .where(eq(schema.vacation.total, 0));

  for (const row of rows) {
    if (row.total === 0) return;

    const overlapping = countOverlappingHolidays(row.dateFrom, row.dateTo);
    const total =
      differenceInBusinessDays(addDays(row.dateTo, 1), row.dateFrom) -
      overlapping;

    await db
      .update(schema.vacation)
      .set({ total })
      .where(eq(schema.vacation.id, row.id))
      .execute();
  }
}

postAbsent();
postSickLeave();
postVacation();
