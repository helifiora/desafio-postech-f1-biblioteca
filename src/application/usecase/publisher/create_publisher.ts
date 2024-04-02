import { Publisher } from "@/model/publisher.ts";
import {
  PublisherCreationError,
  PublisherRepository,
} from "@/application/repository/publisher_repository.ts";
import { Result, ok, err } from "@/result.ts";

type Input = { name: string };
type Output = Result<Publisher, PublisherCreationError>;

export class CreatePublisher {
  #repo: PublisherRepository;

  constructor(repo: PublisherRepository) {
    this.#repo = repo;
  }

  async execute(input: Input): Promise<Output> {
    const publisher = Publisher.create(input.name);
    const result = await this.#repo.create(publisher);
    if (result !== null) {
      return err(result);
    }

    return ok(publisher);
  }
}
