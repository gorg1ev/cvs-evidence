import { create } from "zustand";

type AbsentStore = {
  absents: Absent[];
  absentLenght: number;
  getAbsents: (absentFilter: AbsentFilter) => void;
  saveAbsent: (absent: Absent) => void;
  getAbsentsLenght: (employeeId: number) => void;
  deleteAbsent: (di: number) => void;
};

export const useAbsentStore = create<AbsentStore>((set) => ({
  absents: [],
  absentLenght: 0,
  getAbsents(absentFilter) {
    window.ipcRenderer
      .getEmployeeAbsents(absentFilter)
      .then((abs) => set({ absents: abs }));
  },
  saveAbsent(absent) {
    window.ipcRenderer.saveAbsent(absent);
  },
  getAbsentsLenght(employeeId) {
    window.ipcRenderer
      .countAbsentsByEmployeeId(employeeId)
      .then((num) => set({ absentLenght: num }));
  },
  deleteAbsent(id) {
    window.ipcRenderer.deleteAbsent(id);
  },
}));
