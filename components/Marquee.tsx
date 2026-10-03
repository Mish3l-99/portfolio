import { allSkills } from "@/lib/skills";

/** An endless, slightly tilted ribbon of tech names between hero and about. */
export default function Marquee() {
  const items = [...allSkills, ...allSkills];

  return (
    <div className="overflow-x-clip py-8 select-none">
      <div className="-mx-[5%] -rotate-2 overflow-hidden border-y border-line bg-surface py-5">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {items.map(({ name, icon: Icon, color }, i) => (
            <span
              key={i}
              aria-hidden={i >= allSkills.length}
              className="flex items-center gap-4 px-6 text-2xl font-semibold tracking-tight whitespace-nowrap text-fg/80 md:text-3xl"
            >
              <Icon style={{ color }} className="shrink-0" />
              {name}
              <span className="ml-6 font-serif text-brand">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
