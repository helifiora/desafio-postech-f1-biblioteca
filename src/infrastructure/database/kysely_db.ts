import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Db } from "./tables.ts";

export function openDb(path: string): Kysely<Db> {
  const database = new Database(path);
  const dialect = new SqliteDialect({ database });
  return new Kysely<Db>({ dialect });
}
