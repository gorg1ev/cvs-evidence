import { clsx, type ClassValue } from "clsx";
import { minutesToHours } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToHoursExtended(minutes: number) {
  const hours = minutesToHours(minutes);
  const minutesLeft = minutes - hours * 60;
  const stringifiedHours =
    String(hours).length === 1 ? `0${hours}` : `${hours}`;
  const stringifiedMinutes =
    String(minutesLeft).length === 1 ? `0${minutesLeft}` : `${minutesLeft}`;
  return `${stringifiedHours}:${stringifiedMinutes}`;
}
