import { resolve } from "node:path";

import { migrate } from "@/infrastructure/database/mod.ts";
import { openDb } from "./infrastructure/database/kysely_db";

import {
  KyselyBookRepository,
  KyselyPublisherRepository,
} from "./infrastructure/repository/mod.ts";

import { createDir } from "./node_utils.ts";
import { useBookRoute, usePublisherRoute } from "./route/mod.ts";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

// CRIAR PASTA .data no diretório
await createDir(resolve(".data"));

// APLICAR MIGRATION NO BANCO
const path = resolve(".data", "database.db");

await migrate(path);

// RESOLVER DEPENDENCIAS DO BANCO DE DADOS
const db = openDb(path);
const bookRepo = new KyselyBookRepository(db);
const publisherRepo = new KyselyPublisherRepository(db);

// INICIAR A API
const app = new Hono();

useBookRoute(app, "/books", { bookRepo, publisherRepo });
usePublisherRoute(app, "/publishers", { bookRepo, publisherRepo });

serve(app);
