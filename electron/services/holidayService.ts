import { isWithinInterval, parseISO } from "date-fns";
import { APP_ROOT, VITE_DEV_SERVER_URL } from "../utils";
import fs from "node:fs";
import path from "node:path";

export function getHolidaysService(): Holidays[] {
  let holidaysPath = path.join(APP_ROOT, "data/holidays.json");

  if (!VITE_DEV_SERVER_URL) {
    holidaysPath = path.join(process.resourcesPath, "data/holidays.json");
  }

  if (!fs.existsSync(holidaysPath)) {
    return [];
  }

  const json = fs.readFileSync(holidaysPath, { encoding: "utf-8" });
  const data = JSON.parse(json);

  return data as Holidays[];
}

export function countOverlappingHolidays(
  start: Date | string,
  end: Date | string
) {
  const startDate = parseISO(start.toString());
  const endDate = parseISO(end.toString());

  const holidays = getHolidaysService();

  if (holidays.length === 0) return 0;

  return holidays.filter((holiday) => {
    const date = parseISO(holiday.date.toString());
    const day = new Date(date).getDay();
    if (day === 0 || day === 6) return false;
    return isWithinInterval(date, { start: startDate, end: endDate });
  }).length;
}
