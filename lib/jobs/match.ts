import { jobsConfig } from "./config";
import { matchKeywords, titleExclusions, titleInclusions } from "./keywords";
import { candidate } from "./profile";
import { isBelowTarget } from "./salary";
import type { Job } from "./types";

const CORE = new Set([
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Laravel",
  "Full Stack",
]);

/** Highest "N+ years" requirement mentioned in the posting. */
function requiredYears(text: string) {
  const years = [
    ...text.matchAll(/(\d{1,2})\s*\+?\s*(?:-\s*\d{1,2}\s*)?years?/gi),
  ]
    .map((m) => Number(m[1]))
    .filter((n) => n > 0 && n < 20);
  return years.length ? Math.max(...years) : null;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Your current employer (and anyone else listed in JOBS_EXCLUDE_COMPANIES). */
export function isExcludedCompany(company: string) {
  const name = normalize(company);
  return jobsConfig.excludedCompanies.some((c) => name.includes(normalize(c)));
}

export type Assessment = {
  score: number;
  skip: string | null;
  matched: string[];
};

export function assess(
  job: Pick<Job, "title" | "company" | "description" | "workplace" | "salary">,
): Assessment {
  const { title, description } = job;
  const matched = matchKeywords(`${title}\n${description}`);
  const ours = matched.filter((k) => k.has).map((k) => k.name);
  const foreign = matched.filter((k) => !k.has);
  const foreignInTitle = matchKeywords(title).filter((k) => !k.has);

  const result = (skip: string | null, score = 0): Assessment => ({
    score: Math.round(score * 10) / 10,
    skip,
    matched: ours,
  });

  if (isExcludedCompany(job.company))
    return result("Posted by your current employer");
  if (titleExclusions.test(title))
    return result("Title isn't a fit for your profile");
  if (!titleInclusions.test(title)) return result("Not a software role");
  if (foreignInTitle.length)
    return result(
      `Built around ${foreignInTitle.map((k) => k.name).join(", ")}`,
    );
  if (isBelowTarget(job.salary))
    return result(
      `Posted salary is under ${jobsConfig.minSalary.toLocaleString()} AED`,
    );

  let score = Math.min(ours.length, 12) * 0.5;
  for (const k of matchKeywords(title))
    if (k.has && CORE.has(k.name)) score += 1.5;
  score -= foreign.length * 0.75;
  score += { hybrid: 2, remote: 1.5, onsite: 0.5, unknown: 0.5 }[job.workplace];
  if (/\b(senior|sr\.?|lead|mid[\s-]?senior)\b/i.test(title)) score += 1;
  if (/\b(principal|staff|head of|director|architect|vp|cto)\b/i.test(title))
    score -= 2;

  const years = requiredYears(description);
  if (years && years > candidate.totalYears + 2) score -= 3;

  if (!ours.some((k) => CORE.has(k)))
    return result("No overlap with your core stack", score);
  return result(score < jobsConfig.minScore ? "Weak match" : null, score);
}
