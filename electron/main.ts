import { app, BrowserWindow } from "electron";
import { getPreloadScriptPath, loadRenderer } from "./utils";
import { registerIpcHandlers } from "./ipcHandlers";
import { setupAppMenu } from "./contextMenu";
let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: getPreloadScriptPath(),
      sandbox: true,
      contextIsolation: true,
    },
  });

  win.on("closed", () => {
    win = null;
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();

  if (win !== null) {
    loadRenderer(win);
  }
  setupAppMenu(win);
  registerIpcHandlers();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
