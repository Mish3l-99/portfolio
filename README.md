# Meshaal Noureldien — Portfolio

Personal portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and Motion, with an AI "twin" chat powered by OpenAI ChatKit.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Create `.env.local` for the AI chat:

```
OPENAI_API_KEY=...
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=...
```

## Structure

| Path                           | What lives there                                  |
| ------------------------------ | ------------------------------------------------- |
| `app/`                         | Routes: home, `projects/[id]`, 404                |
| `components/`                  | Page sections (`Main` hero, `About`, `Skills`, …) |
| `components/ui/`               | Shared building blocks (`Reveal`, `BrowserFrame`) |
| `components/chat/`             | AI twin button + drawer                           |
| `lib/site.ts`                  | Name, email, social links, nav                    |
| `lib/skills.ts`                | Skill groups and icons                            |
| `data.json`, `lib/projects.ts` | Project content and typed helpers                 |
| `app/jobs/`, `lib/jobs/`       | Private job-application tool (see below)          |

To add a project, append it to `data.json` and drop its screenshot in `public/assets/projects/`.

## Job-application tool (`/jobs`)

A private dashboard that finds UAE roles on LinkedIn and Indeed, tailors a resume
for each one, auto-applies through Easy Apply / Indeed Apply where it can, and
lists everything else under **Needs you** with a one-click Apply button.

It drives your own Chrome profile, so it runs **locally** (`pnpm dev`), not on Vercel.
Without `JOBS_USERNAME`/`JOBS_PASSWORD` set, `/jobs` returns 404.

```
JOBS_USERNAME=...
JOBS_PASSWORD=...
# optional
JOBS_MIN_SALARY=15000          # monthly AED floor, never asked below this
JOBS_DEFAULT_SALARY=18000      # asked when a posting shows no range
JOBS_KEYWORDS=React Developer,Full Stack Developer
JOBS_MAX_APPLY_PER_RUN=15
JOBS_AI=false                  # turn off the one small summary-polish call per job
JOBS_HEADLESS=true             # hide the Chrome window during runs
```

1. Open `/jobs`, sign in, click **Connect accounts** and log in to LinkedIn + Indeed in the Chrome window.
2. Do a **dry run** first: forms are filled up to Submit and nothing is sent.
3. Run for real from the dashboard, or on a schedule: `pnpm jobs` (`fetch`, `apply`, `--dry-run`).

| Path                        | What lives there                                         |
| --------------------------- | -------------------------------------------------------- |
| `lib/jobs/profile.ts`       | Structured resume + screening answers — **review these** |
| `lib/jobs/tailor.ts`        | Per-job resume tailoring                                 |
| `lib/jobs/apply/answers.ts` | Question → answer rules                                  |
| `lib/jobs/sources/`         | LinkedIn / Indeed search                                 |
| `lib/jobs/apply/`           | Easy Apply / Indeed Apply automation                     |
| `.jobs/` (gitignored)       | db, tailored PDFs, browser profile, failure screenshots  |

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint
- `pnpm jobs` — run the job tool from the terminal (cron-friendly)
