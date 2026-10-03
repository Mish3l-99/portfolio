import Link from "next/link";
import { FiArrowUpRight, FiCode } from "react-icons/fi";

import BrowserFrame from "@/components/ui/BrowserFrame";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/lib/projects";

/** Large spotlight card for the most recent client project. */
export default function RecentProject({ project }: { project: Project }) {
  return (
    <Reveal>
      <article className="card group relative grid gap-10 overflow-hidden p-6 md:grid-cols-12 md:items-center md:p-10">
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 size-96 rounded-full bg-brand/15 blur-[120px]"
        />

        <div className="md:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] tracking-widest text-brand uppercase">
            Featured · Latest client work
          </p>
          <h3 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-2 font-serif text-xl text-muted italic">
            {project.summary}
          </p>
          <p className="mt-6 leading-relaxed text-muted">
            {project.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg/70"
              >
                {tech}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visit site <FiArrowUpRight />
            </a>
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Source <FiCode />
            </a>
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          aria-label={`${project.title} case study`}
          className="md:col-span-7 md:rotate-1 md:transition md:duration-700 md:group-hover:rotate-0"
        >
          <BrowserFrame
            src={project.image}
            alt={`${project.title} homepage`}
            sizes="(min-width: 768px) 55vw, 100vw"
          />
        </Link>
      </article>
    </Reveal>
  );
}
