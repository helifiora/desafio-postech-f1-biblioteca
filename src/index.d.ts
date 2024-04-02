import { RepositoryFactory } from "@/application/factory/repository_factory.ts";

declare module "hono" {
  interface ContextVariableMap {
    repoFac: RepositoryFactory;
  }
}
