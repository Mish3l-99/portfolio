import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "./auth";

/**
 * Server actions can be invoked from any route (including /jobs/login, which the
 * proxy lets through), so every action and route handler re-checks the session.
 */
export async function requireSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) throw new Error("Unauthorized");
}
