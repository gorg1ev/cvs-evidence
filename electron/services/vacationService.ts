import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import {
  countVacationsByEmployeeId,
  deleteVacation,
  getEmployeeVacations,
  saveVacation,
} from "../db/vacation";
import { countOverlappingHolidays } from "./holidayService";
import { addDays, differenceInBusinessDays } from "date-fns";

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
  const overlapping = countOverlappingHolidays(
    vacation.dateFrom,
    vacation.dateTo
  );
  const total =
    differenceInBusinessDays(addDays(vacation.dateTo, 1), vacation.dateFrom) -
    overlapping;
  await saveVacation({ ...vacation, total });
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
