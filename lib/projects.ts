import data from "@/data.json";

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  demo: string;
  code: string;
  stack: string[];
  featured?: boolean;
};

export const projects: Project[] = data.projects;

export const featuredProject = projects.find((p) => p.featured);

export const otherProjects = projects.filter((p) => !p.featured);

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

/** The project after `id`, wrapping around to the first. */
export function getNextProject(id: string) {
  const index = projects.findIndex((p) => p.id === id);
  return projects[(index + 1) % projects.length];
}
