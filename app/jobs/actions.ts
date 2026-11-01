"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  checkCredentials,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_S,
} from "@/lib/jobs/auth";
import { generateResumeById } from "@/lib/jobs/resume";
import {
  openForLogin,
  requestStop,
  resetSignIn,
  runBlocker,
  startRun,
} from "@/lib/jobs/runner";
import type { Site } from "@/lib/jobs/connection";
import { requireSession } from "@/lib/jobs/session";
import { updateJob } from "@/lib/jobs/store";
import type { JobStatus, RunMode } from "@/lib/jobs/types";

export type LoginState = { error?: string; username?: string };

export async function login(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const username = String(form.get("username") ?? "");
  const ok = await checkCredentials(
    username,
    String(form.get("password") ?? ""),
  );
  if (!ok) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 1200));
    // React resets the form after an action; hand the username back so it survives.
    return { error: "Wrong username or password.", username };
  }
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
  const next = String(form.get("next") ?? "");
  redirect(next.startsWith("/jobs") ? next : "/jobs");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/jobs/login");
}

export async function runAction(mode: RunMode, dryRun: boolean) {
  await requireSession();
  const error = startRun({ mode, dryRun });
  return error ? { ok: false as const, error } : { ok: true as const };
}

export async function applyOneAction(id: string, dryRun: boolean) {
  await requireSession();
  const blocked = runBlocker();
  if (blocked) return { ok: false as const, error: blocked };
  await updateJob(id, { status: "new" });
  const error = startRun({ mode: "apply", dryRun, jobIds: [id] });
  return error ? { ok: false as const, error } : { ok: true as const };
}

export async function stopAction() {
  await requireSession();
  requestStop();
}

export async function connectAccountsAction(sites?: Site[]) {
  await requireSession();
  try {
    await openForLogin(sites);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: (error as Error).message };
  }
}

export async function resetSignInAction(site: Site) {
  await requireSession();
  if (site !== "linkedin" && site !== "indeed") throw new Error("Unknown site");
  try {
    await resetSignIn(site);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: (error as Error).message };
  }
}

const USER_STATUSES: JobStatus[] = [
  "new",
  "applied_manual",
  "dismissed",
  "skipped",
];

export async function setStatusAction(id: string, status: JobStatus) {
  await requireSession();
  if (!USER_STATUSES.includes(status)) throw new Error("Not allowed");
  await updateJob(id, {
    status,
    ...(status === "applied_manual"
      ? { appliedAt: new Date().toISOString() }
      : {}),
    ...(status === "new" ? { reason: "Queued by you" } : {}),
  });
}

export async function regenerateResumeAction(id: string) {
  await requireSession();
  await generateResumeById(id, { force: true });
}
