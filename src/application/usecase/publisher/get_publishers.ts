import type { PublisherRepository } from "@/application/repository/mod.ts";
import type { Publisher } from "@/model/publisher.ts";

export class GetPublishers {
  #repo: PublisherRepository;

  constructor(repo: PublisherRepository) {
    this.#repo = repo;
  }

  async execute(): Promise<Publisher[]> {
    return await this.#repo.getMany();
  }
}
