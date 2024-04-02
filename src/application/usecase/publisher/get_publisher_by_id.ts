import type { Publisher } from "@/model/publisher.ts";
import type { Result } from "@/result.ts";
import type {
  PublisherNotFoundError,
  PublisherRepository,
} from "@/application/repository/publisher_repository.ts";

type Input = { id: string };
type Output = Result<Publisher, PublisherNotFoundError>;

export class GetPublisherById {
  #repo: PublisherRepository;

  constructor(repo: PublisherRepository) {
    this.#repo = repo;
  }

  async execute(input: Input): Promise<Output> {
    return await this.#repo.get(input.id);
  }
}
