import Project from "@/components/Project";
import RecentProject from "@/components/RecentProject";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Serif from "@/components/ui/Serif";
import { featuredProject, otherProjects } from "@/lib/projects";

export default function Projects() {
  return (
    <section id="work" className="py-28 md:py-40">
      <div className="page">
        <SectionHeading index="03" label="Selected work">
          Things I&apos;ve <Serif>built</Serif> lately.
        </SectionHeading>

        {featuredProject && <RecentProject project={featuredProject} />}

        <div className="mt-20 mb-8 flex items-end justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight">
            More projects
          </h3>
          <p className="font-mono text-xs text-muted">
            {otherProjects.length} projects
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 0.08}>
              <Project project={project} index={i + 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
