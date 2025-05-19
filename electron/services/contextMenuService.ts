import { BrowserWindow, dialog } from "electron";
import path from "node:path";
import fs from "node:fs";
import { dbFilePath } from "../utils";

export async function importDB(mainWindow: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Select a SQLite DB file",
    filters: [{ name: "SQLite DB", extensions: ["db"] }],
    properties: ["openFile"],
  });

  if (!canceled && filePaths) {
    fs.copyFile(filePaths[0], dbFilePath(), (err) => {
      if (err) {
        console.error("Failed to export DB:", err);
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
