import fs from "node:fs/promises";
import path from "node:path";
import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import type { Db } from "./tables.ts";
import { openDb } from "./kysely_db.ts";

export async function doMigration(db: Kysely<Db>): Promise<void> {
  const migrationFolder = path.resolve("src", "infrastructure", "migrations");
  const provider = new FileMigrationProvider({ fs, path, migrationFolder });
  const migrator = new Migrator({ db, provider });
  await migrator.migrateToLatest();
}

export async function migrate(path: string): Promise<void> {
  const db = openDb(path);
  await doMigration(db);
  await db.destroy();
}
