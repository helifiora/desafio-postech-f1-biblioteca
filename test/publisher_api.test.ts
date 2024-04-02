import { describe, it, beforeEach } from "node:test";
import { randomUUID } from "node:crypto";
import * as assert from "node:assert";
import { Hono } from "hono";
import { openDb } from "@/infrastructure/database/kysely_db.ts";
import { doMigration } from "@/infrastructure/database/kysely_migrator.ts";
import {
  KyselyBookRepository,
  KyselyPublisherRepository,
} from "@/infrastructure/repository/mod.ts";
import { useBookRoute } from "@/route/book_route.ts";
import { usePublisherRoute } from "@/route/publisher_route.ts";
import { BookRepository } from "@/application/repository/book_repository.ts";
import { PublisherRepository } from "@/application/repository/publisher_repository.ts";
import { Publisher } from "@/model/publisher.ts";

async function getApi(): Promise<[Hono, PublisherRepository, BookRepository]> {
  const db = openDb(":memory:");
  await doMigration(db);
  const bookRepo = new KyselyBookRepository(db);
  const publisherRepo = new KyselyPublisherRepository(db);
  const api = new Hono();
  useBookRoute(api, "/books", { bookRepo, publisherRepo });
  usePublisherRoute(api, "/publishers", { bookRepo, publisherRepo });
  return [api, publisherRepo, bookRepo];
}

describe("Get Publishers", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
  });

  it("Should return empty array when db has no data", async () => {
    const response = await api.request("/publishers");
    const result = await response.json();
    assert.deepStrictEqual(result, []);
  });

  it("Should return publishsers when has data", async () => {
    const publishers = [
      {
        id: randomUUID(),
        name: "Editora 1",
      },
      {
        id: randomUUID(),
        name: "Editora 2",
      },
    ];

    for (const publisher of publishers) {
      await publisherRepo.create(publisher);
    }

    const response = await api.request("/publishers");
    const result = await response.json();
    assert.deepStrictEqual(result, publishers);
  });
});

describe("Get Book By Id", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;
  let publishers: any;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
    publishers = [
      {
        id: "284073e2-3494-4653-8f8e-38dfe2ce664d",
        name: "Editora 1",
      },
      {
        id: "b94f85b6-c49e-41f1-a54a-9a893f3be983",
        name: "Editora 2",
      },
      {
        id: "4c20ae47-8b0c-46c3-9dcc-03ba2afaf5f9",
        name: "Editora 3",
      },
    ];

    for (const publisher of publishers) {
      await publisherRepo.create(new Publisher(publisher.id, publisher.name));
    }
  });

  it("Should return NotFound when isbn doest not match any item", async () => {
    const response = await api.request("publishers/123456");
    assert.equal(response.status, 404);
  });

  it("Should return item when id match an item", async () => {
    const response = await api.request(
      "publishers/4c20ae47-8b0c-46c3-9dcc-03ba2afaf5f9"
    );

    const result = await response.json();
    assert.equal(response.status, 200);
    assert.deepStrictEqual(result, {
      id: "4c20ae47-8b0c-46c3-9dcc-03ba2afaf5f9",
      name: "Editora 3",
    });
  });
});

describe("Create Publisher", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;
  let publishers: any;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
    publishers = [
      {
        id: "284073e2-3494-4653-8f8e-38dfe2ce664d",
        name: "Editora 1",
      },
      {
        id: "b94f85b6-c49e-41f1-a54a-9a893f3be983",
        name: "Editora 2",
      },
      {
        id: "4c20ae47-8b0c-46c3-9dcc-03ba2afaf5f9",
        name: "Editora 3",
      },
    ];

    for (const publisher of publishers) {
      await publisherRepo.create(new Publisher(publisher.id, publisher.name));
    }
  });

  it("Should create a new item", async () => {
    const item = {
      name: "Editora 4",
    };

    const response = await api.request("/publishers", {
      body: JSON.stringify(item),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    assert.equal(response.status, 201);
    assert.deepStrictEqual(result.name, "Editora 4");
  });

  it("Should return error when name already exists", async () => {
    const item = { name: "Editora 3" };

    const response = await api.request("/publishers", {
      body: JSON.stringify(item),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    assert.equal(response.status, 500);
  });

  it("Should return error with invalid name property", async () => {
    const item = {
      id: "b94f85b6-c49e-41f1-a54a-9a893f3be983",
      name: "",
    };

    const response = await api.request("/books", {
      body: JSON.stringify(item),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    assert.equal(response.status, 402);
  });
});
