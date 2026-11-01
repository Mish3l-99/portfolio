import type { Page } from "playwright-core";

import type { Job, JobSource, Salary, Workplace } from "../types";

/**
 * Thrown when a site wants a human: logged out, a verification/CAPTCHA page,
 * or rate limiting. The run stops that source and the dashboard tells you;
 * the tool never tries to get past these on its own.
 */
export class NeedsHumanError extends Error {
  constructor(
    public source: JobSource,
    message: string,
  ) {
    super(message);
  }
}

export type Posting = Pick<
  Job,
  | "source"
  | "externalId"
  | "title"
  | "company"
  | "location"
  | "url"
  | "applyUrl"
  | "easyApply"
  | "description"
  | "postedAt"
> & { workplace: Workplace; salary: Salary | null };

export type FetchContext = {
  log: (msg: string) => void;
  shouldStop: () => boolean;
  /** Skip the (slow) detail fetch for postings already in the db. */
  known: Set<string>;
};

/** Detects the pages we must hand back to the user. */
export async function assertNoWall(page: Page, source: JobSource) {
  const url = page.url();
  const title = (await page.title().catch(() => "")).toLowerCase();
  if (
    /\/(login|authwall|uas\/login|checkpoint)|\/account\/login|secure\.indeed\.com\/auth/.test(
      url,
    )
  )
    throw new NeedsHumanError(
      source,
      "Signed out — use “Connect accounts” to sign in again.",
    );
  if (
    /just a moment|attention required|security check|verify you are human|captcha/.test(
      title,
    ) ||
    (await page
      .locator(
        'iframe[src*="challenges.cloudflare.com"], iframe[src*="captcha"], #challenge-form',
      )
      .count()) > 0
  )
    throw new NeedsHumanError(
      source,
      "The site is asking for a verification check — open “Connect accounts”, complete it, then run again.",
    );
}

export const clean = (s: string | null | undefined) =>
  (s ?? "").replace(/\s+/g, " ").trim();

/**
 * Wraps one search-page load: a failure is logged and that search skipped,
 * but three failures in a row stop the source (something is clearly wrong).
 */
export function searchGuard(source: string, ctx: FetchContext) {
  let failures = 0;
  return async <T>(
    label: string,
    load: () => Promise<T>,
  ): Promise<T | null> => {
    try {
      const result = await load();
      failures = 0;
      return result;
    } catch (error) {
      if (error instanceof NeedsHumanError) throw error;
      const message = (error as Error).message.split("\n")[0];
      ctx.log(`${label}: couldn't load (${message})`);
      if (++failures >= 3)
        throw new Error(
          `${source} stopped after 3 failed page loads — last error: ${message}`,
        );
      return null;
    }
  };
}
