import { cn, formatDate, formatDateMKD } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useEmployeeStore } from "@/store/employeeStore";
import { useVacationStore } from "@/store/vacationStore";
import { toast } from "react-toastify";
import { useDialogStore } from "@/store/dialogStore";
import { enGB } from "date-fns/locale";

export default function VacationFormTab() {
  const { selectedEmployee } = useEmployeeStore();
  const { saveVacation } = useVacationStore();
  const { setManageDialog } = useDialogStore();

  const formSchema = z.object({
    dateFrom: z.date({ required_error: "Оваа поле е задолжително" }),
    dateTo: z.date({ required_error: "Оваа поле е задолжително" }),
    note: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null || selectedEmployee.id === null) return;

    const vacaton = {
      id: null,
      employeeId: selectedEmployee?.id,
      dateFrom: formatDate(values.dateFrom),
      dateTo: formatDate(values.dateTo),
      note: values.note,
    } satisfies Vacation;

    saveVacation(vacaton);
    setManageDialog(false);
    useEmployeeStore.setState({ selectedEmployee: null });
    toast.success(
      `Одморото за ${selectedEmployee.firstName} ${selectedEmployee.lastName} е успешно внесен.`
    );
  }

  return (
    <section className="mt-5 flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem>
                <Popover>
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
                  <FormControl>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={enGB}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </FormControl>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => {
              const dateFrom = form.watch("dateFrom");
              const isDisabled = !dateFrom;

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
                          disabled={isDisabled}
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
                        disabled={isDisabled}
                        fromDate={dateFrom ?? undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Забелешка"
                    className="mt-5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Зачувај</Button>
        </form>
      </Form>
    </section>
  );
}
