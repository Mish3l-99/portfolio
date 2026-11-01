import path from "node:path";

const env = (key: string) => process.env[key]?.trim() || undefined;

const num = (key: string, fallback: number) => {
  const value = Number(env(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const list = (key: string, fallback: string[]) =>
  env(key)
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? fallback;

const minSalary = num("JOBS_MIN_SALARY", 15000);

export const jobsConfig = {
  /** Everything the tool writes (db, tailored resumes, browser profile). Gitignored. */
  dataDir: path.resolve(env("JOBS_DATA_DIR") ?? ".jobs"),

  /** Monthly AED floor — never asked for less, postings capped below it are skipped. */
  minSalary,
  /** Asked for when a posting doesn't show a range. */
  defaultSalary: Math.max(minSalary, num("JOBS_DEFAULT_SALARY", 18000)),

  searches: list("JOBS_KEYWORDS", [
    "Full Stack Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Senior Frontend Engineer",
    "Software Engineer JavaScript",
    "Node.js Developer",
    "Laravel Developer",
  ]),
  location: "United Arab Emirates",
  /** Only look at postings from the last N days. */
  maxAgeDays: num("JOBS_MAX_AGE_DAYS", 7),
  /** Result pages per keyword (LinkedIn: 10 jobs/page, Indeed: ~15). */
  pagesPerSearch: num("JOBS_PAGES", 2),
  sources: list("JOBS_SOURCES", ["linkedin", "indeed"]) as (
    "linkedin" | "indeed"
  )[],

  /** Postings scoring below this are listed as skipped instead of applied to. */
  minScore: num("JOBS_MIN_SCORE", 3),
  /** Never applied to — matched case-insensitively against the company name. */
  excludedCompanies: list("JOBS_EXCLUDE_COMPANIES", ["Evolvex"]),
  /** Hard cap per run — keeps volume reasonable and leaves room to review. */
  maxApplicationsPerRun: num("JOBS_MAX_APPLY_PER_RUN", 15),

  browser: {
    /** System Chrome is used so nothing extra has to be downloaded. */
    executablePath: env("JOBS_CHROME_PATH"),
    channel: env("JOBS_CHROME_PATH") ? undefined : "chrome",
    headless: env("JOBS_HEADLESS") === "true",
  },

  ai: {
    apiKey: env("OPENAI_API_KEY"),
    model: env("JOBS_OPENAI_MODEL") ?? "gpt-5-mini",
    /** One short call per job to polish the summary. Set to "false" for zero AI. */
    enabled: env("JOBS_AI") !== "false" && Boolean(env("OPENAI_API_KEY")),
  },
};

export const jobsPaths = {
  db: path.join(jobsConfig.dataDir, "db.json"),
  lock: path.join(jobsConfig.dataDir, "db.lock"),
  resumes: path.join(jobsConfig.dataDir, "resumes"),
  profile: path.join(jobsConfig.dataDir, "browser-profile"),
  screenshots: path.join(jobsConfig.dataDir, "screenshots"),
};

/** Serverless hosts have no writable disk or Chrome; the tool is meant to run locally. */
export const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
);
