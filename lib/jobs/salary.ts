import { jobsConfig } from "./config";
import type { Salary } from "./types";

const USD_TO_AED = 3.6725;

type Period = "month" | "year" | "hour" | "day";

const CURRENCY = String.raw`(?:aed|dhs?|dirhams?|usd|us\$|\$)`;
const AMOUNT = String.raw`\d{1,3}(?:[,.\s]\d{3})+|\d+(?:\.\d+)?\s?k\b|\d{4,6}`;
const RANGE = new RegExp(
  String.raw`(${CURRENCY})?\s*(${AMOUNT})\s*(${CURRENCY})?\s*(?:-|–|—|to)\s*(${CURRENCY})?\s*(${AMOUNT})\s*(${CURRENCY})?`,
  "gi",
);
const SINGLE = new RegExp(
  String.raw`(${CURRENCY})\s*(${AMOUNT})|(${AMOUNT})\s*(${CURRENCY})`,
  "gi",
);

function toNumber(raw: string) {
  const s = raw.toLowerCase().replace(/\s/g, "");
  if (s.endsWith("k")) return parseFloat(s) * 1000;
  return Number(s.replace(/[,.](?=\d{3}\b)/g, ""));
}

function periodNear(text: string, index: number): Period | null {
  const around = text.slice(Math.max(0, index - 20), index + 80).toLowerCase();
  if (
    /per\s*(year|annum)|annual|yearly|\/\s*y(ea)?r|\bp\.?\s?a\.?\b|a year/.test(
      around,
    )
  )
    return "year";
  if (/per\s*hour|hourly|\/\s*h(ou)?r|an hour/.test(around)) return "hour";
  if (/per\s*day|daily|a day/.test(around)) return "day";
  if (/per\s*month|monthly|\/\s*m(on)?th|a month|\bpm\b/.test(around))
    return "month";
  return null;
}

function toMonthlyAed(value: number, period: Period | null, usd: boolean) {
  let v = usd ? value * USD_TO_AED : value;
  // No stated period: anything this large is an annual package.
  const p = period ?? (v > 120_000 ? "year" : "month");
  if (p === "year") v /= 12;
  if (p === "hour") v *= 160;
  if (p === "day") v *= 22;
  return Math.round(v);
}

const plausible = (v: number) => v >= 2_000 && v <= 200_000;

/** Pulls a salary range out of free text. Only trusts numbers tied to a currency. */
export function parseSalary(text: string): Salary | null {
  for (const m of text.matchAll(RANGE)) {
    const currency = [m[1], m[3], m[4], m[6]].find(Boolean);
    if (!currency) continue;
    const usd = /usd|\$/i.test(currency);
    const period = periodNear(text, m.index ?? 0);
    const a = toMonthlyAed(toNumber(m[2]), period, usd);
    const b = toMonthlyAed(toNumber(m[5]), period, usd);
    const [min, max] = a <= b ? [a, b] : [b, a];
    if (plausible(min) && plausible(max))
      return { min, max, text: m[0].trim() };
  }
  for (const m of text.matchAll(SINGLE)) {
    const currency = m[1] ?? m[4];
    const amount = m[2] ?? m[3];
    const usd = /usd|\$/i.test(currency);
    const v = toMonthlyAed(
      toNumber(amount),
      periodNear(text, m.index ?? 0),
      usd,
    );
    if (plausible(v)) return { min: v, max: v, text: m[0].trim() };
  }
  return null;
}

/** For structured salary data (Indeed exposes min/max/type). */
export function salaryFrom(
  min: number | null,
  max: number | null,
  period: string,
  text: string,
): Salary | null {
  const p = (
    { YEARLY: "year", MONTHLY: "month", HOURLY: "hour", DAILY: "day" } as const
  )[period.toUpperCase() as "YEARLY"];
  const lo = min ? toMonthlyAed(min, p ?? null, false) : null;
  const hi = max ? toMonthlyAed(max, p ?? null, false) : lo;
  if (!lo && !hi) return null;
  return { min: lo ?? hi, max: hi, text };
}

const roundTo500 = (v: number) => Math.round(v / 500) * 500;

/** Midpoint of the posted range, but never below the floor. */
export function expectedSalaryFor(salary: Salary | null) {
  const { minSalary, defaultSalary } = jobsConfig;
  if (!salary || (!salary.min && !salary.max)) return defaultSalary;
  const lo = salary.min ?? salary.max!;
  const hi = salary.max ?? lo;
  return Math.max(minSalary, roundTo500((lo + hi) / 2));
}

/** True when the posting's ceiling is under the floor. */
export function isBelowTarget(salary: Salary | null) {
  return Boolean(salary?.max && salary.max < jobsConfig.minSalary);
}
