import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import {
  countSickLeavesByEmployeeId,
  deleteSickLeave,
  getEmployeeSickLeaves,
  saveSickLeave,
} from "../db/sickLeave";

export async function getEmployeeSickLeavesService(
  _e: IpcMainInvokeEvent,
  sickLeaveFilter: SickLeaveFilter
) {
  return await getEmployeeSickLeaves(sickLeaveFilter);
}

export async function saveSickLeaveService(
  _e: IpcMainInvokeEvent,
  sickLeave: SickLeave
) {
  await saveSickLeave(sickLeave);
}

export async function countSickLeavesByEmployeeIdService(
  _e: IpcMainInvokeEvent,
  employeeId: number
) {
  return await countSickLeavesByEmployeeId(employeeId);
}

export async function deleteSickLeaveService(
  _e: IpcMainInvokeEvent,
  id: number
) {
  try {
    await deleteSickLeave(id);
    BrowserWindow.getAllWindows()[0].webContents.send("sickLeave-deleted");
  } catch (e) {
    console.log(e);
  }
}
