import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePickerInput } from "../ui/time-picker-input";
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
import { useAbsentStore } from "@/store/absentStore";
import { useDialogStore } from "@/store/dialogStore";
import { toast } from "react-toastify";

export default function AbsentFormTab() {
  const { selectedEmployee } = useEmployeeStore();
  const { saveAbsent } = useAbsentStore();
  const { setManageDialog } = useDialogStore();

  const formSchema = z.object({
    date: z.date({
      required_error: "Оваа поле е задолжително",
    }),
    hourFrom: z.date(),
    minFrom: z.date(),
    hourTo: z.date(),
    minTo: z.date(),
    note: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourFrom: new Date(new Date().setHours(0, 0)),
      minFrom: new Date(new Date().setHours(0, 0)),
      hourTo: new Date(new Date().setHours(0, 0)),
      minTo: new Date(new Date().setHours(0, 0)),
      note: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null || selectedEmployee?.id === null) return;

    const date = format(values.date, "yyyy-MM-dd");
    const hourFrom = Number(format(values.hourFrom, "HH"));
    const minFrom = Number(format(values.minFrom, "mm"));
    const hourTo = Number(format(values.hourTo, "HH"));
    const minTo = Number(format(values.minTo, "mm"));

    const absent = {
      id: null,
      employeeId: selectedEmployee?.id,
      date,
      timeFrom: hourFrom * 60 + minFrom,
      timeTo: hourTo * 60 + minTo,
      note: values.note,
    } satisfies Absent;
    console.log(absent);

    saveAbsent(absent);
    setManageDialog(false);
    useEmployeeStore.setState({ selectedEmployee: null });
    toast.success(
      `Отсуството за ${selectedEmployee.firstName} ${selectedEmployee.lastName} е успешно внесен.`
    );
  }

  return (
    <section className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="date"
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
                          <span>Избери датум</span>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="hourFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimePickerInput
                        picker="hours"
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimePickerInput
                        picker="minutes"
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="hourTo"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <TimePickerInput
                          picker="hours"
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="minTo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TimePickerInput
                        picker="minutes"
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
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
