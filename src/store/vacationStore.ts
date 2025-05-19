import { create } from "zustand";

type VacationStore = {
  vacations: Vacation[];
  vacationLength: number;
  getVacations: (vacationFilter: VacationFilter) => void;
  saveVacation: (vacation: Vacation) => void;
  getVacationsLenght: (employeeId: number) => void;
  deleteVacation: (id: number) => void;
};

export const useVacationStore = create<VacationStore>((set) => ({
  vacations: [],
  vacationLength: 0,
  getVacations(vacationFilter) {
    window.ipcRenderer.getEmployeeVacations(vacationFilter).then((v) => {
      set({ vacations: v });
    });
  },
  saveVacation(vacation) {
    window.ipcRenderer.saveVacation(vacation);
  },
  getVacationsLenght(employeeId) {
    window.ipcRenderer
      .countVacationsByEmployeeId(employeeId)
      .then((num) => set({ vacationLength: num }));
  },
  deleteVacation(id) {
    window.ipcRenderer.deleteVacation(id);
  },
}));
