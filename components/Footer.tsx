import { FiArrowUp } from "react-icons/fi";

import SocialLinks from "@/components/ui/SocialLinks";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16">
      <div className="page flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <p className="max-w-xs text-muted">
            Designed &amp; built by {site.name} with Next.js.
          </p>
          <SocialLinks />
        </div>
        <a href="#" className="btn-ghost self-start md:self-auto">
          Back to top <FiArrowUp />
        </a>
      </div>

      <div className="page mt-10 flex justify-between border-t border-line py-6 font-mono text-xs text-muted">
        <span>
          © {new Date().getFullYear()} {site.firstName}
        </span>
        <span>{site.role}</span>
      </div>

      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center text-[22vw] leading-none font-semibold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.12)]"
      >
        {site.firstName}
      </p>
    </footer>
  );
}
