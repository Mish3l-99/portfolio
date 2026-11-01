import { candidate, education } from "./profile";
import type { TailoredResume } from "./tailor";

const esc = (s: string) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

const strip = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Single-column, ATS-friendly A4 resume. Real text, no tables or images, so parsers read it cleanly. */
export function resumeHtml(resume: TailoredResume) {
  const contacts = [
    candidate.phone,
    candidate.email,
    candidate.location,
    strip(candidate.website),
    strip(candidate.linkedin),
  ];

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${esc(candidate.name)} — Resume</title>
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #18181b; font-size: 9.3pt; line-height: 1.38; }
  header { border-bottom: 2px solid #18181b; padding-bottom: 8px; margin-bottom: 10px; }
  h1 { font-size: 21pt; letter-spacing: 0.5px; font-weight: 700; }
  .headline { font-size: 11pt; color: #b91c1c; font-weight: 600; margin-top: 2px; }
  .contacts { margin-top: 5px; color: #3f3f46; font-size: 8.4pt; }
  .contacts span + span::before { content: "  |  "; color: #a1a1aa; white-space: pre; }
  h2 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: 1.4px; color: #18181b; border-bottom: 1px solid #e4e4e7; padding-bottom: 2px; margin: 10px 0 5px; }
  .skills p { margin-bottom: 2px; }
  .skills b { display: inline-block; min-width: 108px; }
  .role { margin-bottom: 6px; break-inside: avoid; }
  .role-head { display: flex; justify-content: space-between; gap: 12px; }
  .role-head .what { font-weight: 700; }
  .role-head .what i { font-weight: 400; font-style: normal; color: #52525b; }
  .role-head .when { color: #52525b; white-space: nowrap; font-size: 8.8pt; }
  ul { margin: 3px 0 0 14px; }
  li { margin-bottom: 1.5px; }
  .edu { display: flex; justify-content: space-between; }
</style></head>
<body>
  <header>
    <h1>${esc(candidate.name.toUpperCase())}</h1>
    <p class="headline">${esc(resume.headline)}</p>
    <p class="contacts">${contacts.map((c) => `<span>${esc(c)}</span>`).join("")}</p>
  </header>

  <h2>Summary</h2>
  <p>${esc(resume.summary)}</p>

  <h2>Skills</h2>
  <div class="skills">
    ${resume.skills.map((g) => `<p><b>${esc(g.title)}:</b> ${esc(g.skills.join(", "))}</p>`).join("\n    ")}
  </div>

  <h2>Experience</h2>
  ${resume.roles
    .map(
      (r) => `<div class="role">
    <div class="role-head">
      <p class="what">${esc(r.title)} <i>— ${esc(r.company)}, ${esc(r.place)}</i></p>
      <p class="when">${esc(r.start)} – ${esc(r.end)}</p>
    </div>
    <ul>${r.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  </div>`,
    )
    .join("\n  ")}

  <h2>Education</h2>
  <div class="edu">
    <p><b>${esc(education.degree)}</b> — ${esc(education.school)}</p>
    <p class="when">${esc(education.start)} – ${esc(education.end)}</p>
  </div>

  <h2>Languages</h2>
  <p>${Object.entries(candidate.languages)
    .map(([lang, level]) => `${esc(lang)} (${esc(level)})`)
    .join(" · ")}</p>
</body></html>`;
}
