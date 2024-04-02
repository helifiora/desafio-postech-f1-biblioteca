import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("publishers")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "varchar(100)", (col) => col.unique().notNull())
    .execute();

  await db.schema
    .createTable("books")
    .addColumn("isbn", "text", (col) => col.primaryKey())
    .addColumn("author", "varchar(100)", (col) => col.notNull())
    .addColumn("title", "varchar(100)", (col) => col.notNull())
    .addColumn("publisher_id", "text", (col) =>
      col.references("publishers.id").onDelete("cascade").notNull()
    )
    .addColumn("publish_date", "datetime", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("publishers").execute();
  await db.schema.dropTable("books").execute();
}
