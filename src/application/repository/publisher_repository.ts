import type { Publisher } from "@/model/publisher.ts";
import type { Result } from "@/result.ts";

export interface PublisherRepository {
  get(id: string): Promise<Result<Publisher, PublisherNotFoundError>>;
  getMany(): Promise<Publisher[]>;
  create(publisher: Publisher): Promise<PublisherCreationError | null>;
}

export class PublisherNotFoundError extends Error {
  constructor(readonly id: string) {
    super();
  }
}

export class PublisherCreationError extends Error {}
