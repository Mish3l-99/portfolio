import Image from "next/image";
import { FiArrowUpRight, FiSend } from "react-icons/fi";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Serif from "@/components/ui/Serif";
import SocialLinks from "@/components/ui/SocialLinks";
import { site } from "@/lib/site";

const field =
  "w-full rounded-2xl border border-line bg-white/3 px-4 py-3.5 text-fg placeholder:text-muted/60 transition focus:border-brand/60 focus:bg-white/5 focus:outline-none";

export default function Contact() {
  return (
    <section id="contact" className="py-28 md:py-40">
      <div className="page">
        <SectionHeading index="04" label="Contact">
          Let&apos;s build something <Serif>together</Serif>.
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="card relative isolate flex h-full flex-col justify-between gap-12 overflow-hidden p-8">
              <Image
                src="/contact.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="-z-10 object-cover opacity-40"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/80 to-ink/30" />

              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {site.name}
                </p>
                <p className="text-brand">{site.role}</p>
                <p className="mt-6 max-w-sm text-muted">
                  I&apos;m available for freelance projects and full-time
                  positions. Tell me what you&apos;re building.
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-2 text-lg font-medium break-all hover:text-brand"
                >
                  {site.email}
                  <FiArrowUpRight className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <SocialLinks />
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.1}>
            <form
              action={site.formAction}
              method="POST"
              className="card flex h-full flex-col gap-4 p-6 md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="font-mono text-xs text-muted">Name</span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jane Doe"
                    className={field}
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-mono text-xs text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@company.com"
                    className={field}
                  />
                </label>
              </div>
              <label className="flex flex-1 flex-col gap-2">
                <span className="font-mono text-xs text-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={7}
                  placeholder="Tell me about your project…"
                  className={`${field} flex-1 resize-none`}
                />
              </label>
              <button
                type="submit"
                className="btn-primary mt-2 self-start px-7 py-3"
              >
                Send message <FiSend />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
