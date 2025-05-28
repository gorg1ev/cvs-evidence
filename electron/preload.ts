import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipcRenderer", {
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
  removeListener: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },

  getEmployees: () => ipcRenderer.invoke("getEmployees"),
  saveEmployee: (employee: Employee) =>
    ipcRenderer.invoke("saveEmployee", employee),
  editEmployee: (employee: Employee) =>
    ipcRenderer.invoke("editEmployee", employee),
  deleteEmployee: (id: number) => ipcRenderer.invoke("deleteEmployee", id),

  getEmployeeAbsents: (absentFilter: AbsentFilter) =>
    ipcRenderer.invoke("getEmployeeAbsents", absentFilter),
  saveAbsent: (absent: Absent) => ipcRenderer.invoke("saveAbsent", absent),
  countAbsentsByEmployeeId: (employeeId: number) =>
    ipcRenderer.invoke("countAbsentsByEmployeeId", employeeId),
  deleteAbsent: (id: number) => ipcRenderer.invoke("deleteAbsent", id),

  getEmployeeSickLeaves: (sickLeaveFilter: SickLeaveFilter) =>
    ipcRenderer.invoke("getEmployeeSickLeaves", sickLeaveFilter),
  saveSickLeave: (sickLeave: SickLeave) =>
    ipcRenderer.invoke("saveSickLeave", sickLeave),
  countSickLeavesByEmployeeId: (employeeId: number) =>
    ipcRenderer.invoke("countSickLeavesByEmployeeId", employeeId),
  deleteSickLeave: (id: number) => ipcRenderer.invoke("deleteSickLeave", id),

  getEmployeeVacations: (vacationFilter: VacationFilter) =>
    ipcRenderer.invoke("getEmployeeVacations", vacationFilter),
  saveVacation: (vacation: Vacation) =>
    ipcRenderer.invoke("saveVacation", vacation),
  countVacationsByEmployeeId: (employeeId: number) =>
    ipcRenderer.invoke("countVacationsByEmployeeId", employeeId),
  deleteVacation: (id: number) => ipcRenderer.invoke("deleteVacation", id),

  importHolidays: () => ipcRenderer.invoke("importHolidays"),

  getHolidays: () => ipcRenderer.invoke("getHolidays"),
});
