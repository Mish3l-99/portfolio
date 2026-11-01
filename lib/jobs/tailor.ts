import { jobsConfig } from "./config";
import { keywords, matchKeywords } from "./keywords";
import { candidate, roles, skillGroups, type Role } from "./profile";
import type { Job, Tailoring } from "./types";

/**
 * Resume tailoring. Deterministic by design: it reorders and selects from the
 * real resume, so a tailored copy emphasises what the posting cares about
 * without echoing the posting back. Phrasing rotates per job (seeded by id)
 * so two applications never look copy-pasted.
 */

type Focus = Tailoring["focus"];

export type TailoredResume = Tailoring & {
  roles: (Omit<Role, "bullets" | "keep" | "titles"> & { bullets: string[] })[];
  skills: { title: string; skills: string[] }[];
};

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Deterministic "random" pick so re-generating a job's resume is stable. */
const pick = <T>(items: T[], seed: number, salt = 0) =>
  items[(seed + salt * 7919) % items.length];

/** Keyword → weight: title hits count triple, body hits by frequency (capped). */
function weigh(job: Pick<Job, "title" | "description">) {
  const weights = new Map<string, number>();
  for (const kw of keywords) {
    if (!kw.has) continue;
    const inTitle = kw.pattern.test(job.title) ? 3 : 0;
    const global = new RegExp(kw.pattern.source, "gi");
    const inBody = Math.min((job.description.match(global) ?? []).length, 4);
    if (inTitle + inBody) weights.set(kw.name, inTitle + inBody);
  }
  return weights;
}

function focusOf(title: string, weights: Map<string, number>): Focus {
  if (/full[\s-]?stack/i.test(title)) return "fullstack";
  if (/front[\s-]?end|\bui\b|react|next\.?js|javascript/i.test(title))
    return "frontend";
  if (/back[\s-]?end|node|laravel|php|\bapi\b/i.test(title)) return "backend";
  let fe = 0;
  let be = 0;
  for (const kw of keywords) {
    const w = weights.get(kw.name) ?? 0;
    if (kw.focus === "frontend") fe += w;
    if (kw.focus === "backend") be += w;
  }
  if (fe > be * 1.6) return "frontend";
  if (be > fe * 1.6) return "backend";
  return "fullstack";
}

const top = (weights: Map<string, number>, from: string[], n: number) =>
  from
    .filter((s) => weights.has(s))
    .sort((a, b) => weights.get(b)! - weights.get(a)!)
    .slice(0, n);

/** Natural-language join: "A, B and C". */
const join = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

function headlineFor(
  focus: Focus,
  job: Pick<Job, "title">,
  weights: Map<string, number>,
  seed: number,
) {
  const noun = /engineer/i.test(job.title) ? "Engineer" : "Developer";
  const senior =
    /\b(senior|sr|lead)\b/i.test(job.title) || focus === "frontend"
      ? "Senior "
      : "";
  const fe = top(weights, ["React", "Next.js", "TypeScript"], 2);
  const be = top(weights, ["Node.js", "Laravel", "PHP", "Express"], 1);
  const stack =
    focus === "frontend"
      ? fe.length
        ? fe
        : ["React", "Next.js"]
      : focus === "backend"
        ? [be[0] ?? "Node.js", "REST APIs"]
        : [fe[0] ?? "React", be[0] ?? "Node.js"];
  const base = {
    frontend: pick(
      [`${senior}Frontend ${noun}`, `${senior}Front-End ${noun}`],
      seed,
    ),
    fullstack: pick(
      [`${senior}Full Stack ${noun}`, `${senior}Full-Stack ${noun}`],
      seed,
    ),
    backend: `Full Stack ${noun}`,
  }[focus];
  return `${base} · ${stack.join(" / ")}`;
}

