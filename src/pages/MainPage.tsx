import EmployeeDialogForm from "@/components/ListEmployee/EmployeeDialogForm";
import ListEmployeeTable from "@/components/ListEmployee/ListEmployeeTable";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function MainPage() {
  useEffect(() => {
    document.title = "Лист на вработени";
  }, []);

  return (
    <>
      <div>
        <header className="flex justify-between">
          <div>
            <Input type="email" placeholder="Пребарувај по име" disabled={true} />
          </div>
          <EmployeeDialogForm />
        </header>
        <main className="mt-10">
          <ListEmployeeTable />
        </main>
      </div>
    </>
  );
}
