import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Clipboard,
  ClipboardPenLine,
  EllipsisVertical,
  MessageSquareWarning,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuSeparator } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "react-toastify";

import DeleteDialog from "./DeleteDialog";
import { useEmployeeStore } from "@/store/employeeStore";
import { useDialogStore } from "@/store/dialogStore";
import ManageDialog from "./ManageDialog";
import EvidenceDialog from "./EvidenceDialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function ListEmployeeTable() {
  const { employees, getEmployees } = useEmployeeStore();
  const {
    setDeleteDialog,
    setManageDialog,
    setEmployeeDialogForm,
    setEvidenceDialog,
  } = useDialogStore();

  function onManageEmployee(employee: Employee) {
    useEmployeeStore.setState({
      selectedEmployee: employee,
    });
    setManageDialog(true);
  }

  function onEditEmployee(employee: Employee) {
    useEmployeeStore.setState({
      selectedEmployee: employee,
    });

    setEmployeeDialogForm(true);
  }

  function onDeleteHandler(employee: Employee) {
    useEmployeeStore.setState({
      selectedEmployee: employee,
    });
    setDeleteDialog(true);
  }

  function onEvidence(employee: Employee) {
    useEmployeeStore.setState({
      selectedEmployee: employee,
    });
    setEvidenceDialog(true);
  }

  useEffect(() => {
    getEmployees();

    window.ipcRenderer.on("employee-saved", () => {
      getEmployees();
      toast.success("Успешно е додаден нов вработен");
    });

    window.ipcRenderer.on("employee-edited", () => {
      getEmployees();
      toast.success("Успешно е уреден постоечкиот вработен");
    });

    window.ipcRenderer.on("employee-deleted", () => {
      getEmployees();
      toast.success("Вработениот е успешно избришан");
    });

    window.ipcRenderer.on("db-imported", () => {
      getEmployees();
      toast.success("Успешно е импортирана базата");
    });

    window.ipcRenderer.on("db-exported", () => {
      toast.success("Успешно е експортирана базата");
    });

    return () => {
      window.ipcRenderer.removeListener("employee-saved", () => {});
      window.ipcRenderer.removeListener("employee-edited", () => {});
      window.ipcRenderer.removeListener("employee-deleted", () => {});
      window.ipcRenderer.removeListener("db-imported", () => {});
      window.ipcRenderer.removeListener("db-exported", () => {});
    };
  }, [getEmployees]);

  if (employees.length === 0) {
    return (
      <Alert className="mt-10 mx-auto w-[600px]">
        <MessageSquareWarning className="h-4 w-4" />
        <AlertTitle>Нема вработени</AlertTitle>
        <AlertDescription>
          Во моментот не постојат внесени вработени. Додадете нов вработен за да
          започнете со евиденција.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <section>
      <ManageDialog />
      <DeleteDialog />
      <EvidenceDialog />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Име</TableHead>
            <TableHead>Презиме</TableHead>
            <TableHead>ЕМБГ</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.firstName}</TableCell>
              <TableCell>{employee.lastName}</TableCell>
              <TableCell>{employee.personalNumber}</TableCell>
              <TableCell className="flex gap-1">
                <Button onClick={() => onManageEmployee(employee)}>
                  <ClipboardPenLine />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="flex gap-1 items-center"
                      onClick={() => onEditEmployee(employee)}
                    >
                      <Pencil />
                      Уреди
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex gap-1 items-center"
                      onClick={() => onEvidence(employee)}
                    >
                      <Clipboard />
                      Евиденција
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDeleteHandler(employee)}
                    >
                      <Trash />
                      Избриши
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
