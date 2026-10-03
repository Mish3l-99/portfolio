import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <section className="page flex min-h-dvh flex-col items-start justify-center gap-6 pt-24">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="text-6xl font-semibold tracking-tight md:text-8xl">
        Lost in the <span className="font-serif font-normal italic">void</span>.
      </h1>
      <p className="text-muted">This page doesn&apos;t exist (yet).</p>
      <Link href="/" className="btn-ghost">
        <FiArrowLeft /> Back home
      </Link>
    </section>
  );
}
