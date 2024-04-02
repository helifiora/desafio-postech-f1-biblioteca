import { mkdir } from "node:fs/promises";

export async function createDir(path: string): Promise<void> {
  try {
    await mkdir(path);
  } catch {}
}
