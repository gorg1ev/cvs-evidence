import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
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
import { useSickLeaveStore } from "@/store/sickLeaveStore";
import { useDialogStore } from "@/store/dialogStore";
import { toast } from "react-toastify";

export default function SickLeaveFormTab() {
  const { selectedEmployee } = useEmployeeStore();
  const { saveSickLeave } = useSickLeaveStore();
  const { setManageDialog } = useDialogStore();

  const formSchema = z.object({
    dateFrom: z.date(),
    dateTo: z.date(),
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

    const sickLeave = {
      id: null,
      employeeId: selectedEmployee?.id,
      dateFrom: format(values.dateFrom, "yyyy-MM-dd"),
      dateTo: format(values.dateTo, "yyyy-MM-dd"),
      note: values.note,
    } satisfies SickLeave;

    saveSickLeave(sickLeave);
    setManageDialog(false);
    useEmployeeStore.setState({ selectedEmployee: null });
    toast.success(
      `Боледувањето за ${selectedEmployee.firstName} ${selectedEmployee.lastName} е успешно внесен.`
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
                        format(field.value, "PPP")
                      ) : (
                        <span>Избери датум од</span>
                      )}
                      <CalendarIcon className="ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <FormControl>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
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
                        disabled={isDisabled}
                        fromDate={dateFrom ?? undefined}
                      />
                    </PopoverContent>
                  </Popover>
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
                  <Textarea placeholder="Забелешка" {...field} />
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
