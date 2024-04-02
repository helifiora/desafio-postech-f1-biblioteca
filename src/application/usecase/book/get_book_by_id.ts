import type {
  BookNotFoundError,
  BookRepository,
} from "@/application/repository/book_repository.ts";
import type { Book } from "@/model/book.ts";
import type { Result } from "@/result.ts";

export class GetBookById {
  #repo: BookRepository;

  constructor(repo: BookRepository) {
    this.#repo = repo;
  }

  async execute(id: string): Promise<Result<Book, BookNotFoundError>> {
    return await this.#repo.get(id);
  }
}
