import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { vacation } from "./schema";

export async function getEmployeeVacations({
  employeeId,
  startDate,
  endDate,
}: VacationFilter): Promise<Vacation[] | null> {
  const conditions = [eq(vacation.employeeId, employeeId)];

  if (startDate) conditions.push(gte(vacation.dateFrom, startDate));

  if (endDate) conditions.push(lte(vacation.dateTo, endDate));

  return await db
    .select()
    .from(vacation)
    .where(and(...conditions))
    .orderBy(desc(vacation.dateFrom));
}
export async function saveVacation(v: Vacation) {
  await db.insert(vacation).values({
    employeeId: v.employeeId,
    dateFrom: v.dateFrom,
    dateTo: v.dateTo,
    note: v.note,
  });
}

export async function countVacationsByEmployeeId(
  employeeId: number
): Promise<number> {
  const result = await db
    .select()
    .from(vacation)
    .where(eq(vacation.employeeId, employeeId));

  return result.length;
}

export async function deleteVacation(id: number) {
  await db.delete(vacation).where(eq(vacation.id, id));
}
