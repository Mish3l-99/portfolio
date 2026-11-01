export type JobSource = "linkedin" | "indeed";

export type Workplace = "hybrid" | "remote" | "onsite" | "unknown";

/**
 * Lifecycle of a posting:
 * new → (skipped | applying → applied | needs_manual | external)
 * The user can then move needs_manual/external → applied_manual, or dismiss anything.
 */
export type JobStatus =
  | "new"
  | "skipped"
  | "applying"
  | "applied"
  | "needs_manual"
  | "external"
  | "applied_manual"
  | "dismissed";

export type Salary = {
  /** Monthly AED, already normalised from yearly/hourly/USD. */
  min: number | null;
  max: number | null;
  /** The raw text it was parsed from, shown in the table. */
  text: string;
};

export type Tailoring = {
  headline: string;
  summary: string;
  matchedKeywords: string[];
  focus: "frontend" | "fullstack" | "backend";
  aiUsed: boolean;
  generatedAt: string;
};

export type Job = {
  /** `${source}:${externalId}` */
  id: string;
  source: JobSource;
  externalId: string;
  title: string;
  company: string;
  location: string;
  workplace: Workplace;
  url: string;
  /** Off-site application link when the posting isn't Easy Apply / Indeed Apply. */
  applyUrl: string | null;
  easyApply: boolean | null;
  description: string;
  postedAt: string | null;
  foundAt: string;
  salary: Salary | null;
  /** Monthly AED we'll put in any "expected salary" field. Never below the floor. */
  expectedSalary: number;
  score: number;
  status: JobStatus;
  /** Why it was skipped / why auto-apply gave up. */
  reason: string | null;
  /** Form questions the bot couldn't answer, so you know what to expect. */
  unanswered: string[];
  attempts: number;
  appliedAt: string | null;
  updatedAt: string;
  tailoring: Tailoring | null;
};

export type RunLog = {
  at: string;
  level: "info" | "warn" | "error";
  msg: string;
};

export type RunMode = "fetch" | "apply" | "full";

export type RunSummary = {
  id: string;
  mode: RunMode;
  dryRun: boolean;
  startedAt: string;
  finishedAt: string | null;
  found: number;
  applied: number;
  needsYou: number;
  error: string | null;
};

export type Db = {
  version: 1;
  jobs: Record<string, Job>;
  runs: RunSummary[];
};
