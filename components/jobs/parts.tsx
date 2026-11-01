import type { JobRow } from "@/lib/jobs/view";
import type { JobStatus, Workplace } from "@/lib/jobs/types";
import { cn } from "@/utils";

export const statusMeta: Record<
  JobStatus,
  { label: string; className: string }
> = {
  new: {
    label: "Queued",
    className: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  },
  applying: {
    label: "Applying…",
    className:
      "animate-pulse border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  applied: {
    label: "Auto-applied",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  applied_manual: {
    label: "Applied by you",
    className: "border-emerald-400/30 text-emerald-300",
  },
  needs_manual: {
    label: "Needs you",
    className: "border-brand/40 bg-brand/10 text-brand-soft",
  },
  external: {
    label: "External site",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  skipped: { label: "Skipped", className: "border-line text-muted" },
  dismissed: {
    label: "Dismissed",
    className: "border-line text-muted/70 line-through",
  },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

export function SourceBadge({
  job,
}: {
  job: Pick<JobRow, "source" | "easyApply">;
}) {
  const linkedin = job.source === "linkedin";
  return (
    <span className="flex flex-col items-start gap-1">
      <span
        className={cn(
          "rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium",
          linkedin
            ? "bg-[#0a66c2]/20 text-[#7cb8f5]"
            : "bg-[#2557a7]/20 text-[#9db8f0]",
        )}
      >
        {linkedin ? "LinkedIn" : "Indeed"}
      </span>
      {job.easyApply && (
        <span className="text-[11px] text-muted">
          {linkedin ? "Easy Apply" : "Indeed Apply"}
        </span>
      )}
    </span>
  );
}

const workplaceLabel: Record<Workplace, string> = {
  hybrid: "Hybrid",
  remote: "Remote",
  onsite: "On-site",
  unknown: "—",
};

export function WorkplaceChip({ workplace }: { workplace: Workplace }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium",
        workplace === "hybrid"
          ? "text-emerald-300"
          : workplace === "remote"
            ? "text-sky-300"
            : "text-muted",
      )}
    >
      {workplaceLabel[workplace]}
    </span>
  );
}

/** Score → 0..1 meter. Scores run roughly from 0 to 12. */
export function MatchMeter({ score }: { score: number }) {
  const pct = Math.max(0.04, Math.min(1, score / 11));
  const tone =
    score >= 7 ? "bg-emerald-400" : score >= 4 ? "bg-amber-300" : "bg-muted";
  return (
    <span className="flex items-center gap-2" title={`Match score ${score}`}>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/8">
        <span
          className={cn("block h-full rounded-full", tone)}
          style={{ width: `${pct * 100}%` }}
        />
      </span>
      <span className="font-mono text-xs text-muted tabular-nums">
        {score.toFixed(1)}
      </span>
    </span>
  );
}

const aed = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });
export const formatAed = (n: number) => aed.format(n);

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string | null) {
  if (!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
