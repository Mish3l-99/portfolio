"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDownloadCloud,
  FiLink,
  FiLoader,
  FiLogOut,
  FiRotateCcw,
  FiSend,
  FiSquare,
  FiXCircle,
  FiZap,
} from "react-icons/fi";

import {
  applyOneAction,
  connectAccountsAction,
  logout,
  regenerateResumeAction,
  resetSignInAction,
  runAction,
  setStatusAction,
  stopAction,
} from "@/app/jobs/actions";
import type { Site } from "@/lib/jobs/connection";
import type { RunMode } from "@/lib/jobs/types";
import type { DashboardData, JobRow } from "@/lib/jobs/view";
import { cn } from "@/utils";

import JobsTable, { type RowAction } from "./JobsTable";
import { formatAed, formatDate, timeAgo } from "./parts";

const siteName: Record<Site, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
};

type Settings = {
  minSalary: number;
  defaultSalary: number;
  searches: string[];
  sources: string[];
  aiEnabled: boolean;
  maxPerRun: number;
  serverless: boolean;
};

function useDashboard(initial: DashboardData) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const refresh = useCallback(async () => {
    const res = await fetch("/api/jobs", { cache: "no-store" }).catch(
      () => null,
    );
    if (res?.status === 401) router.push("/jobs/login");
    if (res?.ok) setData(await res.json());
  }, [router]);

  // Fast polling while the bot works, slow otherwise.
  const running = data.run.running;
  useEffect(() => {
    const id = setInterval(refresh, running ? 2000 : 20000);
    return () => clearInterval(id);
  }, [running, refresh]);

  return { data, refresh };
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink p-5">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p
        className={cn(
          "mt-2 text-3xl font-semibold tracking-tight tabular-nums",
          accent && value > 0 && "text-gradient",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function Dashboard({
  initial,
  settings,
}: {
  initial: DashboardData;
  settings: Settings;
}) {
  const { data, refresh } = useDashboard(initial);
  const { jobs, run, runs, connection } = data;
  const [dryRun, setDryRun] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const stats = useMemo(() => {
    const count = (...s: JobRow["status"][]) =>
      jobs.filter((j) => s.includes(j.status)).length;
    const today = new Date().toDateString();
    return {
      total: jobs.length,
      today: jobs.filter((j) => new Date(j.foundAt).toDateString() === today)
        .length,
      auto: count("applied"),
      manual: count("applied_manual"),
      needsYou: count("needs_manual", "external"),
      queue: count("new"),
      skipped: count("skipped"),
    };
  }, [jobs]);

  const lastRun = runs.find((r) => r.finishedAt);

  async function start(mode: RunMode) {
    setStarting(true);
    setNotice(null);
    const res = await runAction(mode, dryRun);
    if (!res.ok) setNotice(res.error);
    await refresh();
    setStarting(false);
  }

  async function connect(sites?: Site[]) {
    const res = await connectAccountsAction(sites);
    setNotice(
      res.ok
        ? "A normal Chrome window opened. Sign in there, then close the whole window — runs unlock once it's closed."
        : res.error,
    );
    await refresh();
  }

  async function reset(site: Site) {
    const name = siteName[site];
    if (
      !confirm(
        `Sign the bot out of ${name} and clear its saved state? You'll sign in again afterwards.`,
      )
    )
      return;
    const res = await resetSignInAction(site);
    setNotice(
      res.ok
        ? `${name} reset. Click the ${name} badge to sign in again.`
        : res.error,
    );
    await refresh();
  }

  async function onAction(job: JobRow, action: RowAction) {
    setBusyId(job.id);
    setNotice(null);
    try {
      if (action.type === "status")
        await setStatusAction(job.id, action.status);
      if (action.type === "regenerate") await regenerateResumeAction(job.id);
      if (action.type === "autoApply") {
        const res = await applyOneAction(job.id, action.dryRun);
        if (!res.ok) setNotice(res.error);
      }
    } catch (error) {
      setNotice((error as Error).message);
    }
    await refresh();
    setBusyId(null);
  }

  const busy = run.running || starting || run.loginOpen;

  return (
    <div className="page max-w-[1400px] py-10">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/assets/logo/MN.png"
            alt=""
            width={48}
            height={26}
            className="h-6 w-auto"
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Job <span className="font-serif font-normal italic">hunt</span>
            </h1>
            <p className="text-sm text-muted" suppressHydrationWarning>
              {lastRun
                ? `Last run ${timeAgo(lastRun.finishedAt)} · ${formatDate(lastRun.finishedAt!)}`
                : "No runs yet"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(["linkedin", "indeed"] as const).map((site) => (
            <span
              key={site}
              className={cn(
                "flex items-center rounded-full border text-xs",
                connection[site]
                  ? "border-emerald-400/30 text-emerald-300"
                  : "border-brand/40 text-brand-soft",
              )}
            >
              <button
                onClick={() => connect([site])}
                disabled={busy}
                title={
                  connection[site]
                    ? `Signed in to ${siteName[site]}. Click to open it again.`
                    : `Not signed in. Click to sign in to ${siteName[site]}.`
                }
                className="flex items-center gap-1.5 py-1.5 pr-2 pl-3 disabled:opacity-50"
              >
                {connection[site] ? <FiCheckCircle /> : <FiXCircle />}
                {siteName[site]}
              </button>
              <button
                onClick={() => reset(site)}
                disabled={busy}
                title={`Reset ${siteName[site]} sign-in`}
                className="border-l border-current/20 py-1.5 pr-3 pl-2 opacity-60 transition hover:opacity-100 disabled:opacity-30"
              >
                <FiRotateCcw />
              </button>
            </span>
          ))}
          <button
            onClick={() => connect()}
            disabled={busy}
            className="btn-ghost disabled:opacity-50"
          >
            <FiLink /> Connect accounts
          </button>
          <button
            onClick={() => logout()}
            className="btn-ghost"
            title="Sign out"
          >
            <FiLogOut />
          </button>
        </div>
      </header>

      {run.loginOpen && (
        <p className="mt-6 flex items-center gap-2 rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-200">
          <FiLink className="shrink-0" /> The sign-in window is open. It&apos;s
          a normal Chrome window, so &quot;not a robot&quot; checks work there.
          Sign in, then close the whole window; runs are paused until you do.
          The badges above turn green once the sign-ins are saved (can take
          ~30s).
        </p>
      )}

      {settings.serverless && (
        <p className="mt-6 flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          <FiAlertTriangle /> This deployment has no Chrome or writable disk.
          Run the tool locally with <code>pnpm dev</code>.
        </p>
      )}

      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-5">
        <Stat label="Found" value={stats.total} hint={`${stats.today} today`} />
        <Stat label="Auto-applied" value={stats.auto} accent />
        <Stat
          label="Needs you"
          value={stats.needsYou}
          hint="External or unanswered"
          accent
        />
        <Stat label="Applied by you" value={stats.manual} />
        <Stat
          label="In queue · skipped"
          value={stats.queue}
          hint={`${stats.skipped} skipped as poor fits`}
        />
      </section>

      {/* Run controls */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-medium">Run the bot</h2>
              <p className="mt-0.5 text-sm text-muted">
                Searches{" "}
                {settings.sources
                  .map((s) => (s === "linkedin" ? "LinkedIn" : "Indeed"))
                  .join(" + ")}
                , tailors a resume per posting, applies where it can (max{" "}
                {settings.maxPerRun} per run).
              </p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
              <span className="text-muted">Dry run</span>
              <button
                role="switch"
                aria-checked={dryRun}
                onClick={() => setDryRun(!dryRun)}
                className={cn(
                  "relative h-5 w-9 rounded-full transition",
                  dryRun ? "bg-brand" : "bg-white/15",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-4 rounded-full bg-white transition-all",
                    dryRun ? "left-4.5" : "left-0.5",
                  )}
                />
              </button>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => start("full")}
              disabled={busy}
              className="btn-primary disabled:opacity-50"
            >
              <FiZap /> Find & apply
            </button>
            <button
              onClick={() => start("fetch")}
              disabled={busy}
              className="btn-ghost disabled:opacity-50"
            >
              <FiDownloadCloud /> Find only
            </button>
            <button
              onClick={() => start("apply")}
              disabled={busy || stats.queue === 0}
              className="btn-ghost disabled:opacity-50"
            >
              <FiSend /> Apply to queue ({stats.queue})
            </button>
            {run.running && (
              <button
                onClick={() => stopAction().then(refresh)}
                className="btn-ghost text-brand-soft"
              >
                <FiSquare /> Stop
              </button>
            )}
          </div>
          {dryRun && (
            <p className="mt-3 text-xs text-muted">
              Dry run fills every form up to the Submit button and stops —
              nothing is sent. Good for a first test.
            </p>
          )}

          {!run.running && run.logs.length === 0 && (
            <ol className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-3">
              {[
                [
                  "Connect accounts",
                  "Sign in to LinkedIn and Indeed once in the Chrome window that opens.",
                ],
                [
                  "Dry run first",
                  "Toggle dry run and hit Find & apply: forms get filled, nothing is sent.",
                ],
                [
                  "Go live",
                  "Turn dry run off. Anything the bot can't finish lands in Needs you.",
                ],
              ].map(([title, body], i) => (
                <li key={title} className="rounded-2xl border border-line p-4">
                  <p className="font-mono text-xs text-brand">0{i + 1}</p>
                  <p className="mt-1 font-medium text-fg">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed">{body}</p>
                </li>
              ))}
            </ol>
          )}

          {(run.running || run.logs.length > 0) && (
            <div className="mt-5 rounded-2xl border border-line bg-ink/60">
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-sm">
                {run.running ? (
                  <FiLoader className="animate-spin text-brand" />
                ) : (
                  <span className="size-2 rounded-full bg-emerald-400" />
                )}
                <span className="truncate">
                  {run.running ? run.phase : "Last run finished"}
                </span>
                {run.summary && (
                  <span className="ml-auto shrink-0 font-mono text-xs text-muted">
                    {run.summary.found} found · {run.summary.applied} applied ·{" "}
                    {run.summary.needsYou} for you
                  </span>
                )}
              </div>
              <ol className="max-h-48 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed">
                {run.logs.slice(-60).map((l, i) => (
                  <li
                    key={i}
                    className={cn(
                      l.level === "error"
                        ? "text-brand-soft"
                        : l.level === "warn"
                          ? "text-amber-300"
                          : "text-muted",
                    )}
                  >
                    <span className="text-muted/50" suppressHydrationWarning>
                      {new Date(l.at).toLocaleTimeString("en-GB")}{" "}
                    </span>
                    {l.msg}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <aside className="card space-y-4 p-6 text-sm">
          <h2 className="font-medium">Targeting</h2>
          <dl className="space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Salary floor</dt>
              <dd>{formatAed(settings.minSalary)} AED/mo</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Asks when unposted</dt>
              <dd>{formatAed(settings.defaultSalary)} AED/mo</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Where</dt>
              <dd>UAE · hybrid preferred</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Resume AI polish</dt>
              <dd>{settings.aiEnabled ? "On (1 small call/job)" : "Off"}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-1.5">
            {settings.searches.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </aside>
      </section>

      {/* Sites that need a human */}
      {run.blocked.length > 0 && (
        <div className="mt-6 space-y-2">
          {run.blocked.map((b, i) => (
            <p
              key={i}
              className="flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
            >
              <FiAlertTriangle className="shrink-0" />
              <b className="font-medium">
                {b.source === "linkedin" ? "LinkedIn" : "Indeed"}:
              </b>{" "}
              {b.message}
            </p>
          ))}
        </div>
      )}

      {notice && (
        <p
          className="mt-6 rounded-2xl border border-line bg-white/3 px-4 py-3 text-sm"
          role="status"
        >
          {notice}
        </p>
      )}

      <section className="mt-6">
        <JobsTable jobs={jobs} busyId={busyId} onAction={onAction} />
      </section>
    </div>
  );
}
