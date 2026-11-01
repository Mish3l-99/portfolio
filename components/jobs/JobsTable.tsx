"use client";

import { Fragment, useMemo, useState } from "react";
import {
  FiArrowUpRight,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiPlay,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiX,
} from "react-icons/fi";

import type { JobStatus } from "@/lib/jobs/types";
import type { JobRow } from "@/lib/jobs/view";
import { cn } from "@/utils";

import {
  formatAed,
  formatDate,
  MatchMeter,
  SourceBadge,
  StatusBadge,
  timeAgo,
  WorkplaceChip,
} from "./parts";

export type RowAction =
  | { type: "status"; status: JobStatus }
  | { type: "autoApply"; dryRun: boolean }
  | { type: "regenerate" };

const tabs: { id: string; label: string; match: (s: JobStatus) => boolean }[] =
  [
    { id: "all", label: "All", match: (s) => s !== "dismissed" },
    {
      id: "you",
      label: "Needs you",
      match: (s) => s === "needs_manual" || s === "external",
    },
    {
      id: "applied",
      label: "Applied",
      match: (s) => s === "applied" || s === "applied_manual",
    },
    {
      id: "queue",
      label: "Queue",
      match: (s) => s === "new" || s === "applying",
    },
    { id: "skipped", label: "Skipped", match: (s) => s === "skipped" },
    { id: "dismissed", label: "Dismissed", match: (s) => s === "dismissed" },
  ];

const sorts = {
  newest: {
    label: "Newest first",
    fn: (a: JobRow, b: JobRow) => b.foundAt.localeCompare(a.foundAt),
  },
  oldest: {
    label: "Oldest first",
    fn: (a: JobRow, b: JobRow) => a.foundAt.localeCompare(b.foundAt),
  },
  posted: {
    label: "Recently posted",
    fn: (a: JobRow, b: JobRow) =>
      (b.postedAt ?? b.foundAt).localeCompare(a.postedAt ?? a.foundAt),
  },
  match: {
    label: "Best match",
    fn: (a: JobRow, b: JobRow) => b.score - a.score,
  },
};

const iconBtn =
  "grid size-8 place-items-center rounded-full border border-line text-muted transition hover:border-white/25 hover:text-fg disabled:opacity-40";

const resumeHref = (id: string, params = "") =>
  `/api/jobs/${encodeURIComponent(id)}/resume${params}`;

function Salary({ job }: { job: JobRow }) {
  return (
    <div className="text-xs leading-relaxed whitespace-nowrap">
      {job.salary ? (
        <p className="text-fg" title={job.salary.text}>
          {job.salary.min === job.salary.max
            ? formatAed(job.salary.min ?? 0)
            : `${formatAed(job.salary.min ?? 0)}–${formatAed(job.salary.max ?? 0)}`}
        </p>
      ) : (
        <p className="text-muted/70">Not posted</p>
      )}
      <p className="text-muted">asks {formatAed(job.expectedSalary)}</p>
    </div>
  );
}

