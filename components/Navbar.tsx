"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";

import SocialLinks from "@/components/ui/SocialLinks";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/utils";

/** Tracks which home-page section is currently in the middle of the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (isIntersecting) setActive(target.id);
          else
            setActive((current) =>
              current === target.id ? undefined : current,
            );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of navLinks) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : undefined;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(pathname === "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border py-2 pr-2 pl-5 transition-all duration-500",
          scrolled
            ? "border-line bg-ink/70 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "border-transparent",
        )}
      >
        <Link href="/" aria-label="Home" onClick={() => setMenuOpen(false)}>
          <Image
            src="/assets/logo/MN.png"
            alt={site.name}
            width={56}
            height={30}
            className="h-7 w-auto transition hover:scale-105"
            preload
          />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={`/#${id}`}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors",
                  active === id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/8"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.resume}
            download
            className="btn-primary hidden py-2 sm:inline-flex"
          >
            Résumé <FiArrowUpRight />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-full border border-line bg-white/4 md:hidden"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10 flex flex-col justify-between bg-ink/95 px-6 pt-28 pb-10 backdrop-blur-2xl md:hidden"
          >
            <ul className="space-y-2">
              {navLinks.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                >
                  <Link
                    href={`/#${id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-1 text-5xl font-semibold tracking-tight"
                  >
                    <span className="font-mono text-xs text-brand">
                      0{i + 1}
                    </span>
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="space-y-6">
              <p className="font-mono text-xs tracking-[0.25em] text-muted uppercase">
                Let&apos;s connect
              </p>
              <SocialLinks />
              <a href={site.resume} download className="btn-primary w-full">
                Download résumé <FiArrowUpRight />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
