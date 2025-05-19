import { useAbsentStore } from "@/store/absentStore";
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
import { cn, minutesToHoursExtended } from "@/lib/utils";
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
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import EvidenceAlert from "./EvidenceAlert";

export default function AbsentEvidenceTab() {
  const { selectedEmployee } = useEmployeeStore();
  const { absents, getAbsents, absentLenght, getAbsentsLenght, deleteAbsent } =
    useAbsentStore();

  const formSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getAbsents({
      employeeId: selectedEmployee?.id,
      startDate: values.startDate && format(values.startDate, "yyyy-MM-dd"),
      endDate: values.endDate && format(values.endDate, "yyyy-MM-dd"),
    } as AbsentFilter);
  }

  function onReset() {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getAbsents({ employeeId: selectedEmployee?.id });

    form.reset();
  }

  function totalAbsent() {
    const total = absents.reduce(
      (sum, abs) => sum + abs.timeTo - abs.timeFrom,
      0
    );
    return minutesToHoursExtended(total);
  }

  function onDeleteHandler(id: number | null) {
    if (id === null) return;

    deleteAbsent(id);
  }

  useEffect(() => {
    function getAbsentData() {
      if (selectedEmployee === null || selectedEmployee.id === null) return;

      getAbsentsLenght(selectedEmployee.id);
      getAbsents({ employeeId: selectedEmployee?.id });
    }

    getAbsentData();

    window.ipcRenderer.on("absent-deleted", getAbsentData);

    return () => {
      window.ipcRenderer.removeListener("absent-deleted", getAbsentData);
    };
  }, [selectedEmployee, getAbsents, getAbsentsLenght]);

  if (absentLenght === 0) {
    return (
      <EvidenceAlert
        title="Нема евидентирани отсуства"
        description="За избраниот вработен нема внесено отсуства. Додадете отсуство за да
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

      {absents.length === 0 ? (
        <EvidenceAlert
          title="Нема евидентирани отсуства"
          description="Во избраниот период нема евидентирани отсуства."
        />
      ) : (
        <>
          <ScrollArea className="w-full h-96 mt-5">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Време од</TableHead>
                  <TableHead>Време до</TableHead>
                  <TableHead>Времетраење</TableHead>
                  <TableHead>Забелешка</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absents.map((abs) => (
                  <TableRow key={abs.id}>
                    <TableCell>{abs.date}</TableCell>
                    <TableCell>
                      {minutesToHoursExtended(abs.timeFrom)}
                    </TableCell>
                    <TableCell>{minutesToHoursExtended(abs.timeTo)}</TableCell>
                    <TableCell>
                      {minutesToHoursExtended(abs.timeTo - abs.timeFrom)}
                    </TableCell>
                    <TableCell>
                      {abs.note ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>Види забелешка</TooltipTrigger>
                            <TooltipContent className="max-w-[400px] whitespace-pre-wrap break-words">
                              <p>{abs.note}</p>
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
                        onClick={() => onDeleteHandler(abs.id)}
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
                {absents.length}
              </span>
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              Вкупно отсуство:{" "}
              <span className="font-semibold text-foreground">
                {totalAbsent()}
              </span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}
