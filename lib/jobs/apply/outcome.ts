import fs from "node:fs/promises";
import path from "node:path";

import type { Locator, Page } from "playwright-core";

import { jobsPaths } from "../config";
import type { Job } from "../types";

export type ApplyOutcome =
  | { status: "applied"; note?: string }
  | { status: "external"; applyUrl: string; reason: string }
  | { status: "needs_manual"; reason: string; unanswered?: string[] }
  | { status: "closed"; reason: string }
  | { status: "dry_run" };

export type ApplyOptions = { dryRun: boolean };

/** Keeps a screenshot of where auto-apply stopped, next to the db. */
export async function snapshot(page: Page, job: Job) {
  const file = path.join(
    jobsPaths.screenshots,
    `${job.id.replace(/[^a-z0-9_-]/gi, "_")}.png`,
  );
  await fs.mkdir(jobsPaths.screenshots, { recursive: true });
  await page.screenshot({ path: file, fullPage: false }).catch(() => undefined);
  return file;
}

/** Visible validation messages inside a form step. */
export async function visibleErrors(scope: Locator) {
  const errors = scope.locator(
    '.artdeco-inline-feedback--error, [role=alert], [id*="error" i]:not(:empty), [class*="error" i][class*="message" i]',
  );
  const texts: string[] = [];
  for (const el of await errors.all()) {
    if (!(await el.isVisible().catch(() => false))) continue;
    const t = (await el.innerText().catch(() => ""))
      .replace(/\s+/g, " ")
      .trim();
    if (t && !texts.includes(t)) texts.push(t);
  }
  return texts;
}

export const isVisible = (l: Locator) =>
  l
    .first()
    .isVisible()
    .catch(() => false);
