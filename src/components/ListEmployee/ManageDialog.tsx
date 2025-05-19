import { useEmployeeStore } from "@/store/employeeStore";
import { Dialog, DialogHeader, DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AbsentFormTab from "./AbsentFormTab";
import SickLeaveFormTab from "./SickLeaveFormTab";
import VacationFormTab from "./VacationFormTab";
import { useDialogStore } from "@/store/dialogStore";

export default function ManageDialog() {
  const { manageDialog, setManageDialog } = useDialogStore();

  function handleOpenChange(isOpen: boolean) {
    setManageDialog(isOpen);
    if (!isOpen) {
      useEmployeeStore.setState({ selectedEmployee: null });
    }
  }

  return (
    <Dialog open={manageDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="min-h-[530px] content-baseline">
        <DialogHeader></DialogHeader>
        <Tabs defaultValue="otsustvo">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="otsustvo">Отсуство</TabsTrigger>
            <TabsTrigger value="bolovanje">Боловање</TabsTrigger>
            <TabsTrigger value="odmor">Одмор</TabsTrigger>
          </TabsList>
          <TabsContent value="otsustvo">
            <AbsentFormTab />
          </TabsContent>
          <TabsContent value="bolovanje">
            <SickLeaveFormTab />
          </TabsContent>
          <TabsContent value="odmor">
            <VacationFormTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
