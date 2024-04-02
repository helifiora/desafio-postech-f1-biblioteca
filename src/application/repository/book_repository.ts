import type { Book } from "@/model/book.ts";
import type { Result } from "@/result.ts";

export interface BookRepository {
  get(isbn: string): Promise<Result<Book, BookNotFoundError>>;
  getMany(options?: GetManyOptions): Promise<Book[]>;
  create(book: Book): Promise<BookCreateError | null>;
  update(book: Book): Promise<BookUpdateError | null>;
  delete(isbn: string): Promise<BookDeleteError | null>;
}

export type GetManyOptions = { publisherId?: string };

export class BookNotFoundError extends Error {
  constructor(readonly isbn: string) {
    super();
  }
}

export class BookCreateError extends Error {}
export class BookUpdateError extends Error {}
export class BookDeleteError extends Error {}
