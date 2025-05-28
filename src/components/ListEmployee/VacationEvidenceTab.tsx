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
import { cn, formatDate, formatDateMKD } from "@/lib/utils";
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
import { Calendar } from "../ui/calendar";
import EvidenceAlert from "./EvidenceAlert";
import { useVacationStore } from "@/store/vacationStore";
import { enGB } from "date-fns/locale";

export default function VacationEvidenceTab() {
  const { selectedEmployee } = useEmployeeStore();
  const {
    vacations,
    getVacations,
    vacationLength,
    getVacationsLenght,
    deleteVacation,
  } = useVacationStore();

  const formSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getVacations({
      employeeId: selectedEmployee?.id,
      startDate: values.startDate && formatDate(values.startDate),
      endDate: values.endDate && formatDate(values.endDate),
    } as SickLeaveFilter);
  }

  function onReset() {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    getVacations({ employeeId: selectedEmployee?.id });

    form.reset();
  }

  function totalVacation() {
    return vacations.reduce((sum, v) => sum + (v.total ?? 0), 0);
  }

  function onDeleteHandler(id: number | null) {
    if (id === null) return;

    deleteVacation(id);
  }

  useEffect(() => {
    function getVacationsData() {
      if (selectedEmployee === null || selectedEmployee.id === null) return;

      getVacationsLenght(selectedEmployee.id);
      getVacations({ employeeId: selectedEmployee?.id });
    }

    getVacationsData();

    window.ipcRenderer.on("vacation-deleted", getVacationsData);

    return () => {
      window.ipcRenderer.removeListener("vacation-deleted", getVacationsData);
    };
  }, [selectedEmployee, getVacations, getVacationsLenght]);

  if (vacationLength === 0) {
    return (
      <EvidenceAlert
        title="Нема евидентирани одмори"
        description="За избраниот вработен нема внесено одмори. Додадете одмори за да
          започнете со евиденција."
      />
    );
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-5">
          <div className="flex gap-2">
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
                            formatDateMKD(field.value)
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
                              formatDateMKD(field.value)
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

      {vacations.length === 0 ? (
        <EvidenceAlert
          title="Нема евидентирани одмори"
          description="Во избраниот период нема евидентирани одмори."
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
                {vacations.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{formatDateMKD(v.dateFrom)}</TableCell>
                    <TableCell>{formatDateMKD(v.dateTo)}</TableCell>
                    <TableCell className="text-center">{v.total}</TableCell>
                    <TableCell>
                      {v.note ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>Види забелешка</TooltipTrigger>
                            <TooltipContent className="max-w-[400px] whitespace-pre-wrap break-words">
                              <p>{v.note}</p>
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
                        onClick={() => onDeleteHandler(v.id)}
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
                {vacations.length}
              </span>
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              Вкупно отсуство:{" "}
              <span className="font-semibold text-foreground">
                {totalVacation()}
              </span>
            </p>
          </div>
        </>
      )}
    </section>
  );
}
