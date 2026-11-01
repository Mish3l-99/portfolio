import fs from "node:fs/promises";

import { jobsConfig, jobsPaths } from "./config";
import type { Db, Job, RunSummary } from "./types";

/**
 * Tiny JSON-file database. Every write takes a lockfile so the dashboard
 * and the CLI (`pnpm jobs`) can run side by side without clobbering each other.
 */

const empty = (): Db => ({ version: 1, jobs: {}, runs: [] });

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(jobsPaths.db, "utf8")) as Db;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
    throw error;
  }
}

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  await fs.mkdir(jobsConfig.dataDir, { recursive: true });
  for (let attempt = 0; ; attempt++) {
    try {
      const handle = await fs.open(jobsPaths.lock, "wx");
      await handle.close();
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      // A crashed process can leave the lock behind; locks are held for milliseconds.
      const stat = await fs.stat(jobsPaths.lock).catch(() => null);
      if (stat && Date.now() - stat.mtimeMs > 10_000)
        await fs.rm(jobsPaths.lock, { force: true });
      if (attempt > 200) throw new Error("Timed out waiting for db lock");
      await new Promise((r) => setTimeout(r, 25));
    }
  }
  try {
    return await fn();
  } finally {
    await fs.rm(jobsPaths.lock, { force: true });
  }
}

export function updateDb<T>(fn: (db: Db) => T): Promise<T> {
  return withLock(async () => {
    const db = await readDb();
    const result = fn(db);
    const tmp = `${jobsPaths.db}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, jobsPaths.db);
    return result;
  });
}

export function updateJob(id: string, patch: Partial<Job>) {
  return updateDb((db) => {
    const job = db.jobs[id];
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    return job;
  });
}

export async function getJob(id: string) {
  return (await readDb()).jobs[id] ?? null;
}

export function saveRun(run: RunSummary) {
  return updateDb((db) => {
    const i = db.runs.findIndex((r) => r.id === run.id);
    if (i >= 0) db.runs[i] = run;
    else db.runs.unshift(run);
    db.runs = db.runs.slice(0, 50);
  });
}
