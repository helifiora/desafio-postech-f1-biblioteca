import { randomUUID } from "node:crypto";

export class Publisher {
  constructor(readonly id: string, readonly name: string) {}

  static create(name: string): Publisher {
    return new Publisher(randomUUID(), name);
  }
}
