import type {
  BookCreateError,
  BookRepository,
} from "@/application/repository/book_repository.ts";

import type {
  PublisherNotFoundError,
  PublisherRepository,
} from "@/application/repository/publisher_repository.ts";

import { Book } from "@/model/book.ts";
import { err, ok, Result } from "@/result.ts";

type Input = {
  isbn: string;
  title: string;
  author: string;
  publisherId: string;
  publishDate: Date;
};

type Output = Result<Book, BookCreateError | PublisherNotFoundError>;

export class CreateBook {
  #bookRepo: BookRepository;
  #publisherRepo: PublisherRepository;

  constructor(bookRepo: BookRepository, publisherRepo: PublisherRepository) {
    this.#bookRepo = bookRepo;
    this.#publisherRepo = publisherRepo;
  }

  async execute(input: Input): Promise<Output> {
    const publisher = await this.#publisherRepo.get(input.publisherId);
    if (!publisher.ok) {
      return publisher;
    }

    const book = new Book(
      input.isbn,
      input.title,
      input.author,
      input.publisherId,
      input.publishDate
    );

    const result = await this.#bookRepo.create(book);
    if (result !== null) {
      return err(result);
    }

    return ok(book);
  }
}
