import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import {
  countAbsentsByEmployeeId,
  deleteAbsent,
  getEmployeeAbsents,
  saveAbsent,
} from "../db/absent";

export async function getEmployeeAbsentsService(
  _e: IpcMainInvokeEvent,
  absentFilter: AbsentFilter
) {
  return await getEmployeeAbsents(absentFilter);
}

export async function saveAbsentService(
  _e: IpcMainInvokeEvent,
  absent: Absent
) {
  const total = absent.timeTo - absent.timeFrom;
  await saveAbsent({ ...absent, total });
}

export async function countAbsentsByEmployeeIdService(
  _e: IpcMainInvokeEvent,
  employeeId: number
) {
  return await countAbsentsByEmployeeId(employeeId);
}

export async function deleteAbsentService(_e: IpcMainInvokeEvent, id: number) {
  try {
    await deleteAbsent(id);
    BrowserWindow.getAllWindows()[0].webContents.send("absent-deleted");
  } catch (e) {
    console.log(e);
  }
}
