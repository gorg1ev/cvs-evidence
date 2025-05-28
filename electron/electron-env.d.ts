/// <reference types="vite-plugin-electron/electron-env" />

interface Window {
  ipcRenderer: {
    on: (channel: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (
      channel: string,
      callback: (...args: unknown[]) => void
    ) => void;

    getEmployees: () => Promise<Employee[]>;
    saveEmployee: (employee: Employee) => Promise<void>;
    editEmployee: (employee: Employee) => Promise<void>;
    deleteEmployee: (id: number) => Promise<void>;

    getEmployeeAbsents: (absentFilter: AbsentFilter) => Promise<Absent[]>;
    saveAbsent: (absent: Absent) => Promise<void>;
    countAbsentsByEmployeeId: (employeeId: number) => Promise<number>;
    deleteAbsent: (id: number) => Promise<void>;

    getEmployeeSickLeaves: (
      sickLeaveFilter: SickLeaveFilter
    ) => Promise<SickLeave[]>;
    saveSickLeave: (sickLeave: SickLeave) => Promise<void>;
    countSickLeavesByEmployeeId: (employeeId: number) => Promise<number>;
    deleteSickLeave: (id: number) => Promise<void>;

    getEmployeeVacations: (
      vacationFilter: VacationFilter
    ) => Promise<Vacation[]>;
    saveVacation: (vacation: Vacation) => Promise<void>;
    countVacationsByEmployeeId: (employeeId: number) => Promise<number>;
    deleteVacation: (id: number) => Promise<void>;

    importHolidays: () => Promise<void>;

    getHolidays: () => Promise<Holidays[]>;
  };
}