const themes: { tags: string[]; lines: string[] }[] = [
  {
    tags: ["WebSockets", "Real-time"],
    lines: [
      "Built real-time messaging and live video streaming over WebSockets for a social platform serving users across the Arab world.",
      "Shipped socket-based messaging, notifications and live streaming for a community platform used across the region.",
    ],
  },
  {
    tags: ["Performance", "Scalability", "Caching"],
    lines: [
      "Keeps products fast under pressure, with caching strategies, performance tuning and load distribution that held up through high-traffic seasons.",
      "Has taken production systems through peak-traffic periods with caching strategies, performance tuning and multi-server load distribution.",
    ],
  },
  {
    tags: ["Laravel", "PHP", "E-commerce", "SEO"],
    lines: [
      "Led the rebuild of a legacy Laravel e-commerce system into a decoupled Next.js frontend with APIs serving web, mobile and admin.",
      "Modernised a legacy e-commerce platform into an SEO-friendly Next.js storefront backed by a shared Laravel API.",
    ],
  },
  {
    tags: ["Admin Dashboards", "Data Visualization"],
    lines: [
      "At home in data-heavy products — admin dashboards, multi-step workflows, advanced filtering and interactive charts.",
      "Builds complex internal tools: large-dataset search and filtering, reporting views and rich multi-step forms.",
    ],
  },
  {
    tags: ["Authentication", "Security"],
    lines: [
      "Hands-on with modern authentication, from JWT and OAuth flows to passkeys and authenticator-app 2FA.",
      "Has implemented secure sign-in end to end, including passkeys, 2FA, JWT and OAuth.",
    ],
  },
  {
    tags: [
      "UI/UX",
      "Responsive Design",
      "Framer Motion",
      "MUI",
      "Tailwind CSS",
    ],
    lines: [
      "Strong eye for detail: pixel-perfect, responsive interfaces with considered motion and UX.",
      "Cares about craft: responsive, detail-oriented UI with polished interactions and animation.",
    ],
  },
  {
    tags: ["Payment Gateways", "REST APIs"],
    lines: [
      "Integrated payment gateways, SMS/OTP and logistics providers to automate core business operations.",
      "Experienced wiring third-party services — payments, OTP and delivery APIs — into reliable production flows.",
    ],
  },
  {
    tags: ["Redux", "RTK Query", "Formik", "Zustand"],
    lines: [
      "Comfortable owning complex client state and data fetching with Redux Toolkit, RTK Query and Zustand.",
      "Structures large React codebases with predictable state management, typed data fetching and robust form validation.",
    ],
  },
  {
    tags: ["Agile", "Collaboration"],
    lines: [
      "Works closely with designers, backend engineers and QA to ship reliably in agile teams.",
      "A collaborative teammate who partners with design, backend and QA to keep releases smooth.",
    ],
  },
];

function summaryFor(
  focus: Focus,
  weights: Map<string, number>,
  workplace: Job["workplace"],
  seed: number,
) {
  const years = candidate.totalYears;
  const fe = top(
    weights,
    ["React", "Next.js", "TypeScript", "JavaScript", "Redux", "Tailwind CSS"],
    3,
  );
  const be = top(
    weights,
    ["Node.js", "Express", "Laravel", "PHP", "MySQL", "MongoDB"],
    3,
  );
  const feList = join(fe.length ? fe : ["React", "Next.js", "TypeScript"]);
  const beList = join(be.length ? be : ["Node.js", "Laravel"]);

  const opening = {
    frontend: pick(
      [
        `Frontend developer with ${years}+ years building fast, maintainable web products in ${feList}, currently a Senior Frontend Developer at a Dubai tech company.`,
        `Senior frontend developer with ${years}+ years of experience turning complex requirements into clean, performant ${feList} applications.`,
      ],
      seed,
    ),
    fullstack: pick(
      [
        `Full stack developer with ${years}+ years delivering production web applications end to end — ${feList} on the frontend, ${beList} behind it.`,
        `Full-stack web developer with ${years}+ years across freelance, startup and mid-sized teams, building with ${feList} and ${beList}.`,
      ],
      seed,
    ),
    backend: pick(
      [
        `Full stack developer with ${years}+ years designing APIs, data models and integrations with ${beList}, paired with modern React/Next.js frontends.`,
        `Developer with ${years}+ years building backend services and REST APIs in ${beList}, with the frontend depth to ship complete features.`,
      ],
      seed,
    ),
  }[focus];

  const ranked = themes
    .map((t, i) => ({
      t,
      i,
      w: t.tags.reduce((sum, tag) => sum + (weights.get(tag) ?? 0), 0),
    }))
    .filter((x) => x.w > 0)
    .sort((a, b) => b.w - a.w || a.i - b.i)
    .slice(0, 2)
    .map((x) => pick(x.t.lines, seed, x.i));
  if (ranked.length < 2) ranked.push(pick(themes[3].lines, seed, 1));

  const closing = pick(
    [
      workplace === "remote"
        ? "Used to async, remote collaboration and leans on modern AI tooling to move faster without cutting corners."
        : "Based in Dubai and uses modern AI tooling daily to move faster while keeping code clean and maintainable.",
      "Pragmatic about trade-offs, and uses AI-assisted workflows to raise speed and code quality together.",
    ],
    seed,
    3,
  );

  return [opening, ...ranked, closing].join(" ");
}

