import fs from "node:fs/promises";
import path from "node:path";

import type { NextRequest } from "next/server";

import { generateResumeById } from "@/lib/jobs/resume";
import { requireSession } from "@/lib/jobs/session";

/** Serves (and lazily generates) the tailored resume for one posting. */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]/resume">,
) {
  try {
    await requireSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await ctx.params;
  try {
    const file = await generateResumeById(decodeURIComponent(id), {
      force: request.nextUrl.searchParams.has("regenerate"),
    });
    return new Response(new Uint8Array(await fs.readFile(file)), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${request.nextUrl.searchParams.has("download") ? "attachment" : "inline"}; filename="${path.basename(file)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 404 });
  }
}
