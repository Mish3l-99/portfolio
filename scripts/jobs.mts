/**
 * CLI for the job tool, for cron or a terminal:
 *   pnpm jobs            find + apply
 *   pnpm jobs fetch      find only
 *   pnpm jobs apply      apply to the queue
 *   pnpm jobs --dry-run  fill forms but never submit
 */
import fs from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (fs.existsSync(file)) process.loadEnvFile(file);
}

const args = process.argv.slice(2);
const mode = (["fetch", "apply", "full"].find((m) => args.includes(m)) ??
  "full") as "fetch" | "apply" | "full";
const dryRun = args.includes("--dry-run");

// Imported after the env is loaded: the config reads it at module load.
const { runPipeline } = await import("@/lib/jobs/runner");
const summary = await runPipeline({ mode, dryRun });
process.exit(summary.error ? 1 : 0);
