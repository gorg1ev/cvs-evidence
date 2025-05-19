import { useDialogStore } from "@/store/dialogStore";
import { useEmployeeStore } from "@/store/employeeStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export default function DeleteDialog() {
  const { deleteDialog, setDeleteDialog } = useDialogStore();
  const { deleteEmployee } = useEmployeeStore();

  function onClickHandler() {
    deleteEmployee();
    setDeleteDialog(false);
  }

  function handleOpenChange(isOpen: boolean) {
    setDeleteDialog(isOpen);
    if (!isOpen) {
      useEmployeeStore.setState({ selectedEmployee: null });
    }
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={deleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Дали сте сигурни?</AlertDialogTitle>
          <AlertDialogDescription>
            Оваа акција е неповратна. Вработениот ќе биде трајно избришан заедно
            со сите поврзани податоци.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Излези</AlertDialogCancel>
          <AlertDialogAction onClick={onClickHandler} className="bg-red-500 hover:bg-red-400">
            Избриши
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
