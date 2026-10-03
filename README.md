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

| Path                       | What lives there                                  |
| -------------------------- | ------------------------------------------------- |
| `app/`                     | Routes: home, `projects/[id]`, 404                |
| `components/`              | Page sections (`Main` hero, `About`, `Skills`, …) |
| `components/ui/`           | Shared building blocks (`Reveal`, `BrowserFrame`) |
| `components/chat/`         | AI twin button + drawer                           |
| `lib/site.ts`              | Name, email, social links, nav                    |
| `lib/skills.ts`            | Skill groups and icons                            |
| `data.json`, `lib/projects.ts` | Project content and typed helpers             |

To add a project, append it to `data.json` and drop its screenshot in `public/assets/projects/`.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run ESLint
