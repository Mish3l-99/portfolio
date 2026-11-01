import { requireSession } from "@/lib/jobs/session";
import { dashboardData } from "@/lib/jobs/view";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(await dashboardData(), {
    headers: { "Cache-Control": "no-store" },
  });
}
