import { Hono } from "hono";
import { PublisherController } from "@/controller/publisher_controller.ts";

import type {
  BookRepository,
  PublisherRepository,
} from "@/application/repository/mod.ts";

type Deps = { bookRepo: BookRepository; publisherRepo: PublisherRepository };

function controller(deps: Deps): PublisherController {
  return new PublisherController(deps.bookRepo, deps.publisherRepo);
}

export function usePublisherRoute(app: Hono, path: string, deps: Deps): void {
  const route = new Hono();

  route.get("/", () => controller(deps).index());

  route.get("/:id", (ctx) => {
    const id = ctx.req.param("id");
    return controller(deps).show(id);
  });

  route.get("/:id/books", (ctx) => {
    const id = ctx.req.param("id");
    return controller(deps).showBooks(id);
  });

  route.post("/", async (ctx) => {
    const body = await ctx.req.json();
    return controller(deps).create(body);
  });

  app.route(path, route);
}
