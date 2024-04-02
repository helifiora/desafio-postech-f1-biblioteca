import type { Kysely } from "kysely";
import type { Db, PublisherTable } from "../database/tables.ts";
import {
  PublisherCreationError,
  PublisherNotFoundError,
  PublisherRepository,
} from "@/application/repository/publisher_repository.ts";
import { Publisher } from "@/model/publisher.ts";
import { Result, ok, err } from "@/result.ts";

export class KyselyPublisherRepository implements PublisherRepository {
  #db: Kysely<Db>;

  constructor(db: Kysely<Db>) {
    this.#db = db;
  }

  async get(id: string): Promise<Result<Publisher, PublisherNotFoundError>> {
    const result = await this.#db
      .selectFrom("publishers")
      .where("publishers.id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      return err(new PublisherNotFoundError(id));
    }

    return ok(this.#parse(result));
  }

  async getMany(): Promise<Publisher[]> {
    const result = await this.#db
      .selectFrom("publishers")
      .selectAll()
      .execute();

    return result.map((s) => this.#parse(s));
  }

  async create(publisher: Publisher): Promise<PublisherCreationError | null> {
    try {
      await this.#db
        .insertInto("publishers")
        .values({ id: publisher.id, name: publisher.name })
        .execute();

      return null;
    } catch (e) {
      return new PublisherCreationError(`${e}`);
    }
  }

  #parse(data: PublisherTable): Publisher {
    return new Publisher(data.id, data.name);
  }
}
