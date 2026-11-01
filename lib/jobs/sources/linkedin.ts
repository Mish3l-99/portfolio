import * as cheerio from "cheerio";
import type { Page } from "playwright-core";

import { pace } from "../browser";
import { jobsConfig } from "../config";
import { parseSalary } from "../salary";
import type { Workplace } from "../types";
import {
  assertNoWall,
  clean,
  NeedsHumanError,
  searchGuard,
  type FetchContext,
  type Posting,
} from "./common";

/**
 * LinkedIn's public job-listing pages (the ones shown to signed-out visitors),
 * loaded in your browser profile. One search per keyword × workplace type so
 * every posting gets a reliable hybrid/remote/on-site label.
 */

const UAE_GEO_ID = "104305776";
const WORKPLACES: [string, Workplace][] = [
  ["3", "hybrid"],
  ["2", "remote"],
  ["1", "onsite"],
];

function searchUrl(keywords: string, wt: string, start: number) {
  const params = new URLSearchParams({
    keywords,
    location: jobsConfig.location,
    geoId: UAE_GEO_ID,
    f_TPR: `r${jobsConfig.maxAgeDays * 86400}`,
    f_WT: wt,
    sortBy: "DD",
    start: String(start),
  });
  return `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${params}`;
}

async function load(page: Page, url: string) {
  const res = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  if (res?.status() === 429)
    throw new NeedsHumanError(
      "linkedin",
      "LinkedIn is rate-limiting searches — try again in an hour or two.",
    );
  await assertNoWall(page, "linkedin");
  if (res && res.status() >= 400 && res.status() !== 404)
    throw new Error(`LinkedIn ${res.status()} for ${url}`);
  return cheerio.load(await page.content());
}

type Card = Omit<Posting, "description" | "applyUrl" | "easyApply">;

function parseCards($: cheerio.CheerioAPI, workplace: Workplace): Card[] {
  return $("[data-entity-urn*='jobPosting:']")
    .toArray()
    .map((el) => {
      const card = $(el);
      const id = card.attr("data-entity-urn")?.split(":").pop() ?? "";
      const salaryText = clean(
        card.find(".job-search-card__salary-info").text(),
      );
      return {
        source: "linkedin" as const,
        externalId: id,
        title: clean(card.find(".base-search-card__title").text()),
        company: clean(card.find(".base-search-card__subtitle").text()),
        location: clean(card.find(".job-search-card__location").text()),
        url: `https://www.linkedin.com/jobs/view/${id}/`,
        postedAt: card.find("time").attr("datetime") ?? null,
        workplace,
        salary: salaryText ? parseSalary(salaryText) : null,
      };
    })
    .filter((c) => c.externalId && c.title);
}

async function details(page: Page, card: Card): Promise<Posting> {
  const $ = await load(
    page,
    `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${card.externalId}`,
  );
  const description = clean(
    $(".show-more-less-html__markup, .description__text").first().text(),
  );
  // Off-site postings carry their target URL in a commented-out <code id="applyUrl">.
  const raw = $("code#applyUrl").html() ?? "";
  const wrapped = raw.match(/"(https?:[^"]+)"/)?.[1];
  let applyUrl: string | null = null;
  if (wrapped) {
    const target = new URL(wrapped.replace(/&amp;/g, "&")).searchParams.get(
      "url",
    );
    applyUrl = target ?? wrapped;
  }
  const salaryText = clean($(".salary, .compensation__salary").first().text());
  return {
    ...card,
    description,
    applyUrl,
    // Confirmed again on the signed-in page right before applying.
    easyApply: applyUrl ? false : null,
    salary: card.salary ?? parseSalary(`${salaryText}\n${description}`),
  };
}

export async function fetchLinkedIn(page: Page, ctx: FetchContext) {
  const guard = searchGuard("LinkedIn", ctx);
  const found = new Map<string, Posting>();
  for (const keywords of jobsConfig.searches) {
    for (const [wt, workplace] of WORKPLACES) {
      for (let p = 0; p < jobsConfig.pagesPerSearch; p++) {
        if (ctx.shouldStop()) return [...found.values()];
        const $ = await guard(`LinkedIn · “${keywords}” · ${workplace}`, () =>
          load(page, searchUrl(keywords, wt, p * 10)),
        );
        if (!$) break;
        const cards = parseCards($, workplace);
        const fresh = cards.filter(
          (c) =>
            !found.has(c.externalId) &&
            !ctx.known.has(`linkedin:${c.externalId}`),
        );
        ctx.log(
          `LinkedIn · “${keywords}” · ${workplace} · page ${p + 1}: ${cards.length} cards, ${fresh.length} new`,
        );
        for (const card of fresh) {
          if (ctx.shouldStop()) break;
          await pace();
          try {
            found.set(card.externalId, await details(page, card));
          } catch (error) {
            if (error instanceof NeedsHumanError) throw error;
            ctx.log(
              `LinkedIn · couldn't load ${card.title} @ ${card.company}: ${(error as Error).message}`,
            );
          }
        }
        if (cards.length < 10) break;
        await pace();
      }
    }
  }
  return [...found.values()];
}
