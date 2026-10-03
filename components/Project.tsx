import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

import BrowserFrame from "@/components/ui/BrowserFrame";
import type { Project as ProjectType } from "@/lib/projects";

type Props = {
  project: ProjectType;
  index: number;
};

/** Grid card linking to a project's detail page. */
export default function Project({ project, index }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-3xl border border-line bg-surface/60 p-3 transition duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-surface"
    >
      <BrowserFrame
        src={project.image}
        alt={`${project.title} preview`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="rounded-2xl shadow-none"
      />
      <div className="flex items-start justify-between gap-4 px-3 pt-5 pb-3">
        <div>
          <p className="font-mono text-xs text-muted">
            {String(index).padStart(2, "0")} · {project.stack[0]}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm text-muted">{project.summary}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition duration-500 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
          <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