export function tailorResume(
  job: Pick<Job, "id" | "title" | "description" | "workplace">,
): TailoredResume {
  const seed = hash(job.id);
  const weights = weigh(job);
  const focus = focusOf(job.title, weights);
  const relevance = (tags: string[]) =>
    tags.reduce((sum, t) => sum + (weights.get(t) ?? 0), 0);

  const tailoredRoles = roles.map(({ bullets, keep, titles, ...role }) => ({
    ...role,
    title: titles?.[focus] ?? role.title,
    bullets: bullets
      .map((b, i) => ({ b, i, r: relevance(b.tags) }))
      .sort((a, b) => b.r - a.r || a.i - b.i)
      .slice(0, keep)
      .map(({ b }) => b.text),
  }));

  const skills = skillGroups
    .map((group, gi) => ({
      title: group.title,
      gi,
      skills: [...group.skills]
        .map((s, i) => ({ s, i, w: weights.get(s) ?? 0 }))
        .sort((a, b) => b.w - a.w || a.i - b.i)
        .map((x) => x.s),
      w: relevance(group.skills),
    }))
    // Backend-leaning roles see backend skills first; otherwise keep frontend on top.
    .sort((a, b) =>
      focus === "backend" ? b.w - a.w || a.gi - b.gi : a.gi - b.gi,
    )
    .map(({ title, skills }) => ({ title, skills }));

  return {
    headline: headlineFor(focus, job, weights, seed),
    summary: summaryFor(focus, weights, job.workplace, seed),
    matchedKeywords: [...weights.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k),
    focus,
    aiUsed: false,
    generatedAt: new Date().toISOString(),
    roles: tailoredRoles,
    skills,
  };
}

/**
 * Optional polish: one small call that rewrites only the summary. The model sees
 * the summary and the matched keyword names — never the posting text — so it
 * can't parrot the job description.
 */
export async function polishSummary(resume: TailoredResume, jobTitle: string) {
  const { apiKey, model, enabled } = jobsConfig.ai;
  if (!enabled || !apiKey) return resume;
  try {
    const reasoning = /^(gpt-5|o\d)/.test(model)
      ? { reasoning_effort: "minimal" }
      : {};
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model,
        ...reasoning,
        messages: [
          {
            role: "system",
            content:
              "You edit resume summaries. Rewrite the summary so it reads naturally for the target role. Rules: 3–4 sentences, 55–80 words, third-person implied (no 'I'), no buzzword stuffing, keep every fact true, do not add any technology, employer, metric or claim that isn't already in the summary, and do not mention the target company. Return only the summary text.",
          },
          {
            role: "user",
            content: `Target role: ${jobTitle}\nThemes the role values (emphasise lightly, don't list them all): ${resume.matchedKeywords.slice(0, 8).join(", ")}\n\nSummary:\n${resume.summary}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text =
      data.choices[0]?.message.content.trim().replace(/^"|"$/g, "") ?? "";
    // Reject anything that drifted: wrong length or a stack we don't claim.
    const invented = matchKeywords(text).some((k) => !k.has);
    if (text.length < 200 || text.length > 700 || invented) return resume;
    return { ...resume, summary: text, aiUsed: true };
  } catch {
    return resume;
  }
}
