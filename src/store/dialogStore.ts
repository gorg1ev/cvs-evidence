import { create } from "zustand";

type DialogStore = {
  deleteDialog: boolean;
  setDeleteDialog: (value: boolean) => void;

  manageDialog: boolean;
  setManageDialog: (value: boolean) => void;

  employeeDialogForm: boolean;
  setEmployeeDialogForm: (value: boolean) => void;

  evidenceDialog: boolean;
  setEvidenceDialog: (value: boolean) => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  deleteDialog: false,
  manageDialog: false,
  employeeDialogForm: false,
  evidenceDialog: false,
  setDeleteDialog: (value) => set({ deleteDialog: value }),
  setManageDialog: (value) => set({ manageDialog: value }),
  setEmployeeDialogForm: (value) => set({ employeeDialogForm: value }),
  setEvidenceDialog: (value) => set({ evidenceDialog: value }),
}));
