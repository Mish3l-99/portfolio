import Reveal from "./Reveal";

type Props = {
  index: string;
  label: string;
  children: React.ReactNode;
};

/** Numbered eyebrow ("01 — About") above a large display title. */
export default function SectionHeading({ index, label, children }: Props) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-muted uppercase">
        <span className="text-brand">{index}</span>
        <span className="h-px w-10 bg-line" />
        {label}
      </p>
      <h2 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">
        {children}
      </h2>
    </Reveal>
  );
}
