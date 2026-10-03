import type { MetadataRoute } from "next";

import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/opengraph-image`],
    },
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.id}`,
      changeFrequency: "yearly" as const,
      priority: project.featured ? 0.8 : 0.6,
      images: [`${site.url}${project.image}`],
    })),
  ];
}
