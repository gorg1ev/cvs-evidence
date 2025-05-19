import { BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "module";

export const require = createRequire(import.meta.url);
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

export const MAIN_DIST = path.join(APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(APP_ROOT, "dist");
export const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(APP_ROOT, "public")
  : RENDERER_DIST;

export function loadRenderer(win: BrowserWindow, route?: string) {
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${VITE_DEV_SERVER_URL}${route ?? ""}`);
  } else {
    const hash = route && `#${route}`;
    win.loadFile(path.join(RENDERER_DIST, "index.html"), { hash });
  }
}

export function getPreloadScriptPath() {
  return path.join(__dirname, "./preload.mjs");
}

export function dbFilePath() {
  return VITE_DEV_SERVER_URL
    ? path.join(APP_ROOT, "data", "employees.db")
    : path.join(process.resourcesPath, "data", "employees.db");
}
