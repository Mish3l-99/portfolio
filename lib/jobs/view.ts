import { connectionStatus } from "./connection";
import { getRunState } from "./runner";
import { readDb } from "./store";
import type { Job } from "./types";

/** What the dashboard receives: everything but the full description. */
export type JobRow = Omit<Job, "description"> & { excerpt: string };

export async function dashboardData() {
  const db = await readDb();
  const jobs: JobRow[] = Object.values(db.jobs)
    .map(({ description, ...job }) => ({
      ...job,
      excerpt:
        description.length > 700
          ? `${description.slice(0, 700)}…`
          : description,
    }))
    .sort((a, b) => b.foundAt.localeCompare(a.foundAt) || b.score - a.score);
  return {
    jobs,
    runs: db.runs.slice(0, 10),
    run: getRunState(),
    connection: await connectionStatus(),
  };
}

export type DashboardData = Awaited<ReturnType<typeof dashboardData>>;
