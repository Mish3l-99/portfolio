import fs from "node:fs/promises";
import path from "node:path";

import { pdfBrowser } from "./browser";
import { jobsPaths } from "./config";
import { candidate } from "./profile";
import { resumeHtml } from "./resume-html";
import { getJob, updateJob } from "./store";
import { polishSummary, tailorResume } from "./tailor";
import type { Job } from "./types";

const safe = (id: string) => id.replace(/[^a-z0-9_-]/gi, "_");

/** One folder per job so the uploaded file keeps a clean, human filename. */
export const resumePath = (jobId: string) =>
  path.join(
    jobsPaths.resumes,
    safe(jobId),
    `${candidate.firstName}-${candidate.lastName}-Resume.pdf`,
  );

export async function resumeExists(jobId: string) {
  return fs.access(resumePath(jobId)).then(
    () => true,
    () => false,
  );
}

/** Tailors, renders and stores the PDF for a job. Returns its path. */
export async function generateResume(job: Job, { force = false } = {}) {
  const file = resumePath(job.id);
  if (!force && job.tailoring && (await resumeExists(job.id))) return file;

  const tailored = await polishSummary(tailorResume(job), job.title);
  const browser = await pdfBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(resumeHtml(tailored), { waitUntil: "load" });
    await fs.mkdir(path.dirname(file), { recursive: true });
    await page.pdf({ path: file, format: "A4", printBackground: true });
  } finally {
    await page.close();
  }

  const { headline, summary, matchedKeywords, focus, aiUsed, generatedAt } =
    tailored;
  await updateJob(job.id, {
    tailoring: {
      headline,
      summary,
      matchedKeywords,
      focus,
      aiUsed,
      generatedAt,
    },
  });
  return file;
}

export async function generateResumeById(
  id: string,
  opts?: { force?: boolean },
) {
  const job = await getJob(id);
  if (!job) throw new Error(`Unknown job ${id}`);
  return generateResume(job, opts);
}
