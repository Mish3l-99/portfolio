import type { Page } from "playwright-core";

import { pace } from "../browser";
import { assertNoWall } from "../sources/common";
import type { Job } from "../types";
import { fillStep } from "./form";
import {
  isVisible,
  visibleErrors,
  type ApplyOptions,
  type ApplyOutcome,
} from "./outcome";

/** Indeed Apply ("Easily apply"), in your signed-in profile. */

const MAX_STEPS = 15;

async function run(
  app: Page,
  job: Job,
  resumeFile: string,
  dryRun: boolean,
): Promise<ApplyOutcome> {
  await app.waitForLoadState("domcontentloaded");
  let lastStep = "";
  for (let step = 0; step < MAX_STEPS; step++) {
    await pace(1500, 2500);
    await assertNoWall(app, "indeed");

    if (
      await isVisible(
        app.getByText(
          /your application has been submitted|application submitted/i,
        ),
      )
    )
      return { status: "applied" };

    // Indeed pre-selects your stored resume; switch to uploading the tailored one.
    const uploadOption = app
      .locator(
        "[data-testid*='resume-upload' i], button:has-text('Upload a different file'), label:has-text('Upload a resume')",
      )
      .first();
    if (await isVisible(uploadOption))
      await uploadOption.click().catch(() => undefined);

    const form = app.locator("main, form, body").first();
    const unanswered = await fillStep(form, { job, resumeFile });
    if (unanswered.length)
      return {
        status: "needs_manual",
        reason: `Indeed asked ${unanswered.length} question(s) the bot can't answer truthfully`,
        unanswered,
      };

    const submit = app.getByRole("button", {
      name: /submit (your )?application/i,
    });
    if (await isVisible(submit)) {
      if (dryRun) return { status: "dry_run" };
      await submit.first().click();
      const sent = await app
        .getByText(/your application has been submitted|application submitted/i)
        .first()
        .waitFor({ timeout: 20_000 })
        .then(
          () => true,
          () => false,
        );
      return sent
        ? { status: "applied" }
        : {
            status: "needs_manual",
            reason:
              "Clicked Submit but Indeed didn't confirm — check “My jobs → Applied”",
          };
    }

    const next = app
      .getByRole("button", {
        name: /^(continue|next|review( your application)?)\b/i,
      })
      .first();
    if (!(await isVisible(next)))
      return {
        status: "needs_manual",
        reason: "Indeed Apply showed a step the bot doesn't recognise",
      };

    const before = await form.innerText().catch(() => "");
    await next.click();
    await pace(1500, 2500);
    const errors = await visibleErrors(form);
    const after = await form.innerText().catch(() => "");
    if (errors.length || (after === before && before === lastStep))
      return {
        status: "needs_manual",
        reason: "Indeed rejected an answer",
        unanswered: errors.length ? errors : ["Form did not advance"],
      };
    lastStep = after;
  }
  return {
    status: "needs_manual",
    reason: "Indeed Apply had more steps than expected",
  };
}

export async function applyIndeed(
  page: Page,
  job: Job,
  resumeFile: string,
  { dryRun }: ApplyOptions,
): Promise<ApplyOutcome> {
  await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await assertNoWall(page, "indeed");
  await pace(1500, 2500);

  if (
    await isVisible(page.getByText(/this job has expired|no longer available/i))
  )
    return { status: "closed", reason: "Posting expired" };
  if (
    await isVisible(
      page
        .locator("#indeedApplyButton, [data-testid='indeedApplyButton']")
        .filter({ hasText: /^applied/i }),
    )
  )
    return { status: "applied", note: "Already applied on Indeed" };

  const apply = page
    .locator(
      "#indeedApplyButton, [data-testid='indeedApplyButton'], button:has-text('Apply now')",
    )
    .first();
  if (!(await isVisible(apply))) {
    const href = await page
      .locator(
        "#applyButtonLinkContainer a, a:has-text('Apply on company site')",
      )
      .first()
      .getAttribute("href", { timeout: 2000 })
      .catch(() => null);
    return {
      status: "external",
      applyUrl: href
        ? new URL(href, page.url()).href
        : (job.applyUrl ?? job.url),
      reason: "Applies on the company's site",
    };
  }

  // Indeed Apply opens either in a new tab or in place.
  const [popup] = await Promise.all([
    page
      .context()
      .waitForEvent("page", { timeout: 8000 })
      .catch(() => null),
    apply.click(),
  ]);
  const app = popup ?? page;
  try {
    return await run(app, job, resumeFile, dryRun);
  } finally {
    if (popup) await popup.close().catch(() => undefined);
  }
}
