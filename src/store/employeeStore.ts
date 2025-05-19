import { create } from "zustand";

type EmployeeStore = {
  employees: Employee[];
  selectedEmployee: Employee | null;
  getEmployees: () => void;
  saveEmployee: (employee: Employee) => void;
  editEmployee: (employee: Employee) => void;
  deleteEmployee: () => void;
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  getEmployees() {
    window.ipcRenderer.getEmployees().then((emps) => set({ employees: emps }));
  },
  saveEmployee(employee) {
    window.ipcRenderer.saveEmployee(employee);
  },
  editEmployee(employee) {
    window.ipcRenderer.editEmployee(employee);
    set({ selectedEmployee: null });
  },
  deleteEmployee() {
    const { selectedEmployee } = get();

    if (selectedEmployee === null || selectedEmployee.id === null) return;

    window.ipcRenderer.deleteEmployee(selectedEmployee.id);
    set({ selectedEmployee: null });
  },
}));
