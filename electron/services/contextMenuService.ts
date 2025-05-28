import { BrowserWindow, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import { APP_ROOT, dbFilePath } from "../utils";

export async function importDB(mainWindow: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Select a SQLite DB file",
    filters: [{ name: "SQLite DB", extensions: ["db"] }],
    properties: ["openFile"],
  });

  if (!canceled && filePaths) {
    fs.copyFile(filePaths[0], dbFilePath(), (err) => {
      if (err) {
        console.error("Failed to import DB:", err);
        return;
      }
      console.log("Database imported successfully.");
      BrowserWindow.getAllWindows()[0].webContents.send("db-imported");
    });
  }
}

export async function exportDB(mainWindow: BrowserWindow) {
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: "Export db",
    defaultPath: path.join(dbFilePath(), "employees.db"),
    filters: [{ name: "SQLite DB", extensions: ["db"] }],
  });

  if (!canceled && filePath) {
    fs.copyFile(dbFilePath(), filePath, (err) => {
      if (err) {
        console.log("fail to export db", err);
        return;
      }

      console.log("db export successfully");
      BrowserWindow.getAllWindows()[0].webContents.send("db-exported");
    });
  }
}

export async function importHolidays() {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Select a Holidays JSON file",
    filters: [{ name: "Json files", extensions: ["json"] }],
    properties: ["openFile"],
  });

  if (!canceled && filePaths) {
    fs.copyFile(
      filePaths[0],
      path.join(APP_ROOT, "data/holidays.json"),
      (err) => {
        if (err) {
          console.error("Failed to import holidays:", err);
          return;
        }
        console.log("Holidays imported successfully.");
        mainWindow.webContents.send("holidays-imported");
      }
    );
  }
}
