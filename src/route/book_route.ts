import { Hono } from "hono";
import { BookController } from "@/controller/book_controller.ts";

import type {
  PublisherRepository,
  BookRepository,
} from "@/application/repository/mod.ts";

type Deps = { bookRepo: BookRepository; publisherRepo: PublisherRepository };

function controller(deps: Deps): BookController {
  return new BookController(deps.bookRepo, deps.publisherRepo);
}

export function useBookRoute(app: Hono, path: string, deps: Deps): void {
  const route = new Hono();

  route.get("/", () => controller(deps).index());

  route.get("/:id", (ctx) => {
    const id = ctx.req.param("id");
    return controller(deps).show(id);
  });

  route.post("/", async (ctx) => {
    const body = await ctx.req.json();
    return controller(deps).create(body);
  });

  route.delete("/:id", (ctx) => {
    const id = ctx.req.param("id");
    return controller(deps).delete(id);
  });

  app.route(path, route);
}
