import { useEmployeeStore } from "@/store/employeeStore";
import { Dialog, DialogHeader, DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AbsentEvidenceTab from "./AbsentEvidenceTab";
import SickLeaveEvidenceTab from "./SickLeaveEvidenceTab";
import VacationEvidenceTab from "./VacationEvidenceTab";
import { useDialogStore } from "@/store/dialogStore";

export default function EvidenceDialog() {
  const { evidenceDialog, setEvidenceDialog } = useDialogStore();

  function handleOpenChange(isOpen: boolean) {
    setEvidenceDialog(isOpen);
    if (!isOpen) {
      useEmployeeStore.setState({ selectedEmployee: null });
    }
  }

  return (
    <Dialog open={evidenceDialog} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-[610px] min-h-[700px] content-baseline">
        <DialogHeader></DialogHeader>
        <Tabs defaultValue="otsustvo">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="otsustvo">Отсуство</TabsTrigger>
            <TabsTrigger value="bolovanje">Боловање</TabsTrigger>
            <TabsTrigger value="odmor">Одмор</TabsTrigger>
          </TabsList>
          <TabsContent value="otsustvo">
            <AbsentEvidenceTab />
          </TabsContent>
          <TabsContent value="bolovanje">
            <SickLeaveEvidenceTab />
          </TabsContent>
          <TabsContent value="odmor">
            <VacationEvidenceTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
