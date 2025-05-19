import { eq } from "drizzle-orm";
import { db } from "./db";
import { employees } from "./schema";

export async function getEmployees(): Promise<Employee[]> {
  const rows = await db
    .select({
      id: employees.id,
      firstName: employees.firstName,
      lastName: employees.lastName,
      personalNumber: employees.personalNumber,
    })
    .from(employees);

  return rows;
}

export async function getEmployee(id: number): Promise<Employee | null> {
  const row = await db
    .select({
      id: employees.id,
      firstName: employees.firstName,
      lastName: employees.lastName,
      personalNumber: employees.personalNumber,
    })
    .from(employees)
    .where(eq(employees.id, id));

  return row[0] ?? null;
}

export async function saveEmployee(employee: Employee) {
  await db.insert(employees).values({
    firstName: employee.firstName,
    lastName: employee.lastName,
    personalNumber: employee.personalNumber ?? null,
  });
}

export async function editEmployee(employee: Employee) {
  if (employee?.id === null) return;

  await db
    .update(employees)
    .set({
      firstName: employee.firstName,
      lastName: employee.lastName,
      personalNumber: employee.personalNumber,
    })
    .where(eq(employees.id, employee.id));
}

export async function deleteEmployee(id: number) {
  await db.delete(employees).where(eq(employees.id, id));
}
