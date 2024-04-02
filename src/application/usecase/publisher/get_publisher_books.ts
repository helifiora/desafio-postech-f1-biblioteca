import type { BookRepository } from "@/application/repository/book_repository.ts";
import type { Book } from "@/model/book.ts";

export class GetPublisherBooks {
  #repo: BookRepository;

  constructor(repo: BookRepository) {
    this.#repo = repo;
  }

  async execute(publisherId: string): Promise<Book[]> {
    return await this.#repo.getMany({ publisherId });
  }
}
