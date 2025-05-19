import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { InputOTP, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useDialogStore } from "@/store/dialogStore";
import { useEmployeeStore } from "@/store/employeeStore";
import { useEffect } from "react";

export default function EmployeeDialogForm() {
  const { employeeDialogForm, setEmployeeDialogForm } = useDialogStore();
  const { selectedEmployee, saveEmployee, editEmployee } = useEmployeeStore();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: "Оваа поле е задолжително" }),
    lastName: z.string().min(1, { message: "Оваа поле е задолжително" }),
    personalNumber: z
      .string()
      .refine((value) => value.length === 0 || value.length === 13, {
        message: "ЕМБГ мора да биде 13 цифри.",
      }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      personalNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedEmployee === null) saveEmployee(values as Employee);
    else editEmployee({ id: selectedEmployee.id, ...values } as Employee);

    setEmployeeDialogForm(false);
    form.reset();
  }

  function handleOpenChange(isOpen: boolean) {
    setEmployeeDialogForm(isOpen);
    if (!isOpen) {
      useEmployeeStore.setState({ selectedEmployee: null });
      form.reset();
    }
  }

  useEffect(() => {
    if (selectedEmployee === null) {
      form.reset();
      return;
    }

    form.setValue("firstName", selectedEmployee?.firstName);
    form.setValue("lastName", selectedEmployee?.lastName);
    form.setValue("personalNumber", selectedEmployee?.personalNumber ?? "");
  }, [form, selectedEmployee]);

  return (
    <Dialog open={employeeDialogForm} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Додади вработен
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEmployee ? "Уреди вработен" : "Додади нов вработен"}
          </DialogTitle>
          <DialogDescription>
            {selectedEmployee
              ? `(${selectedEmployee.firstName} ${selectedEmployee.lastName})`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Презиме</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ЕМБГ</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={13}
                      value={field.value}
                      onChange={field.onChange}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: 13 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} className="w-6" />
                        ))}
                      </div>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {selectedEmployee ? "Уреди" : "Додади"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
