import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const absent = sqliteTable("absent", {
  id: integer().primaryKey({ autoIncrement: true }),
  employeeId: integer()
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  date: text().notNull(),
  timeFrom: integer().notNull(),
  timeTo: integer().notNull(),
  note: text(),
});

export const sickLeave = sqliteTable("sickLeave", {
  id: integer().primaryKey({ autoIncrement: true }),
  employeeId: integer()
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  dateFrom: text().notNull(),
  dateTo: text().notNull(),
  note: text(),
});

export const vacation = sqliteTable("vacation", {
  id: integer().primaryKey({ autoIncrement: true }),
  employeeId: integer()
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  dateFrom: text().notNull(),
  dateTo: text().notNull(),
  note: text(),
});

export const employees = sqliteTable("employees", {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text().notNull(),
  lastName: text().notNull(),
  personalNumber: text(),
});
