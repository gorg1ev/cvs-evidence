import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { formatDateMKD } from "@/lib/utils";
import { toast } from "react-toastify";

export default function HolidaysDialog() {
  const [open, setOpen] = useState(false);
  const [holidays, setHolidays] = useState<Holidays[]>([]);

  function getHolidays() {
    window.ipcRenderer.getHolidays().then((holidays) => setHolidays(holidays));
  }

  useEffect(() => {
    window.ipcRenderer.on("open-holidays-dialog", () => {
      getHolidays();
      setOpen(true);
    });
    window.ipcRenderer.on("holidays-imported", () => {
      getHolidays();
      toast.success("Успешно е додадена датотеката со неработни денови.")
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[600px]">
        <DialogHeader className="font-bold text-xl">
          Неработни денови (Празници)
        </DialogHeader>

        <Button
          className="w-[100px]"
          onClick={window.ipcRenderer.importHolidays}
        >
          {" "}
          <Plus />
          Додади
        </Button>

        <ScrollArea className="w-full h-96 mt-5">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Ден</TableHead>
                <TableHead>Празник</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((h) => (
                <TableRow key={h.date.toString()}>
                  <TableCell className="font-bold">
                    {formatDateMKD(h.date)}
                  </TableCell>
                  <TableCell>{h.day}</TableCell>
                  <TableCell>{h.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
