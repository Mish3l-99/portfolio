import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiCode,
} from "react-icons/fi";

import BrowserFrame from "@/components/ui/BrowserFrame";
import Reveal from "@/components/ui/Reveal";
import { getNextProject, getProject, projects } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[id]">): Promise<Metadata> {
  const project = getProject((await params).id);
  return project
    ? { title: project.title, description: project.description }
    : {};
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const next = getNextProject(id);
  const number = String(projects.indexOf(project) + 1).padStart(2, "0");

  return (
    <article className="relative isolate overflow-hidden pt-36 pb-24">
      <div
        aria-hidden
        className="absolute -top-56 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[150px]"
      />

      <div className="page">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted uppercase hover:text-fg"
        >
          <FiArrowLeft className="transition group-hover:-translate-x-1" />
          All work
        </Link>

        <Reveal className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-sm text-brand">Project {number}</p>
            <h1 className="mt-3 text-6xl leading-[0.9] font-semibold tracking-[-0.04em] md:text-8xl">
              {project.title}
            </h1>
            <p className="mt-4 font-serif text-2xl text-muted italic md:text-3xl">
              {project.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Live demo <FiArrowUpRight />
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
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <BrowserFrame
            src={project.image}
            alt={`${project.title} screenshot`}
            sizes="(min-width: 1152px) 1152px, 100vw"
            preload
          />
        </Reveal>

        <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
              Overview
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-fg/90 md:text-2xl">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
              Built with
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-line bg-white/3 px-4 py-2 text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href={`/projects/${next.id}`}
          className="group mt-24 flex items-center justify-between gap-6 rounded-3xl border border-line p-8 transition hover:border-brand/40 hover:bg-brand/5 md:p-12"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
              Next project
            </p>
            <p className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
              {next.title}
            </p>
          </div>
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand text-white transition duration-500 group-hover:translate-x-1 md:size-20">
            <FiArrowRight size={24} />
          </span>
        </Link>
      </div>
    </article>
  );
}
