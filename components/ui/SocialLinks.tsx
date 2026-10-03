import { socials } from "@/lib/site";
import { cn } from "@/utils";

/** Round icon buttons for every social profile. */
export default function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex gap-3", className)}>
      {socials.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full border border-line bg-white/3 text-fg/80 transition duration-300 hover:-translate-y-0.5 hover:border-brand/60 hover:text-brand"
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
