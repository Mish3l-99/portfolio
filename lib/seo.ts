import type { Metadata } from "next";

import type { Project } from "@/lib/projects";
import { site, socials } from "@/lib/site";
import { allSkills } from "@/lib/skills";

/** Shared Open Graph fields — Next replaces (not merges) `openGraph` per page. */
export const openGraphBase = {
  siteName: site.name,
  locale: "en_US",
  type: "website",
} satisfies Metadata["openGraph"];

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: site.name,
  givenName: site.firstName,
  familyName: site.lastName,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: socials
    .filter(({ label }) => label === "LinkedIn" || label === "GitHub")
    .map(({ href }) => href),
  knowsAbout: allSkills.map(({ name }) => name),
};

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en",
  author: { "@id": personId },
};

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      website,
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profile`,
        url: site.url,
        name: site.title,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  const url = `${site.url}/projects/${project.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        name: project.title,
        headline: `${project.title} — ${project.summary}`,
        description: project.description,
        url,
        image: `${site.url}${project.image}`,
        keywords: project.stack.join(", "),
        sameAs: project.demo,
        author: { "@id": personId },
        creator: { "@id": personId },
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${site.url}/#work`,
          },
          { "@type": "ListItem", position: 3, name: project.title, item: url },
        ],
      },
    ],
  };
}
