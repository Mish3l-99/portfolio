import { connection } from "next/server";

import Dashboard from "@/components/jobs/Dashboard";
import { isServerless, jobsConfig } from "@/lib/jobs/config";
import { dashboardData } from "@/lib/jobs/view";

export default async function JobsPage() {
  await connection();
  return (
    <Dashboard
      initial={await dashboardData()}
      settings={{
        minSalary: jobsConfig.minSalary,
        defaultSalary: jobsConfig.defaultSalary,
        searches: jobsConfig.searches,
        sources: jobsConfig.sources,
        aiEnabled: jobsConfig.ai.enabled,
        maxPerRun: jobsConfig.maxApplicationsPerRun,
        serverless: isServerless,
      }}
    />
  );
}
