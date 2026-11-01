import { applyIndeed } from "./apply/indeed";
import { applyLinkedIn } from "./apply/linkedin";
import { snapshot, type ApplyOutcome } from "./apply/outcome";
import {
  closeBrowsers,
  openPlainChrome,
  pace,
  profileContext,
} from "./browser";
import { jobsConfig } from "./config";
import { resetSite, type Site } from "./connection";
import { assess, isExcludedCompany } from "./match";
import { generateResume } from "./resume";
import { expectedSalaryFor } from "./salary";
import {
  NeedsHumanError,
  type FetchContext,
  type Posting,
} from "./sources/common";
import { fetchIndeed } from "./sources/indeed";
import { fetchLinkedIn } from "./sources/linkedin";
import { readDb, saveRun, updateDb, updateJob } from "./store";
import type { Job, JobSource, RunLog, RunMode, RunSummary } from "./types";

export type RunOptions = { mode: RunMode; dryRun: boolean; jobIds?: string[] };

export type RunState = {
  running: boolean;
  summary: RunSummary | null;
  phase: string;
  logs: RunLog[];
  blocked: { source: JobSource; message: string }[];
  /** The "Connect accounts" window is open; runs wait until it's closed. */
  loginOpen: boolean;
};

/** Lives on globalThis so it survives dev-server hot reloads. */
const g = globalThis as typeof globalThis & {
  __jobsRun?: RunState & { stop: boolean };
};
const state = (g.__jobsRun ??= {
  running: false,
  summary: null,
  phase: "idle",
  logs: [],
  blocked: [],
  loginOpen: false,
  stop: false,
});
// State created by an older version of this module (hot reload) may lack newer fields.
state.loginOpen ??= false;

export function getRunState(): RunState {
  const { running, summary, phase, logs, blocked, loginOpen } = state;
  return { running, summary, phase, logs, blocked, loginOpen };
}

