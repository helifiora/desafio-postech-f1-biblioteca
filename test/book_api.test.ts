import { randomUUID } from "node:crypto";
import { describe, it, beforeEach } from "node:test";
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
import { Book } from "@/model/book.ts";

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

describe("Get Books", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
  });

  it("Should return empty array when db has no data", async () => {
    const response = await api.request("/books");
    const result = await response.json();
    assert.deepStrictEqual(result, []);
  });

  it("Should return books when has data", async () => {
    const publisher = Publisher.create("Nova editora!");
    await publisherRepo.create(publisher);

    const books = [
      {
        isbn: "34329158-c817-418b-960e-4d784f2927df",
        title: "Código Notebook",
        author: "John Doe",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "f980683c-0987-4eb1-82a2-8a3fa61fd9f9",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },

      {
        isbn: "672a6656-8969-4f41-a783-009782f116f6",
        title: "Ron n",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
    ];

    for (const c of books) {
      const book = new Book(
        c.isbn,
        c.title,
        c.author,
        c.publisherId,
        new Date(c.publishDate)
      );

      await bookRepo.create(book);
    }

    const response = await api.request("/books");

    const result = await response.json();
    assert.deepStrictEqual(result, books);
  });
});

describe("Get Book By Id", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;
  let books: any;
  let publisher: Publisher;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
    publisher = Publisher.create("Nova editora!");
    await publisherRepo.create(publisher);
    books = [
      {
        isbn: "34329158-c817-418b-960e-4d784f2927df",
        title: "Código Notebook",
        author: "John Doe",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "f980683c-0987-4eb1-82a2-8a3fa61fd9f9",
        title: "Rona aldo 2",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "672a6656-8969-4f41-a783-009782f116f6",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
    ];

    for (const c of books) {
      const book = new Book(
        c.isbn,
        c.title,
        c.author,
        c.publisherId,
        new Date(c.publishDate)
      );

      await bookRepo.create(book);
    }
  });

  it("Should return NotFound when isbn doest not match any item", async () => {
    const response = await api.request("books/123456");
    assert.equal(response.status, 404);
  });

  it("Should return item when isbn match an item", async () => {
    const response = await api.request(
      "books/34329158-c817-418b-960e-4d784f2927df"
    );

    const result = await response.json();
    assert.equal(response.status, 200);
    assert.deepStrictEqual(result, {
      isbn: "34329158-c817-418b-960e-4d784f2927df",
      title: "Código Notebook",
      author: "John Doe",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
    });
  });
});

describe("Create Book", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;
  let books: any;
  let publisher: Publisher;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
    publisher = Publisher.create("Nova editora!");
    await publisherRepo.create(publisher);
    books = [
      {
        isbn: "34329158-c817-418b-960e-4d784f2927df",
        title: "Código Notebook",
        author: "John Doe",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "f980683c-0987-4eb1-82a2-8a3fa61fd9f9",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "672a6656-8969-4f41-a783-009782f116f6",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
    ];

    for (const c of books) {
      const book = new Book(
        c.isbn,
        c.title,
        c.author,
        c.publisherId,
        new Date(c.publishDate)
      );

      await bookRepo.create(book);
    }
  });

  it("Should create a new item", async () => {
    const item = {
      isbn: "9a9eabed-0170-4be3-a289-40aa609a6d53",
      title: "Ron Doe",
      author: "Marya Blue",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
    };

    const response = await api.request("/books", {
      body: JSON.stringify(item),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    assert.equal(response.status, 201);
    assert.deepStrictEqual(result, {
      isbn: "9a9eabed-0170-4be3-a289-40aa609a6d53",
      title: "Ron Doe",
      author: "Marya Blue",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
    });
  });

  it("Should return error when isbn already exists", async () => {
    const item = {
      isbn: "672a6656-8969-4f41-a783-009782f116f6",
      title: "Ron Doe",
      author: "Marya Blue",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
    };

    const response = await api.request("/books", {
      body: JSON.stringify(item),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    assert.equal(response.status, 500);
  });

  it("Should schema return error with invalid title data", async () => {
    const item = {
      isbn: "672a6686-8969-4f41-a783-009782f116f6",
      title: "",
      author: "Marya Blue",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
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

  it("Should schema return error with invalid author data", async () => {
    const item = {
      isbn: "672a6686-8969-4f41-a783-009782f116f6",
      title: "Ron",
      author: "",
      publisherId: publisher.id,
      publishDate: "2024-03-25T00:00:00.000Z",
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

  it("Should schema return error with invalid publisherData data", async () => {
    const item = {
      isbn: "672a6686-8969-4f41-a783-009782f116f6",
      title: "Ron",
      author: "Author",
      publisherId: publisher.id,
      publishDate: "",
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

  it("Should return error when publisher does not found", async () => {
    const item = {
      isbn: "672a6686-8969-4f41-a783-009782f116f6",
      title: "Ron",
      author: "Author",
      publisherId: randomUUID(),
      publishDate: "2024-03-25T00:00:00.000Z",
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

describe("Delete Book", () => {
  let api: Hono;
  let bookRepo: BookRepository;
  let publisherRepo: PublisherRepository;
  let books: any;
  let publisher: Publisher;

  beforeEach(async () => {
    [api, publisherRepo, bookRepo] = await getApi();
    publisher = Publisher.create("Nova editora!");
    await publisherRepo.create(publisher);
    books = [
      {
        isbn: "34329158-c817-418b-960e-4d784f2927df",
        title: "Código Notebook",
        author: "John Doe",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "f980683c-0987-4eb1-82a2-8a3fa61fd9f9",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
      {
        isbn: "672a6656-8969-4f41-a783-009782f116f6",
        title: "Ron aldo",
        author: "Marya Blue",
        publisherId: publisher.id,
        publishDate: "2024-03-25T00:00:00.000Z",
      },
    ];

    for (const c of books) {
      const book = new Book(
        c.isbn,
        c.title,
        c.author,
        c.publisherId,
        new Date(c.publishDate)
      );

      await bookRepo.create(book);
    }
  });

  it("Should delete an item", async () => {
    const response = await api.request(
      "/books/672a6656-8969-4f41-a783-009782f116f6",
      {
        method: "DELETE",
      }
    );

    assert.equal(response.status, 204);
  });

  it("Should do nothing if isbn doest not exists", async () => {
    const response = await api.request(
      "/books/f980683c-0987-4eb1-82a2-8a3fa61fd9f2",
      {
        method: "DELETE",
      }
    );

    assert.equal(response.status, 204);
  });
});
