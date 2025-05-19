import type { Config } from "drizzle-kit";

export default {
  schema: "./electron/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/employees.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
