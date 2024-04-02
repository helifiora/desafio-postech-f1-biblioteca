import { z } from "zod";
import * as http from "@/infrastructure/http_response.ts";

import type {
  BookRepository,
  PublisherRepository,
} from "@/application/repository/mod.ts";

import {
  CreatePublisher,
  GetPublisherBooks,
  GetPublisherById,
  GetPublishers,
} from "@/application/usecase/publisher/mod.ts";

export class PublisherController {
  #bookRepo: BookRepository;
  #publisherRepo: PublisherRepository;

  constructor(bookRepo: BookRepository, publisherRepo: PublisherRepository) {
    this.#bookRepo = bookRepo;
    this.#publisherRepo = publisherRepo;
  }

  async index(): Promise<Response> {
    const useCase = new GetPublishers(this.#publisherRepo);
    const result = await useCase.execute();
    return http.ok(result);
  }

  async show(id: string): Promise<Response> {
    const useCase = new GetPublisherById(this.#publisherRepo);
    const result = await useCase.execute({ id });
    if (!result.ok) {
      return http.notFound();
    }

    return http.ok(result.data);
  }

  async showBooks(id: string): Promise<Response> {
    const useCase = new GetPublisherBooks(this.#bookRepo);
    const result = await useCase.execute(id);
    return http.ok(result);
  }

  async create(model: unknown): Promise<Response> {
    const schema = z.object({ name: z.string().min(1) });
    const schemaResult = schema.safeParse(model);
    if (!schemaResult.success) {
      return http.badRequest("Invalid property name!");
    }

    const useCase = new CreatePublisher(this.#publisherRepo);
    const result = await useCase.execute({
      name: schemaResult.data.name,
    });

    if (!result.ok) {
      return http.internalError(result.error.message);
    }

    return http.created(result.data);
  }
}
