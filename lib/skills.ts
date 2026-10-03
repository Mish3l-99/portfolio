import type { IconType } from "react-icons";
import {
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGit,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbSeo } from "react-icons/tb";

export type Skill = { name: string; icon: IconType; color: string };

export type SkillGroup = {
  title: string;
  blurb: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "Interfaces that feel fast, accessible and polished.",
    skills: [
      { name: "JavaScript", icon: SiJavascript, color: "#f7df1e" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178c6" },
      { name: "React", icon: SiReact, color: "#61dafb" },
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38bdf8" },
    ],
  },
  {
    title: "Backend",
    blurb: "APIs, real-time features and solid business logic.",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5fa04e" },
      { name: "Express", icon: SiExpress, color: "#ffffff" },
      { name: "PHP", icon: SiPhp, color: "#8892bf" },
      { name: "Laravel", icon: SiLaravel, color: "#ff2d20" },
      { name: "Firebase", icon: SiFirebase, color: "#ffca28" },
    ],
  },
  {
    title: "Data",
    blurb: "Schemas and queries built to scale.",
    skills: [
      { name: "MySQL", icon: SiMysql, color: "#4479a1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47a248" },
    ],
  },
  {
    title: "Ship & Scale",
    blurb: "Version control, servers, containers and being found.",
    skills: [
      { name: "Git", icon: SiGit, color: "#f05032" },
      { name: "Linux", icon: SiLinux, color: "#fcc624" },
      { name: "Docker", icon: SiDocker, color: "#2496ed" },
      { name: "SEO", icon: TbSeo, color: "#ededed" },
    ],
  },
];

export const allSkills = skillGroups.flatMap((group) => group.skills);