function log(msg: string, level: RunLog["level"] = "info") {
  state.logs.push({ at: new Date().toISOString(), level, msg });
  if (state.logs.length > 400) state.logs.splice(0, state.logs.length - 400);
  const line = `[jobs] ${msg}`;
  if (level === "error") console.error(line);
  else console.log(line);
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function toJob(p: Posting, now: string, db: Record<string, Job>): Job {
  const id = `${p.source}:${p.externalId}`;
  const assessment = assess(p);
  const twin = Object.values(db).find(
    (j) =>
      j.source !== p.source &&
      norm(j.company) === norm(p.company) &&
      norm(j.title) === norm(p.title),
  );
  const skip = twin
    ? `Same posting found on ${twin.source === "linkedin" ? "LinkedIn" : "Indeed"}`
    : assessment.skip;
  return {
    ...p,
    id,
    foundAt: now,
    updatedAt: now,
    expectedSalary: expectedSalaryFor(p.salary),
    score: assessment.score,
    status: skip ? "skipped" : "new",
    reason: skip,
    unanswered: [],
    attempts: 0,
    appliedAt: null,
    tailoring: null,
  };
}

async function fetchAll(summary: RunSummary) {
  const known = new Set(Object.keys((await readDb()).jobs));
  const ctx = await profileContext();
  const page = await ctx.newPage();
  const fetchCtx: FetchContext = { log, shouldStop: () => state.stop, known };
  try {
    for (const source of jobsConfig.sources) {
      state.phase = `Searching ${source === "linkedin" ? "LinkedIn" : "Indeed"}`;
      let postings: Posting[] = [];
      try {
        postings =
          source === "linkedin"
            ? await fetchLinkedIn(page, fetchCtx)
            : await fetchIndeed(page, fetchCtx);
      } catch (error) {
        if (isBrowserGone(error)) throw error;
        if (error instanceof NeedsHumanError) {
          state.blocked.push({ source, message: error.message });
          log(`${source}: ${error.message}`, "warn");
        } else {
          // One site failing shouldn't cost you the other.
          log(`${source}: ${(error as Error).message.split("\n")[0]}`, "error");
        }
      }
      const now = new Date().toISOString();
      const added = await updateDb((db) => {
        let n = 0;
        for (const p of postings) {
          const job = toJob(p, now, db.jobs);
          if (db.jobs[job.id]) continue;
          db.jobs[job.id] = job;
          n++;
        }
        return n;
      });
      summary.found += added;
      log(`${source}: ${added} new posting(s) saved`);
    }
  } finally {
    await page.close().catch(() => undefined);
  }

  // Off-site postings never go through the bot: tailor their resume now and hand them over.
  const db = await readDb();
  const external = Object.values(db.jobs).filter(
    (j) => j.status === "new" && j.easyApply === false,
  );
  for (const job of external) {
    if (state.stop) break;
    state.phase = `Tailoring resume · ${job.company}`;
    await generateResume(job).catch((e) =>
      log(`Resume for ${job.title}: ${e.message}`, "warn"),
    );
    await updateJob(job.id, {
      status: "external",
      reason: "Applies on the company's site",
    });
    summary.needsYou++;
  }
}

function patchFor(outcome: ApplyOutcome, job: Job): Partial<Job> {
  const now = new Date().toISOString();
  switch (outcome.status) {
    case "applied":
      return {
        status: "applied",
        appliedAt: now,
        reason: outcome.note ?? null,
        unanswered: [],
      };
    case "external":
      return {
        status: "external",
        applyUrl: outcome.applyUrl,
        easyApply: false,
        reason: outcome.reason,
      };
    case "needs_manual":
      return {
        status: "needs_manual",
        reason: outcome.reason,
        unanswered: outcome.unanswered ?? [],
      };
    case "closed":
      return { status: "skipped", reason: outcome.reason };
    case "dry_run":
      return {
        status: "new",
        reason: "Dry run passed — form filled up to Submit, nothing sent",
        easyApply: job.easyApply ?? true,
      };
  }
}

async function applyQueue(summary: RunSummary, opts: RunOptions) {
  const db = await readDb();
  const queue = (
    opts.jobIds
      ? opts.jobIds.map((id) => db.jobs[id]).filter(Boolean)
      : Object.values(db.jobs)
          .filter((j) => j.status === "new" && j.easyApply !== false)
          .sort((a, b) => b.score - a.score)
  ).slice(0, jobsConfig.maxApplicationsPerRun);

  if (!queue.length) return log("Nothing to apply to.");
  log(
    `Applying to ${queue.length} posting(s)${opts.dryRun ? " (dry run — nothing will be submitted)" : ""}`,
  );

  const ctx = await profileContext();
  const page = await ctx.newPage();
  const blocked = new Set<JobSource>(state.blocked.map((b) => b.source));
  try {
    for (const job of queue) {
      if (state.stop) break;
      if (blocked.has(job.source)) continue;
      if (isExcludedCompany(job.company)) {
        await updateJob(job.id, {
          status: "skipped",
          reason: "Posted by your current employer",
        });
        continue;
      }
      state.phase = `Applying · ${job.title} @ ${job.company}`;
      await updateJob(job.id, {
        status: "applying",
        attempts: job.attempts + 1,
      });
      try {
        const resume = await generateResume(job);
        const fresh = (await readDb()).jobs[job.id];
        const apply = job.source === "linkedin" ? applyLinkedIn : applyIndeed;
        const outcome = await apply(page, fresh, resume, {
          dryRun: opts.dryRun,
        });
        if (outcome.status === "needs_manual") await snapshot(page, job);
        await updateJob(job.id, patchFor(outcome, job));
        if (outcome.status === "applied") summary.applied++;
        if (outcome.status === "needs_manual" || outcome.status === "external")
          summary.needsYou++;
        log(
          `${job.title} @ ${job.company}: ${outcome.status.replace("_", " ")}${"reason" in outcome ? ` — ${outcome.reason}` : ""}`,
        );
      } catch (error) {
        if (error instanceof NeedsHumanError) {
          blocked.add(job.source);
          state.blocked.push({ source: job.source, message: error.message });
          await updateJob(job.id, { status: "new", reason: error.message });
          log(`${job.source}: ${error.message}`, "warn");
          continue;
        }
        await snapshot(page, job);
        await updateJob(job.id, {
          status: "needs_manual",
          reason: `Auto-apply crashed: ${(error as Error).message.split("\n")[0]}`,
        });
        summary.needsYou++;
        log(
          `${job.title} @ ${job.company}: ${(error as Error).message}`,
          "error",
        );
      }
      await pace(4000, 9000);
    }
  } finally {
    await page.close().catch(() => undefined);
  }
}

/** Runs to completion. Used directly by the CLI; the dashboard calls startRun(). */
export async function runPipeline(opts: RunOptions) {
  const blocker = runBlocker();
  if (blocker) throw new Error(blocker);
  const summary: RunSummary = {
    id: new Date().toISOString(),
    mode: opts.mode,
    dryRun: opts.dryRun,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    found: 0,
    applied: 0,
    needsYou: 0,
    error: null,
  };
  Object.assign(state, {
    running: true,
    stop: false,
    summary,
    logs: [],
    blocked: [],
    phase: "Starting",
  });
  log(`Run started · ${opts.mode}${opts.dryRun ? " · dry run" : ""}`);
  await saveRun(summary);
  try {
    if (opts.mode !== "apply") await fetchAll(summary);
    if (opts.mode !== "fetch") await applyQueue(summary, opts);
  } catch (error) {
    summary.error = isBrowserGone(error)
      ? "The bot's Chrome window was closed mid-run. Leave it open (minimising is fine) until the run finishes."
      : (error as Error).message.split("\n")[0];
    log(`Run failed: ${summary.error}`, "error");
  } finally {
    // Anything interrupted mid-application goes back to the queue.
    await updateDb((db) => {
      for (const j of Object.values(db.jobs))
        if (j.status === "applying") j.status = "new";
    });
    await closeBrowsers();
    summary.finishedAt = new Date().toISOString();
    await saveRun(summary);
    log(
      `Done · ${summary.found} found · ${summary.applied} applied · ${summary.needsYou} need you`,
    );
    Object.assign(state, { running: false, phase: "idle" });
  }
  return summary;
}

/** Why a run can't start right now, or null. */
export function runBlocker() {
  if (state.running) return "A run is already in progress.";
  if (state.loginOpen)
    return "The Connect accounts window is still open — finish signing in and close it first.";
  return null;
}

/** Starts a run in the background. Returns an error message if it can't. */
export function startRun(opts: RunOptions) {
  const blocker = runBlocker();
  if (blocker) return blocker;
  void runPipeline(opts);
  return null;
}

/** Playwright errors that mean the window/tab was closed under us. */
function isBrowserGone(error: unknown) {
  return /has been closed|frame was detached|Target closed|Browser closed/i.test(
    (error as Error)?.message ?? "",
  );
}

export function requestStop() {
  if (!state.running) return;
  state.stop = true;
  state.phase = "Stopping after the current step…";
  log("Stop requested");
}

export const SIGN_IN_URLS = {
  linkedin: "https://www.linkedin.com/login",
  indeed:
    "https://secure.indeed.com/auth?hl=en_AE&co=AE&continue=https%3A%2F%2Fae.indeed.com%2F",
};

/**
 * Opens a normal (non-automated) Chrome window on the bot's profile at the
 * sign-in pages. Runs stay locked until you close it.
 */
export async function openForLogin(
  sites: (keyof typeof SIGN_IN_URLS)[] = ["linkedin", "indeed"],
) {
  if (state.running) throw new Error("Wait for the current run to finish");
  if (state.loginOpen) throw new Error("The sign-in window is already open.");
  const chrome = await openPlainChrome(sites.map((s) => SIGN_IN_URLS[s]));
  state.loginOpen = true;
  const done = () => (state.loginOpen = false);
  chrome.once("exit", done);
  chrome.once("error", (error) => {
    done();
    log(`Couldn't open Chrome: ${error.message}`, "error");
  });
}

/** Clears one site's sign-in from the bot's profile so you can start over. */
export async function resetSignIn(site: Site) {
  if (state.running || state.loginOpen)
    throw new Error(
      "Close the sign-in window and wait for any run to finish first.",
    );
  await closeBrowsers();
  const removed = await resetSite(site);
  log(`${site}: sign-in reset (${removed} cookies cleared)`);
}
