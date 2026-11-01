import { matchKeywords } from "../keywords";
import { candidate, skillYears } from "../profile";
import type { Job } from "../types";

/**
 * Maps a form question to an answer from the profile. Returns null when it
 * can't answer truthfully — the application is then handed to you instead of guessing.
 */

export type FieldKind =
  "text" | "number" | "textarea" | "select" | "radio" | "checkbox";

type Ctx = { job: Job; kind: FieldKind };

const YES = "Yes";
const NO = "No";
const yn = (v: boolean | null) => (v === null ? null : v ? YES : NO);

function yearsFor(label: string) {
  const matched = matchKeywords(label);
  if (matched.some((k) => !k.has)) return 0;
  const ours = matched.filter((k) => k.has && skillYears[k.name] !== undefined);
  if (ours.length) return Math.max(...ours.map((k) => skillYears[k.name]));
  // "…experience with/in X": only answer if X is generic, never for an unknown tool or domain.
  const subject =
    label.match(/\b(?:with|in|using|on)\s+(.+?)\??\s*$/i)?.[1] ?? "";
  if (
    subject &&
    !/^(total|the industry|(this|a similar|the same) (role|field|position)|(software|web|it|front[\s-]?end|full[\s-]?stack) (development|engineering)|software|web development|programming|development)$/i.test(
      subject.trim(),
    )
  )
    return null;
  return /experience/i.test(label) ? candidate.totalYears : null;
}

function coverNote(job: Job) {
  return `Hi ${job.company} team — I'm a Dubai-based full stack developer (React, Next.js, Node.js, Laravel) with ${candidate.totalYears}+ years building production web apps, currently a Senior Frontend Developer at Evolvex Technology. The ${job.title} role lines up well with what I do day to day, and I'd welcome a conversation. Portfolio: ${candidate.website}`;
}

