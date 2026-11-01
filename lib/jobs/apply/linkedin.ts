import type { Locator, Page } from "playwright-core";

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

/** LinkedIn Easy Apply, in your signed-in profile. */

const MAX_STEPS = 15;

/** Closes the modal, saving the draft so your manual pass starts pre-filled. */
async function closeModal(page: Page, keepDraft: boolean) {
  await page
    .locator('button[aria-label="Dismiss"]')
    .first()
    .click({ timeout: 3000 })
    .catch(() => undefined);
  const choice = keepDraft
    ? page.locator(
        'button[data-control-name="save_application_btn"], button:has-text("Save")',
      )
    : page.locator(
        'button[data-control-name="discard_application_confirm_btn"], button:has-text("Discard")',
      );
  await choice
    .first()
    .click({ timeout: 3000 })
    .catch(() => undefined);
}

export async function applyLinkedIn(
  page: Page,
  job: Job,
  resumeFile: string,
  { dryRun }: ApplyOptions,
): Promise<ApplyOutcome> {
  await page.goto(`https://www.linkedin.com/jobs/view/${job.externalId}/`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  await assertNoWall(page, "linkedin");
  await pace(2000, 3500);

  if (await isVisible(page.getByText(/no longer accepting applications/i)))
    return { status: "closed", reason: "No longer accepting applications" };
  if (
    await isVisible(
      page
        .locator(
          ".jobs-s-apply__application-link, .artdeco-inline-feedback--success",
        )
        .filter({ hasText: /applied/i }),
    )
  )
    return { status: "applied", note: "Already applied on LinkedIn" };

  const applyButtons = page.locator(
    "button.jobs-apply-button, a.jobs-apply-button, button[aria-label*='Apply' i]",
  );
  const easy = applyButtons.filter({ hasText: /easy apply/i }).first();
  if (!(await isVisible(easy))) {
    return {
      status: "external",
      applyUrl: job.applyUrl ?? job.url,
      reason: "Applies on the company's site",
    };
  }

  await easy.click();
  const modal: Locator = page
    .locator(
      ".jobs-easy-apply-modal, [data-test-modal-id='easy-apply-modal'], div[role=dialog]",
    )
    .filter({ has: page.locator("button") })
    .first();
  await modal.waitFor({ timeout: 15_000 });

  let lastStep = "";
  for (let step = 0; step < MAX_STEPS; step++) {
    await pace(1200, 2200);
    await assertNoWall(page, "linkedin");

    const unanswered = await fillStep(modal, { job, resumeFile });
    if (unanswered.length) {
      await closeModal(page, true);
      return {
        status: "needs_manual",
        reason: `Easy Apply asked ${unanswered.length} question(s) the bot can't answer truthfully`,
        unanswered,
      };
    }

    const submit = modal.locator("button[aria-label*='Submit application' i]");
    if (await isVisible(submit)) {
      await modal
        .locator("input[type=checkbox][id*='follow' i]")
        .uncheck({ force: true, timeout: 2000 })
        .catch(() => undefined);
      if (dryRun) {
        await closeModal(page, true);
        return { status: "dry_run" };
      }
      await submit.first().click();
      const sent = await page
        .getByText(
          /application (was )?sent|your application was sent|application submitted/i,
        )
        .first()
        .waitFor({ timeout: 20_000 })
        .then(
          () => true,
          () => false,
        );
      await page
        .locator('button[aria-label="Dismiss"]')
        .first()
        .click({ timeout: 3000 })
        .catch(() => undefined);
      return sent
        ? { status: "applied" }
        : {
            status: "needs_manual",
            reason:
              "Clicked Submit but LinkedIn didn't confirm — check “My Jobs → Applied”",
          };
    }

    const next = modal
      .locator(
        "button[aria-label*='Continue to next step' i], button[aria-label*='Review your application' i], button:has-text('Next'), button:has-text('Review')",
      )
      .first();
    if (!(await isVisible(next))) {
      await closeModal(page, true);
      return {
        status: "needs_manual",
        reason: "Easy Apply showed a step the bot doesn't recognise",
      };
    }

    const before = await modal.innerText().catch(() => "");
    await next.click();
    await pace(1200, 2000);

    const errors = await visibleErrors(modal);
    const after = await modal.innerText().catch(() => "");
    if (errors.length || (after === before && before === lastStep)) {
      await closeModal(page, true);
      return {
        status: "needs_manual",
        reason: "Easy Apply rejected an answer",
        unanswered: errors.length ? errors : ["Form did not advance"],
      };
    }
    lastStep = after;
  }

  await closeModal(page, true);
  return {
    status: "needs_manual",
    reason: "Easy Apply had more steps than expected",
  };
}
