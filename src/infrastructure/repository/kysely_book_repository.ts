import type { Kysely } from "kysely";
import type { BookTable, Db } from "../database/tables.ts";
import { Book } from "@/model/book.ts";
import {
  BookCreateError,
  BookDeleteError,
  BookNotFoundError,
  BookRepository,
  BookUpdateError,
  type GetManyOptions,
} from "@/application/repository/book_repository.ts";
import { Result, ok, err } from "@/result.ts";

export class KyselyBookRepository implements BookRepository {
  #db: Kysely<Db>;

  constructor(db: Kysely<Db>) {
    this.#db = db;
  }

  async get(isbn: string): Promise<Result<Book, BookNotFoundError>> {
    const result = await this.#db
      .selectFrom("books")
      .where("books.isbn", "=", isbn)
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      return err(new BookNotFoundError(isbn));
    }

    return ok(this.#parse(result));
  }

  async getMany(options?: GetManyOptions): Promise<Book[]> {
    let stmt = this.#db.selectFrom("books");
    if (options?.publisherId) {
      stmt = stmt.where("books.publisher_id", "=", options.publisherId);
    }

    const result = await stmt.selectAll().execute();
    return result.map((s) => this.#parse(s));
  }

  async create(book: Book): Promise<BookCreateError | null> {
    try {
      await this.#db
        .insertInto("books")
        .values({
          author: book.author,
          isbn: book.isbn,
          publish_date: book.publishDate.toISOString(),
          publisher_id: book.publisherId,
          title: book.title,
        })
        .executeTakeFirst();

      return null;
    } catch (e) {
      return new BookCreateError(`${e}`);
    }
  }

  async update(book: Book): Promise<BookUpdateError | null> {
    try {
      await this.#db
        .updateTable("books")
        .set({
          author: book.author,
          publish_date: book.publishDate.toISOString(),
          publisher_id: book.publisherId,
          title: book.title,
        })
        .where("books.isbn", "=", book.isbn)
        .execute();

      return null;
    } catch (e) {
      return new BookUpdateError(`${e}`);
    }
  }

  async delete(isbn: string): Promise<BookDeleteError | null> {
    try {
      await this.#db
        .deleteFrom("books")
        .where("books.isbn", "=", isbn)
        .execute();

      return null;
    } catch (e) {
      return new BookDeleteError(`${e}`);
    }
  }

  #parse(data: BookTable): Book {
    return new Book(
      data.isbn,
      data.title,
      data.author,
      data.publisher_id,
      new Date(data.publish_date)
    );
  }
}
