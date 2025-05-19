import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import {
  saveEmployee,
  getEmployees,
  getEmployee,
  editEmployee,
  deleteEmployee,
} from "../db/employees";

export async function getEmployeesService() {
  return await getEmployees();
}

export async function getEmployeeService(id: number) {
  return await getEmployee(id);
}

export async function saveEmployeeService(
  _e: IpcMainInvokeEvent,
  employee: Employee
) {
  try {
    await saveEmployee(employee);
    BrowserWindow.getAllWindows()[0].webContents.send("employee-saved");
  } catch (e) {
    console.log(e);
  }
}

export async function editEmployeeService(
  _e: IpcMainInvokeEvent,
  employee: Employee
) {
  try {
    await editEmployee(employee);
    BrowserWindow.getAllWindows()[0].webContents.send("employee-edited");
  } catch (e) {
    console.log(e);
  }
}

export async function deleteEmployeeService(
  _e: IpcMainInvokeEvent,
  id: number
) {
  try {
    await deleteEmployee(id);
    BrowserWindow.getAllWindows()[0].webContents.send("employee-deleted");
  } catch (e) {
    console.log(e);
  }
}
