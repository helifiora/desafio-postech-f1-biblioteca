import type { BookRepository } from "@/application/repository/book_repository.ts";
import type { Book } from "@/model/book.ts";

export class GetBooks {
  #repo: BookRepository;

  constructor(repo: BookRepository) {
    this.#repo = repo;
  }

  async execute(): Promise<Book[]> {
    return await this.#repo.getMany();
  }
}
