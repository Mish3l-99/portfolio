import { NextResponse, type NextRequest } from "next/server";

import {
  jobsAuthConfigured,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/jobs/auth";

/** Guards the private job-application tool. Everything else passes straight through. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Without credentials configured (e.g. on the public deployment) the tool doesn't exist.
  if (!jobsAuthConfigured())
    return new NextResponse("Not Found", { status: 404 });

  if (pathname === "/jobs/login") return NextResponse.next();
  if (await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value))
    return NextResponse.next();

  if (pathname.startsWith("/api/"))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const login = new URL("/jobs/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/jobs", "/jobs/:path*", "/api/jobs/:path*"],
};
