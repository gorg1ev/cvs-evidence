import { APP_ROOT } from "../utils";
import fs from "node:fs";
import path from "node:path";

export function getHolidaysService(): Holidays[] {
  const holidaysPath = path.join(APP_ROOT, "data/holidays.json");

  if (!fs.existsSync(holidaysPath)) {
    return [];
  }

  const json = fs.readFileSync(holidaysPath, { encoding: "utf-8" });
  const data = JSON.parse(json);

  return data as Holidays[];
}
