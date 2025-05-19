import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import {
  countVacationsByEmployeeId,
  deleteVacation,
  getEmployeeVacations,
  saveVacation,
} from "../db/vacation";

export async function getEmployeeVacationsService(
  _e: IpcMainInvokeEvent,
  vacationFilter: VacationFilter
) {
  return await getEmployeeVacations(vacationFilter);
}

export async function saveVacationService(
  _e: IpcMainInvokeEvent,
  vacation: Vacation
) {
  await saveVacation(vacation);
}

export async function countVacationsByEmployeeIdService(
  _e: IpcMainInvokeEvent,
  employeeId: number
) {
  return await countVacationsByEmployeeId(employeeId);
}

export async function deleteVacationService(
  _e: IpcMainInvokeEvent,
  id: number
) {
  try {
    await deleteVacation(id);
    BrowserWindow.getAllWindows()[0].webContents.send("vacation-deleted");
  } catch (e) {
    console.log(e);
  }
}
