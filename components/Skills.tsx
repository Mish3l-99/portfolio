import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Serif from "@/components/ui/Serif";
import { skillGroups } from "@/lib/skills";
import { cn } from "@/utils";

// Bento layout: wide, narrow / narrow, wide.
const spans = [
  "md:col-span-2",
  "md:col-span-1",
  "md:col-span-1",
  "md:col-span-2",
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 md:py-40">
      <div className="page">
        <SectionHeading index="02" label="Toolkit">
          The tools I use to <Serif>ship</Serif>.
        </SectionHeading>

        <div className="grid gap-4 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08} className={spans[i]}>
              <article className="card group relative h-full overflow-hidden p-7 md:p-8">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 size-56 rounded-full bg-brand/0 blur-3xl transition duration-700 group-hover:bg-brand/15"
                />
                <p className="font-mono text-xs text-brand">0{i + 1}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{group.blurb}</p>

                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {group.skills.map(({ name, icon: Icon, color }) => (
                    <li
                      key={name}
                      style={{ "--c": color } as React.CSSProperties}
                      className={cn(
                        "flex items-center gap-2 rounded-full border border-line bg-white/3 py-2 pr-4 pl-3 text-sm transition duration-300",
                        "hover:-translate-y-0.5 hover:border-(--c)/60 hover:bg-(--c)/10",
                      )}
                    >
                      <Icon className="text-(--c)" size={16} />
                      {name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
