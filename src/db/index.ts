import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL);
// type the db with Drizzle and our schema
const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

export default db;
