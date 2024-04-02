import type {
  BookDeleteError,
  BookRepository,
} from "@/application/repository/book_repository.ts";

export class DeleteBook {
  #repo: BookRepository;

  constructor(repo: BookRepository) {
    this.#repo = repo;
  }

  async execute(bookId: string): Promise<BookDeleteError | null> {
    return await this.#repo.delete(bookId);
  }
}
