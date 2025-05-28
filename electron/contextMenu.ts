import { BrowserWindow, Menu, MenuItemConstructorOptions } from "electron";
import { exportDB, importDB } from "./services/contextMenuService";

export function setupAppMenu(win: BrowserWindow | null) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Import DB",
          click: async () => {
            if (win) {
              importDB(win);
            }
          },
        },
        {
          label: "Export DB",
          click: async () => {
            if (win) {
              exportDB(win);
            }
          },
        },
        {
          label: "Holidays",
          click: async () => {
            if (win) {
              win.webContents.send("open-holidays-dialog");
            }
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
