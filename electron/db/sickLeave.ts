import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { sickLeave } from "./schema";

export async function getEmployeeSickLeaves({
  employeeId,
  startDate,
  endDate,
}: SickLeaveFilter): Promise<SickLeave[] | null> {
  const conditions = [eq(sickLeave.employeeId, employeeId)];

  if (startDate) conditions.push(gte(sickLeave.dateFrom, startDate));

  if (endDate) conditions.push(lte(sickLeave.dateTo, endDate));

  return await db
    .select()
    .from(sickLeave)
    .where(and(...conditions))
    .orderBy(desc(sickLeave.dateFrom));
}

export async function saveSickLeave(sl: SickLeave) {
  await db.insert(sickLeave).values({
    employeeId: sl.employeeId,
    dateFrom: sl.dateFrom,
    dateTo: sl.dateTo,
    note: sl.note,
  });
}

export async function countSickLeavesByEmployeeId(
  employeeId: number
): Promise<number> {
  const result = await db
    .select()
    .from(sickLeave)
    .where(eq(sickLeave.employeeId, employeeId));

  return result.length;
}

export async function deleteSickLeave(id: number) {
  await db.delete(sickLeave).where(eq(sickLeave.id, id));
}
