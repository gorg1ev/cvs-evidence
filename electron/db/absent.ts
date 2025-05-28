// import { eq } from "drizzle-orm";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { absent } from "./schema";

export async function getEmployeeAbsents({
  employeeId,
  startDate,
  endDate,
}: AbsentFilter): Promise<Absent[] | null> {
  const conditions = [eq(absent.employeeId, employeeId)];

  if (startDate) conditions.push(gte(absent.date, startDate));

  if (endDate) conditions.push(lte(absent.date, endDate));

  return await db
    .select()
    .from(absent)
    .where(and(...conditions))
    .orderBy(desc(absent.date));
}

export async function saveAbsent(a: Absent) {
  await db.insert(absent).values({
    employeeId: a.employeeId,
    date: a.date,
    timeFrom: a.timeFrom,
    timeTo: a.timeTo,
    note: a.note,
    total: a.total,
  });
}

export async function countAbsentsByEmployeeId(
  employeeId: number
): Promise<number> {
  const result = await db
    .select()
    .from(absent)
    .where(eq(absent.employeeId, employeeId));

  return result.length;
}

export async function deleteAbsent(id: number) {
  await db.delete(absent).where(eq(absent.id, id));
}
