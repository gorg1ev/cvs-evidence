import { create } from "zustand";

type SickLeaveStore = {
  sickLeaves: SickLeave[];
  sickLeaveLenght: number;
  getSickLeaves: (sickLeaveFilter: SickLeaveFilter) => void;
  saveSickLeave: (sickLeave: SickLeave) => void;
  getSickLeavesLenght: (employeeId: number) => void;
  deleteSickLeave: (id: number) => void;
};

export const useSickLeaveStore = create<SickLeaveStore>((set) => ({
  sickLeaves: [],
  sickLeaveLenght: 0,
  getSickLeaves(sickLeaveFilter) {
    window.ipcRenderer.getEmployeeSickLeaves(sickLeaveFilter).then((sl) => {
      set({ sickLeaves: sl });
    });
  },
  saveSickLeave(sickLeave) {
    window.ipcRenderer.saveSickLeave(sickLeave);
  },
  getSickLeavesLenght(employeeId) {
    window.ipcRenderer
      .countSickLeavesByEmployeeId(employeeId)
      .then((num) => set({ sickLeaveLenght: num }));
  },
  deleteSickLeave(id) {
    window.ipcRenderer.deleteSickLeave(id);
  },
}));
