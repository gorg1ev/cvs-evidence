import { ipcMain } from "electron";
import {
  deleteEmployeeService,
  editEmployeeService,
  getEmployeesService,
  saveEmployeeService,
} from "./services/employeesService";
import {
  countAbsentsByEmployeeIdService,
  deleteAbsentService,
  getEmployeeAbsentsService,
  saveAbsentService,
} from "./services/absentService";
import {
  countSickLeavesByEmployeeIdService,
  deleteSickLeaveService,
  getEmployeeSickLeavesService,
  saveSickLeaveService,
} from "./services/sickLeaveService";
import {
  countVacationsByEmployeeIdService,
  deleteVacationService,
  getEmployeeVacationsService,
  saveVacationService,
} from "./services/vacationService";

export function registerIpcHandlers() {
  ipcMain.handle("getEmployees", getEmployeesService);
  ipcMain.handle("saveEmployee", saveEmployeeService);
  ipcMain.handle("editEmployee", editEmployeeService);
  ipcMain.handle("deleteEmployee", deleteEmployeeService);

  ipcMain.handle("getEmployeeAbsents", getEmployeeAbsentsService);
  ipcMain.handle("saveAbsent", saveAbsentService);
  ipcMain.handle("countAbsentsByEmployeeId", countAbsentsByEmployeeIdService);
  ipcMain.handle("deleteAbsent", deleteAbsentService);

  ipcMain.handle("getEmployeeSickLeaves", getEmployeeSickLeavesService);
  ipcMain.handle("saveSickLeave", saveSickLeaveService);
  ipcMain.handle(
    "countSickLeavesByEmployeeId",
    countSickLeavesByEmployeeIdService
  );
  ipcMain.handle("deleteSickLeave", deleteSickLeaveService);

  ipcMain.handle("getEmployeeVacations", getEmployeeVacationsService);
  ipcMain.handle("saveVacation", saveVacationService);
  ipcMain.handle(
    "countVacationsByEmployeeId",
    countVacationsByEmployeeIdService
  );
  ipcMain.handle("deleteVacation", deleteVacationService);
}
