import type { Page } from "playwright-core";

import { pace } from "../browser";
import { jobsConfig } from "../config";
import { parseSalary, salaryFrom } from "../salary";
import type { Workplace } from "../types";
import {
  assertNoWall,
  clean,
  NeedsHumanError,
  searchGuard,
  type FetchContext,
  type Posting,
} from "./common";

/** ae.indeed.com, read through your signed-in browser profile. */

const BASE = "https://ae.indeed.com";

type IndeedResult = {
  jobkey: string;
  title?: string;
  displayTitle?: string;
  company?: string;
  formattedLocation?: string;
  pubDate?: number;
  indeedApplyEnabled?: boolean;
  indeedApplyable?: boolean;
  thirdPartyApplyUrl?: string;
  extractedSalary?: { min?: number; max?: number; type?: string };
  salarySnippet?: { text?: string };
  remoteWorkModel?: { type?: string; text?: string };
};

function workplaceOf(r: IndeedResult, text: string): Workplace {
  const model =
    `${r.remoteWorkModel?.type ?? ""} ${r.remoteWorkModel?.text ?? ""}`.toLowerCase();
  if (/hybrid/.test(model)) return "hybrid";
  if (/remote/.test(model)) return "remote";
  if (/\bhybrid\b/i.test(text)) return "hybrid";
  if (
    /\b(fully remote|100% remote|remote[\s-]first|work from home)\b/i.test(text)
  )
    return "remote";
  if (/\b(on[\s-]?site|in[\s-]office)\b/i.test(text)) return "onsite";
  return "unknown";
}

async function results(
  page: Page,
  q: string,
  start: number,
): Promise<IndeedResult[]> {
  const params = new URLSearchParams({
    q,
    l: jobsConfig.location,
    fromage: String(jobsConfig.maxAgeDays),
    sort: "date",
    start: String(start),
  });
  const res = await page.goto(`${BASE}/jobs?${params}`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  if (res?.status() === 429)
    throw new NeedsHumanError(
      "indeed",
      "Indeed is rate-limiting searches — try again later.",
    );
  await assertNoWall(page, "indeed");

  // Indeed ships the result list as JSON on the page; fall back to the DOM if that ever moves.
  const fromJson = await page.evaluate(() => {
    const w = window as unknown as {
      mosaic?: {
        providerData?: Record<
          string,
          {
            metaData?: {
              mosaicProviderJobCardsModel?: { results?: unknown[] };
            };
          }
        >;
      };
    };
    return (
      w.mosaic?.providerData?.["mosaic-provider-jobcards"]?.metaData
        ?.mosaicProviderJobCardsModel?.results ?? null
    );
  });
  if (Array.isArray(fromJson)) return fromJson as IndeedResult[];

  return page.$$eval("a[data-jk]", (links) =>
    links.map((a) => {
      const card = a.closest("li, .job_seen_beacon") ?? a;
      const text = (sel: string) =>
        card.querySelector(sel)?.textContent?.trim() ?? "";
      return {
        jobkey: a.getAttribute("data-jk") ?? "",
        title: a.textContent?.trim() ?? "",
        company: text('[data-testid="company-name"]'),
        formattedLocation: text('[data-testid="text-location"]'),
        indeedApplyEnabled: /easily apply/i.test(card.textContent ?? ""),
      };
    }),
  );
}

async function details(page: Page, r: IndeedResult): Promise<Posting> {
  const url = `${BASE}/viewjob?jk=${r.jobkey}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await assertNoWall(page, "indeed");
  const description = clean(
    await page
      .locator("#jobDescriptionText")
      .innerText({ timeout: 10_000 })
      .catch(() => ""),
  );
  const external = await page
    .locator(
      '#applyButtonLinkContainer a, a[href*="/applystart"], button[aria-label*="company site" i]',
    )
    .first()
    .getAttribute("href", { timeout: 2_000 })
    .catch(() => null);
  const indeedApply =
    Boolean(r.indeedApplyEnabled || r.indeedApplyable) ||
    (await page
      .locator('#indeedApplyButton, [data-testid="indeedApplyButton"]')
      .count()) > 0;

  const s = r.extractedSalary;
  const salaryText = r.salarySnippet?.text ?? "";
  const salary =
    (s && (s.min || s.max)
      ? salaryFrom(s.min ?? null, s.max ?? null, s.type ?? "", salaryText)
      : null) ?? parseSalary(`${salaryText}\n${description}`);

  return {
    source: "indeed",
    externalId: r.jobkey,
    title: clean(r.displayTitle ?? r.title),
    company: clean(r.company),
    location: clean(r.formattedLocation) || jobsConfig.location,
    url,
    applyUrl: indeedApply
      ? null
      : external
        ? new URL(external, BASE).href
        : (r.thirdPartyApplyUrl ?? url),
    easyApply: indeedApply,
    description,
    postedAt: r.pubDate ? new Date(r.pubDate).toISOString() : null,
    workplace: workplaceOf(r, description),
    salary,
  };
}

export async function fetchIndeed(page: Page, ctx: FetchContext) {
  const guard = searchGuard("Indeed", ctx);
  const found = new Map<string, Posting>();
  for (const q of jobsConfig.searches) {
    for (let p = 0; p < jobsConfig.pagesPerSearch; p++) {
      if (ctx.shouldStop()) return [...found.values()];
      const raw = await guard(`Indeed · “${q}”`, () =>
        results(page, q, p * 10),
      );
      if (!raw) break;
      const list = raw.filter((r) => r.jobkey);
      const fresh = list.filter(
        (r) => !found.has(r.jobkey) && !ctx.known.has(`indeed:${r.jobkey}`),
      );
      ctx.log(
        `Indeed · “${q}” · page ${p + 1}: ${list.length} results, ${fresh.length} new`,
      );
      for (const r of fresh) {
        if (ctx.shouldStop()) break;
        await pace();
        try {
          found.set(r.jobkey, await details(page, r));
        } catch (error) {
          if (error instanceof NeedsHumanError) throw error;
          ctx.log(
            `Indeed · couldn't load ${r.title ?? r.jobkey}: ${(error as Error).message}`,
          );
        }
      }
      if (list.length < 10) break;
      await pace();
    }
  }
  return [...found.values()];
}
