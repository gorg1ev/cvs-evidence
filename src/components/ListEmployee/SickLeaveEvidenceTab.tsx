import { useEmployeeStore } from "@/store/employeeStore";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarIcon, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { differenceInDays, format } from "date-fns";
import { Calendar } from "../ui/calendar";
import EvidenceAlert from "./EvidenceAlert";
import { useSickLeaveStore } from "@/store/sickLeaveStore";
import { enGB } from "date-fns/locale";

export default function SickLeaveEvidenceTab() {
  const { selectedEmployee } = useEmployeeStore();
  const {
    sickLeaves,
    getSickLeaves,
    sickLeaveLenght,
    getSickLeavesLenght,
    deleteSickLeave,
  } = useSickLeaveStore();

  const formSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getSickLeaves({
      employeeId: selectedEmployee?.id,
      startDate: values.startDate && format(values.startDate, "yyyy-MM-dd"),
      endDate: values.endDate && format(values.endDate, "yyyy-MM-dd"),
    } as SickLeaveFilter);
  }

  function onReset() {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getSickLeaves({ employeeId: selectedEmployee?.id });

    form.reset();
  }

  function totalSickLeaves() {
    return sickLeaves.reduce(
      (sum, sl) =>
        sum +
        (differenceInDays(new Date(sl.dateTo), new Date(sl.dateFrom)) + 1),
      0
    );
  }

  function onDeleteHandler(id: number | null) {
    if (id === null) return;

    deleteSickLeave(id);
  }

  useEffect(() => {
    function getSickLeaveData() {
      if (selectedEmployee === null || selectedEmployee.id === null) return;

      getSickLeavesLenght(selectedEmployee.id);
      getSickLeaves({ employeeId: selectedEmployee?.id });
    }

    getSickLeaveData();

    window.ipcRenderer.on("sickLeave-deleted", getSickLeaveData);

    return () => {
      window.ipcRenderer.removeListener("sickLeave-deleted", getSickLeaveData);
    };
  }, [selectedEmployee, getSickLeaves, getSickLeavesLenght]);

  if (sickLeaveLenght === 0) {
    return (
      <EvidenceAlert
        title="Нема евидентирани боледувања"
        description="За избраниот вработен нема внесено боледувања. Додадете боледување за да
        започнете со евиденција."
      />
    );
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-5">
          <div className="flex gap-1">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Избери датум од</span>
                          )}
                          <CalendarIcon className="ml-auto" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={enGB}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => {
                const dateFrom = form.watch("startDate");
                return (
                  <FormItem>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Избери датум до</span>
                            )}
                            <CalendarIcon className="ml-auto" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        locale={enGB}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          fromDate={dateFrom ?? undefined}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={onReset}>
              Ресетирај
            </Button>
            <Button size="sm">Пребарувај</Button>
          </div>
        </form>
      </Form>

      {sickLeaves.length === 0 ? (
        <EvidenceAlert
          title="Нема евидентирани боледувања"
          description="Во избраниот период нема евидентирани боледувања."
        />
      ) : (
        <>
          <ScrollArea className="w-full h-96 mt-5">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead>Дата од</TableHead>
                  <TableHead>Дата до</TableHead>
                  <TableHead>Времетраење</TableHead>
                  <TableHead>Забелешка</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sickLeaves.map((sl) => (
                  <TableRow key={sl.id}>
                    <TableCell>{sl.dateFrom}</TableCell>
                    <TableCell>{sl.dateTo}</TableCell>
                    <TableCell className="text-center">
                      {differenceInDays(sl.dateTo, sl.dateFrom) + 1}
                    </TableCell>
                    <TableCell>
                      {sl.note ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>Види забелешка</TooltipTrigger>
                            <TooltipContent className="max-w-[400px] whitespace-pre-wrap break-words">
                              <p>{sl.note}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <p>Нема забелешка</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => onDeleteHandler(sl.id)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="flex justify-between items-center mt-4 p-4 bg-muted rounded-xl border">
            <p className="text-sm font-medium text-muted-foreground">
              Вкупно редови:{" "}
              <span className="font-semibold text-foreground">
                {sickLeaves.length}
              </span>
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              Вкупно отсуство:{" "}
              <span className="font-semibold text-foreground">
                {totalSickLeaves()}
              </span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}