function Actions({
  job,
  busy,
  onAction,
}: {
  job: JobRow;
  busy: boolean;
  onAction: (job: JobRow, action: RowAction) => void;
}) {
  const manualUrl = job.applyUrl ?? job.url;
  const needsYou = job.status === "needs_manual" || job.status === "external";
  const done = job.status === "applied" || job.status === "applied_manual";

  return (
    <div className="flex items-center justify-end gap-1.5">
      {needsYou && (
        <a
          href={manualUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary px-3.5 py-1.5 text-xs whitespace-nowrap"
        >
          Apply <FiArrowUpRight />
        </a>
      )}
      {(job.status === "new" || job.status === "skipped") && (
        <a
          href={manualUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost px-3.5 py-1.5 text-xs whitespace-nowrap"
        >
          {job.status === "skipped" ? "Apply anyway" : "Apply"}{" "}
          <FiArrowUpRight />
        </a>
      )}
      {done && (
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost px-3.5 py-1.5 text-xs whitespace-nowrap"
        >
          Posting <FiArrowUpRight />
        </a>
      )}
      <a
        href={resumeHref(job.id)}
        target="_blank"
        rel="noreferrer"
        className={iconBtn}
        title="Tailored resume (PDF)"
      >
        <FiFileText />
      </a>
      {needsYou && (
        <button
          className={iconBtn}
          disabled={busy}
          title="I applied — mark as done"
          onClick={() =>
            onAction(job, { type: "status", status: "applied_manual" })
          }
        >
          <FiCheck />
        </button>
      )}
      {(job.status === "new" || job.status === "needs_manual") &&
        job.easyApply !== false && (
          <button
            className={iconBtn}
            disabled={busy}
            title={job.status === "new" ? "Auto-apply now" : "Retry auto-apply"}
            onClick={() => onAction(job, { type: "autoApply", dryRun: false })}
          >
            {job.status === "new" ? <FiPlay /> : <FiRefreshCw />}
          </button>
        )}
      {job.status === "skipped" && (
        <button
          className={iconBtn}
          disabled={busy}
          title="Queue for auto-apply"
          onClick={() => onAction(job, { type: "status", status: "new" })}
        >
          <FiPlay />
        </button>
      )}
      {job.status === "dismissed" ? (
        <button
          className={iconBtn}
          disabled={busy}
          title="Restore"
          onClick={() => onAction(job, { type: "status", status: "new" })}
        >
          <FiRotateCcw />
        </button>
      ) : (
        !done && (
          <button
            className={iconBtn}
            disabled={busy}
            title="Dismiss"
            onClick={() =>
              onAction(job, { type: "status", status: "dismissed" })
            }
          >
            <FiX />
          </button>
        )
      )}
    </div>
  );
}

function Details({
  job,
  busy,
  onAction,
}: {
  job: JobRow;
  busy: boolean;
  onAction: (job: JobRow, action: RowAction) => void;
}) {
  return (
    <div className="grid gap-6 border-t border-line bg-white/2 px-5 py-5 text-sm md:grid-cols-5">
      <div className="space-y-4 md:col-span-3">
        {job.reason && (
          <p>
            <span className="text-muted">Status note · </span>
            {job.reason}
          </p>
        )}
        {job.unanswered.length > 0 && (
          <div>
            <p className="text-muted">Questions waiting for you</p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
              {job.unanswered.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-muted">From the posting</p>
          <p className="mt-1.5 leading-relaxed text-fg/80">
            {job.excerpt || "No description captured."}
          </p>
        </div>
      </div>
      <div className="space-y-4 md:col-span-2">
        {job.tailoring ? (
          <>
            <div>
              <p className="text-muted">
                Tailored as ·{" "}
                <span className="text-fg">{job.tailoring.headline}</span>
                {job.tailoring.aiUsed && (
                  <span className="ml-2 rounded bg-white/8 px-1.5 py-0.5 text-[10px]">
                    AI-polished
                  </span>
                )}
              </p>
              <p className="mt-1.5 leading-relaxed text-fg/80">
                {job.tailoring.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.tailoring.matchedKeywords.slice(0, 14).map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-line px-2 py-0.5 text-xs text-muted"
                >
                  {k}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted">
            Resume not tailored yet. It&apos;s generated when you open it or
            when the bot applies.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <a
            href={resumeHref(job.id)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost px-3.5 py-1.5 text-xs"
          >
            <FiFileText /> Open resume
          </a>
          <a
            href={resumeHref(job.id, "?download")}
            className="btn-ghost px-3.5 py-1.5 text-xs"
          >
            Download
          </a>
          <button
            className="btn-ghost px-3.5 py-1.5 text-xs"
            disabled={busy}
            onClick={() => onAction(job, { type: "regenerate" })}
          >
            <FiRefreshCw /> Re-tailor
          </button>
          {(job.status === "new" || job.status === "needs_manual") &&
            job.easyApply !== false && (
              <button
                className="btn-ghost px-3.5 py-1.5 text-xs"
                disabled={busy}
                onClick={() =>
                  onAction(job, { type: "autoApply", dryRun: true })
                }
              >
                Dry-run this one
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default function JobsTable({
  jobs,
  busyId,
  onAction,
}: {
  jobs: JobRow[];
  busyId: string | null;
  onAction: (job: JobRow, action: RowAction) => void;
}) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | "linkedin" | "indeed">("all");
  const [sort, setSort] = useState<keyof typeof sorts>("newest");
  const [open, setOpen] = useState<string | null>(null);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        tabs.map((t) => [t.id, jobs.filter((j) => t.match(j.status)).length]),
      ),
    [jobs],
  );

  const rows = useMemo(() => {
    const active = tabs.find((t) => t.id === tab)!;
    const q = query.trim().toLowerCase();
    return jobs
      .filter((j) => active.match(j.status))
      .filter((j) => source === "all" || j.source === source)
      .filter(
        (j) =>
          !q ||
          `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q),
      )
      .sort(sorts[sort].fn);
  }, [jobs, tab, query, source, sort]);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition",
                tab === t.id
                  ? "bg-white/10 text-fg"
                  : "text-muted hover:text-fg",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 font-mono text-[11px]",
                  t.id === "you" && counts.you
                    ? "bg-brand text-white"
                    : "bg-white/8 text-muted",
                )}
              >
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <FiSearch className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search role or company"
              className="w-56 rounded-full border border-line bg-white/3 py-1.5 pr-3 pl-9 text-sm outline-none focus:border-white/25"
            />
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm outline-none"
          >
            <option value="all">All sources</option>
            <option value="linkedin">LinkedIn</option>
            <option value="indeed">Indeed</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm outline-none"
          >
            {Object.entries(sorts).map(([id, s]) => (
              <option key={id} value={id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              <th className="w-8 py-3 pl-4" />
              <th className="py-3 pr-4 font-medium">Found</th>
              <th className="py-3 pr-4 font-medium">Role</th>
              <th className="py-3 pr-4 font-medium">Source</th>
              <th className="py-3 pr-4 font-medium">Where</th>
              <th className="py-3 pr-4 font-medium">Salary (AED/mo)</th>
              <th className="py-3 pr-4 font-medium">Match</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((job) => {
              const expanded = open === job.id;
              return (
                <Fragment key={job.id}>
                  <tr
                    className={cn(
                      "border-b border-line align-top transition hover:bg-white/2",
                      job.status === "dismissed" && "opacity-50",
                    )}
                  >
                    <td className="py-4 pl-4">
                      <button
                        onClick={() => setOpen(expanded ? null : job.id)}
                        aria-label={expanded ? "Collapse" : "Expand"}
                        className="text-muted transition hover:text-fg"
                      >
                        <FiChevronDown
                          className={cn("transition", expanded && "rotate-180")}
                        />
                      </button>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <p suppressHydrationWarning>{formatDate(job.foundAt)}</p>
                      {job.postedAt && (
                        <p
                          className="text-xs text-muted"
                          suppressHydrationWarning
                        >
                          posted {timeAgo(job.postedAt)}
                        </p>
                      )}
                    </td>
                    <td className="max-w-[300px] py-4 pr-4">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium hover:text-brand-soft"
                      >
                        {job.title}
                      </a>
                      <p className="text-muted">{job.company}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <SourceBadge job={job} />
                    </td>
                    <td className="max-w-[180px] py-4 pr-4">
                      <p className="truncate" title={job.location}>
                        {job.location.replace(
                          /,?\s*United Arab Emirates/i,
                          "",
                        ) || "UAE"}
                      </p>
                      <WorkplaceChip workplace={job.workplace} />
                    </td>
                    <td className="py-4 pr-4">
                      <Salary job={job} />
                    </td>
                    <td className="py-4 pr-4">
                      <MatchMeter score={job.score} />
                    </td>
                    <td className="max-w-[200px] py-4 pr-4">
                      <StatusBadge status={job.status} />
                      {job.appliedAt && (
                        <p
                          className="mt-1 text-xs text-muted"
                          suppressHydrationWarning
                        >
                          {timeAgo(job.appliedAt)}
                        </p>
                      )}
                      {!job.appliedAt && job.reason && (
                        <p
                          className="mt-1 line-clamp-2 text-xs text-muted"
                          title={job.reason}
                        >
                          {job.reason}
                        </p>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <Actions
                        job={job}
                        busy={busyId === job.id}
                        onAction={onAction}
                      />
                    </td>
                  </tr>
                  {expanded && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <Details
                          job={job}
                          busy={busyId === job.id}
                          onAction={onAction}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="px-6 py-20 text-center">
            <p className="font-serif text-2xl italic">Nothing here yet.</p>
            <p className="mt-2 text-sm text-muted">
              {jobs.length
                ? "Try another tab or clear the search."
                : "Connect your accounts, then fetch jobs to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
