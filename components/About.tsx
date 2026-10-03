import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Serif from "@/components/ui/Serif";

const highlights = [
  { value: "15+", label: "Freelance projects delivered" },
  { value: "End-to-end", label: "From UI to APIs to deployment" },
  { value: "Real-time", label: "Messaging & notifications at scale" },
];

const story = [
  "My journey into software development started out of pure curiosity — experimenting with small changes to a website and quickly realizing how much could be built from just a few lines of code. Simple HTML and CSS edits soon became a deeper interest in building interactive, meaningful digital experiences.",
  "I moved into JavaScript and backend development, working with React, Next.js, Node.js and Laravel. Freelancing for clients across different industries exposed me to the challenges beyond writing code: performance, scalability and reliability.",
  "Since then I've built and maintained larger production systems — redesigning legacy platforms, developing scalable architectures and shipping real-time features. Today I work as a full-time developer, keep growing through side projects, and lean on modern AI tools to write better code, faster.",
];

const badgeWords = [
  "Design",
  "Develop",
  "Deploy",
  "Design",
  "Develop",
  "Deploy",
];

/** Circular text that slowly spins around the logo mark. */
function SpinningBadge() {
  return (
    <div className="absolute -bottom-10 -left-6 grid size-32 place-items-center rounded-full border border-line bg-ink/80 backdrop-blur-md md:-left-10 md:size-36">
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 animate-spin-slow"
      >
        <defs>
          <path
            id="badge-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        {/* textLength = the path's circumference, so the loop closes seamlessly. */}
        <text className="fill-fg/70 font-mono text-[7px] font-medium uppercase">
          <textPath
            href="#badge-circle"
            textLength={238}
            lengthAdjust="spacing"
          >
            {badgeWords.map((word, i) => (
              <tspan key={i}>
                {word}
                <tspan className="fill-brand">{"\u00a0✦\u00a0"}</tspan>
              </tspan>
            ))}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[22%] rounded-full border border-line" />
      <Image
        src="/assets/logo/MN.png"
        alt=""
        width={48}
        height={26}
        className="h-6 w-auto"
      />
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-28 md:py-40">
      <div className="page">
        <SectionHeading index="01" label="About">
          Not your <Serif>typical</Serif> developer.
        </SectionHeading>

        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          <div className="space-y-6 text-lg leading-relaxed text-muted md:col-span-7">
            {story.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <blockquote className="mt-10 border-l-2 border-brand pl-6 font-serif text-2xl leading-snug text-fg italic md:text-3xl">
                “Development isn&apos;t just about building features — it&apos;s
                about building systems that last, perform, and deliver real
                value.”
              </blockquote>
            </Reveal>
          </div>

          <Reveal className="md:col-span-5" delay={0.15}>
            <div className="relative">
              <div className="group relative aspect-4/5 overflow-hidden rounded-3xl border border-line">
                <Image
                  src="/about.jpg"
                  alt="Code on a monitor"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-left grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-brand/20 mix-blend-multiply" />
              </div>
              <SpinningBadge />
            </div>
          </Reveal>
        </div>

        <ul className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
          {highlights.map(({ value, label }, i) => (
            <li key={label} className="bg-ink">
              <Reveal delay={i * 0.1} className="p-8">
                <p className="text-gradient text-4xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="mt-2 text-sm text-muted">{label}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