const rules: [RegExp, (ctx: Ctx, label: string) => string | null][] = [
  // Identity & contact
  [/\b(first|given)\s*name/i, () => candidate.firstName],
  [/\b(last|family|sur)\s*name/i, () => candidate.lastName],
  [/^\s*(full\s*)?name\b/i, () => candidate.name],
  [/e-?mail/i, () => candidate.email],
  [/country\s*code/i, () => candidate.phoneCountry],
  [
    /\b(mobile|phone|telephone|contact number|whatsapp)\b/i,
    ({ job }) =>
      job.source === "linkedin" ? candidate.phoneLocal : candidate.phone,
  ],
  [/linkedin/i, () => candidate.linkedin],
  [/github/i, () => candidate.github],
  [/\b(website|portfolio|personal site|url)\b/i, () => candidate.website],
  [
    /how did you (hear|find|learn)/i,
    ({ job }) => (job.source === "linkedin" ? "LinkedIn" : "Indeed"),
  ],

  // Money — current salary is deliberately left to you.
  [
    /current\s+(salary|ctc|compensation|package)/i,
    () => (candidate.currentSalary ? String(candidate.currentSalary) : null),
  ],
  [
    /(expected|desired|expectation|asking|target).{0,30}(salary|compensation|pay|package|ctc|remuneration)|(salary|compensation).{0,20}(expect|requirement)/i,
    ({ job }, label) =>
      String(
        /annual|year|per annum|yearly|\bctc\b|\bpa\b/i.test(label)
          ? job.expectedSalary * 12
          : job.expectedSalary,
      ),
  ],

  // Availability
  [
    /notice\s*period/i,
    ({ kind }, label) =>
      kind === "number" || /days/i.test(label)
        ? String(candidate.noticePeriodDays)
        : candidate.noticePeriod,
  ],
  [
    /(when|how soon) can you (start|join)|earliest (start|joining) date|availability to (start|join)/i,
    () => `After a ${candidate.noticePeriod} notice period`,
  ],
  [/(start|join) immediately|immediate(ly)? (available|joiner)/i, () => NO],

  // Eligibility
  [/sponsor/i, () => yn(candidate.needsSponsorship)],
  [
    /(authori[sz]ed|eligible|legally|right|permit(ted)?)\b.{0,40}\bwork|work (permit|visa)|valid (uae )?(residence )?visa|residence visa/i,
    () => yn(candidate.authorizedToWorkInUae),
  ],
  [/relocat/i, () => yn(candidate.willingToRelocate)],
  [
    /commut|on[\s-]?site|in[\s-]office|hybrid|reside|currently (based|living|located)|based in (the )?(uae|dubai|abu dhabi)|located in/i,
    () => YES,
  ],
  [/driv(ing|er'?s?) licen[cs]e/i, () => yn(candidate.hasDrivingLicense)],
  [/nationality|citizenship/i, () => candidate.nationality],
  // After the yes/no eligibility rules so "commute to this location?" isn't answered with a city.
  [
    /\b(city|location|address|where are you (based|located))\b/i,
    () => candidate.location,
  ],
  [/background (check|verification)|drug (test|screen)/i, () => YES],
  [/currently employed|working currently|are you employed/i, () => YES],
  [/(previously|ever) (worked|been employed|applied)/i, () => NO],

  // Education & languages
  [
    /bachelor|degree|graduat/i,
    (_ctx, label) => (/master|phd|doctor/i.test(label) ? NO : YES),
  ],
  [
    /english/i,
    ({ kind }) =>
      kind === "radio" || kind === "select" ? "Professional" : YES,
  ],
  [
    /arabic/i,
    ({ kind }) => (kind === "radio" || kind === "select" ? "Native" : YES),
  ],

  // Experience
  [
    /how many years|years of (work )?experience|years experience|experience.{0,20}\(years\)/i,
    (_ctx, label) => {
      const y = yearsFor(label);
      return y === null ? null : String(y);
    },
  ],
  [
    /(do|have) you (have )?(any )?(experience|worked|familiar|proficien|knowledge)|are you (familiar|proficient|experienced|skilled)/i,
    (_ctx, label) => {
      const matched = matchKeywords(label);
      if (!matched.length) return null;
      return matched.every((k) => k.has) ? YES : NO;
    },
  ],

  // Consents and diversity questions
  [
    /(agree|consent|acknowledge|privacy|terms|certify|confirm that)/i,
    () => YES,
  ],
  [
    /gender|ethnic|race|disabilit|veteran|pronoun|sexual orientation/i,
    () => "Prefer not to say",
  ],

  // Free text
  [
    /cover\s*letter|message to (the )?(hiring|recruiter)|why (are you|do you want|would you)|additional information|tell us about yourself|introduce yourself/i,
    ({ job, kind }) =>
      kind === "textarea" || kind === "text" ? coverNote(job) : null,
  ],
  [/headline|summary/i, ({ job }) => job.tailoring?.summary ?? null],
  [/(are you|would you be) (comfortable|willing|able|open|happy)/i, () => YES],
];

export function answerFor(label: string, kind: FieldKind, job: Job) {
  for (const [pattern, answer] of rules) {
    if (pattern.test(label)) return answer({ job, kind }, label);
  }
  return null;
}

/**
 * Picks the option that best fits an answer: exact → contains → numeric
 * ranges like "3-5 years" → yes/no synonyms → "prefer not" variants.
 */
export function chooseOption(answer: string, options: string[]) {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const a = norm(answer);
  const opts = options
    .map((o, i) => ({ o: norm(o), i }))
    .filter((x) => x.o && !/^select( an)? option$/.test(x.o));

  const exact = opts.find((x) => x.o === a);
  if (exact) return exact.i;

  const n = Number(answer);
  if (Number.isFinite(n) && answer.trim() !== "") {
    for (const { o, i } of opts) {
      const range = o.match(/(\d+)\s*(?:-|–|to)\s*(\d+)/);
      if (range && n >= Number(range[1]) && n <= Number(range[2])) return i;
      const plus = o.match(/(\d+)\s*\+|more than (\d+)|over (\d+)/);
      if (plus && n >= Number(plus[1] ?? plus[2] ?? plus[3])) return i;
      const less = o.match(/less than (\d+)|under (\d+)|< ?(\d+)/);
      if (less && n < Number(less[1] ?? less[2] ?? less[3])) return i;
    }
  }

  const contains = opts.find(
    (x) => x.o.includes(a) || (a.length > 3 && a.includes(x.o)),
  );
  if (contains) return contains.i;

  const synonyms: Record<string, RegExp> = {
    yes: /^(yes|y|true|i do|i am|i have|i will|agree)/,
    no: /^(no|n|false|i do not|i don't|i am not)/,
    professional:
      /fluent|full professional|advanced|proficient|business|professional/,
    native: /native|bilingual|mother tongue|fluent/,
    "prefer not to say": /prefer not|decline|don't wish|do not wish|rather not/,
  };
  const syn = synonyms[a];
  if (syn) return opts.find((x) => syn.test(x.o))?.i ?? -1;
  return -1;
}
