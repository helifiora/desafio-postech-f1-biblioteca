import { z } from "zod";
import * as http from "@/infrastructure/http_response.ts";

import {
  type BookRepository,
  type PublisherRepository,
  PublisherNotFoundError,
} from "@/application/repository/mod.ts";

import {
  CreateBook,
  DeleteBook,
  GetBookById,
  GetBooks,
} from "@/application/usecase/book/mod.ts";

export class BookController {
  #bookRepo: BookRepository;
  #publisherRepo: PublisherRepository;

  constructor(bookRepo: BookRepository, publisherRepo: PublisherRepository) {
    this.#bookRepo = bookRepo;
    this.#publisherRepo = publisherRepo;
  }

  async index(): Promise<Response> {
    const useCase = new GetBooks(this.#bookRepo);
    const result = await useCase.execute();
    return http.ok(result);
  }

  async show(isbn: string): Promise<Response> {
    const useCase = new GetBookById(this.#bookRepo);
    const result = await useCase.execute(isbn);
    if (!result.ok) {
      return http.notFound();
    }

    return http.ok(result.data);
  }

  async create(model: unknown): Promise<Response> {
    const schema = CreateSchema.safeParse(model);
    if (!schema.success) {
      return http.badRequest(schema.error.message);
    }

    const { data } = schema;

    const useCase = new CreateBook(this.#bookRepo, this.#publisherRepo);
    const result = await useCase.execute({
      isbn: data.isbn,
      author: data.author,
      publishDate: new Date(data.publishDate),
      publisherId: data.publisherId,
      title: data.title,
    });

    if (result.ok) {
      return http.created(result.data);
    }

    if (result.error instanceof PublisherNotFoundError) {
      return http.badRequest("Publisher not found!");
    }

    return http.internalError("Error creating book");
  }

  async delete(id: string): Promise<Response> {
    const useCase = new DeleteBook(this.#bookRepo);
    const result = await useCase.execute(id);
    if (result !== null) {
      return http.internalError("Error deleting book");
    }

    return http.noContent();
  }
}

const CreateSchema = z.object({
  isbn: z.string(),
  title: z.string().min(1, "Title required!"),
  author: z.string().min(1, "Author required!"),
  publisherId: z.string().min(1, "PublisherId required!"),
  publishDate: z.string().datetime({ message: "Invalid publishDate!" }),
});
