import { site, socials } from "@/lib/site";

/**
 * Structured copy of public/MN.pdf. The tailoring engine only reorders,
 * selects and re-phrases from what's here, so it never invents experience.
 * Tags reference keyword names in ./keywords.ts.
 */

export type Bullet = { text: string; tags: string[] };

export type Role = {
  company: string;
  place: string;
  title: string;
  /** Alternate titles that are still honest for this role, picked per job focus. */
  titles?: Partial<Record<"frontend" | "fullstack" | "backend", string>>;
  start: string;
  end: string;
  bullets: Bullet[];
  /** How many bullets survive on a tailored resume (most relevant first). */
  keep: number;
};

const linkedin = socials.find((s) => s.label === "LinkedIn")?.href ?? "";
const github = socials.find((s) => s.label === "GitHub")?.href ?? "";

export const candidate = {
  firstName: site.firstName,
  lastName: site.lastName,
  name: site.name,
  email: site.email,
  phone: "+971 504165096",
  phoneLocal: "504165096",
  phoneCountry: "United Arab Emirates (+971)",
  city: "Dubai",
  country: "United Arab Emirates",
  location: "Dubai, United Arab Emirates",
  website: site.url,
  linkedin,
  github,

  // ── Screening-question answers. REVIEW these — they're submitted on your behalf. ──
  /** Professional experience, counted from freelance start (June 2020). */
  totalYears: yearsSince("2020-06"),
  authorizedToWorkInUae: true,
  needsSponsorship: false,
  willingToRelocate: true,
  noticePeriod: "1 month",
  noticePeriodDays: 30,
  /** Left blank on purpose: forms asking for it are handed to you. */
  currentSalary: null as number | null,
  hasDrivingLicense: null as boolean | null,
  nationality: null as string | null,
  degree: "Bachelor's Degree",
  degreeField: "Electronics & Instrumentation Engineering",
  university: "Anna University",
  graduationYear: 2022,
  languages: { Arabic: "Native", English: "Professional" },
};

/** Years per skill, derived from the resume timeline. Used for "how many years of X" questions. */
export const skillYears: Record<string, number> = {
  JavaScript: yearsSince("2020-06"),
  React: yearsSince("2020-06"),
  "Next.js": yearsSince("2020-06"),
  "Tailwind CSS": yearsSince("2020-06"),
  HTML: yearsSince("2020-06"),
  CSS: yearsSince("2020-06"),
  Git: yearsSince("2020-06"),
  "REST APIs": yearsSince("2020-06"),
  Firebase: yearsSince("2020-06"),
  "Responsive Design": yearsSince("2020-06"),
  TypeScript: yearsSince("2023-07"),
  "Node.js": yearsSince("2023-07"),
  Express: yearsSince("2023-07"),
  MongoDB: yearsSince("2023-07"),
  WebSockets: yearsSince("2023-07"),
  "Full Stack": yearsSince("2023-07"),
  PHP: yearsSince("2023-07"),
  Laravel: yearsSince("2023-07"),
  MySQL: yearsSince("2023-07"),
  Linux: yearsSince("2023-07"),
  Docker: yearsSince("2024-04"),
  SEO: yearsSince("2024-04"),
  "E-commerce": yearsSince("2024-04"),
  "Payment Gateways": yearsSince("2024-04"),
  Caching: yearsSince("2024-04"),
  Redux: yearsSince("2025-04"),
  "RTK Query": yearsSince("2025-04"),
  Zustand: yearsSince("2024-04"),
  MUI: yearsSince("2025-04"),
  "Ant Design": yearsSince("2025-04"),
  Formik: yearsSince("2025-04"),
  "Framer Motion": yearsSince("2023-07"),
  "Data Visualization": yearsSince("2025-04"),
  Authentication: yearsSince("2023-07"),
  IndexedDB: yearsSince("2025-04"),
  "Admin Dashboards": yearsSince("2024-04"),
  "UI/UX": yearsSince("2020-06"),
  Performance: yearsSince("2024-04"),
  "AI Tools": 2,
  Agile: yearsSince("2024-04"),
};

export const roles: Role[] = [
  {
    company: "Evolvex Technology",
    place: "Dubai",
    title: "Senior Frontend Developer",
    titles: { fullstack: "Senior Frontend Developer" },
    start: "Apr 2025",
    end: "Present",
    keep: 6,
    bullets: [
      {
        text: "Developed a complex admin dashboard with advanced multi-step forms, deep backend integrations and internal business workflows.",
        tags: ["Admin Dashboards", "React", "REST APIs", "Formik"],
      },
      {
        text: "Implemented secure authentication including Passkeys (WebAuthn) and authenticator-app 2FA for stronger login security.",
        tags: ["Authentication", "Security"],
      },
      {
        text: "Built offline-first form draft persistence with IndexedDB so users can save and resume large form inputs seamlessly.",
        tags: ["IndexedDB", "Performance", "UI/UX"],
      },
      {
        text: "Developed and optimized advanced search and filtering for navigating large-scale dashboard datasets efficiently.",
        tags: ["Performance", "Admin Dashboards", "React"],
      },
      {
        text: "Designed analytics and reporting interfaces with dynamic, data-heavy charts and interactive visualizations.",
        tags: ["Data Visualization", "Admin Dashboards"],
      },
      {
        text: "Managed complex state, data fetching and validation with React, Redux, RTK Query, Formik and Yup.",
        tags: ["React", "Redux", "RTK Query", "Formik", "TypeScript"],
      },
      {
        text: "Contributed to a consumer-facing web platform with pixel-perfect, fully responsive UI and high-quality UX.",
        tags: ["UI/UX", "Responsive Design", "CSS"],
      },
      {
        text: "Implemented rich interactions and animations using MUI, Ant Design, Swiper, Keen Slider and Framer Motion.",
        tags: ["MUI", "Ant Design", "Framer Motion", "UI/UX"],
      },
      {
        text: "Collaborated closely with backend engineers, designers and QA to ship features efficiently and keep release quality high.",
        tags: ["Agile", "Collaboration"],
      },
    ],
  },
  {
    company: "ROMA Opticals",
    place: "Dubai",
    title: "Full Stack Web Developer",
    titles: { backend: "Full Stack Web Developer (Backend-focused)" },
    start: "Apr 2024",
    end: "Mar 2025",
    keep: 4,
    bullets: [
      {
        text: "Rebuilt a legacy Laravel e-commerce platform into a modern, scalable and SEO-optimized architecture, improving performance and maintainability.",
        tags: ["Laravel", "PHP", "E-commerce", "SEO", "Performance"],
      },
      {
        text: "Introduced a dedicated Next.js frontend while maintaining backend APIs serving the website, mobile app and admin dashboard.",
        tags: ["Next.js", "REST APIs", "Laravel", "Full Stack"],
      },
      {
        text: "Kept the platform stable through high-traffic seasons with performance tuning, caching strategies and load distribution across servers.",
        tags: ["Performance", "Caching", "Linux", "Scalability"],
      },
      {
        text: "Integrated and stabilized payment gateways, SMS/OTP providers and delivery/logistics APIs to automate core operations.",
        tags: ["Payment Gateways", "REST APIs", "E-commerce"],
      },
    ],
  },
  {
    company: "Sahmtalk",
    place: "Remote",
    title: "Full Stack Web Developer",
    start: "Jul 2023",
    end: "Mar 2024",
    keep: 3,
    bullets: [
      {
        text: "Built a full-stack social platform for stock-market discussion in the Arab world, with profiles, posts and social interactions.",
        tags: ["Full Stack", "React", "Next.js", "Node.js"],
      },
      {
        text: "Developed the complete web application and the backend API shared by the web platform and mobile app.",
        tags: ["Node.js", "Express", "REST APIs", "MongoDB", "Full Stack"],
      },
      {
        text: "Shipped real-time features including socket-based messaging and live video streaming.",
        tags: ["WebSockets", "Node.js", "Real-time"],
      },
    ],
  },
  {
    company: "Freelance",
    place: "Remote",
    title: "Web Developer",
    start: "Jun 2020",
    end: "Jun 2023",
    keep: 3,
    bullets: [
      {
        text: "Delivered 17+ web projects for clients across various industries and regions worldwide.",
        tags: ["Collaboration"],
      },
      {
        text: "Built dynamic, responsive web applications with React, Next.js and Tailwind CSS.",
        tags: ["React", "Next.js", "Tailwind CSS", "Responsive Design"],
      },
      {
        text: "Used Firebase for backend services and authentication, and integrated RESTful and third-party APIs.",
        tags: ["Firebase", "Authentication", "REST APIs"],
      },
      {
        text: "Handled server management and hosting for real-world deployments, with Git/GitHub workflows.",
        tags: ["Linux", "Git"],
      },
    ],
  },
];

export const skillGroups: { title: string; skills: string[] }[] = [
  {
    title: "Frontend",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Redux",
      "RTK Query",
      "Zustand",
      "Tailwind CSS",
      "MUI",
      "Ant Design",
      "Framer Motion",
      "Formik",
      "HTML",
      "CSS",
    ],
  },
  {
    title: "Backend",
    skills: [
      "Node.js",
      "Express",
      "PHP",
      "Laravel",
      "REST APIs",
      "WebSockets",
      "Authentication",
      "Firebase",
    ],
  },
  { title: "Databases", skills: ["MySQL", "MongoDB", "IndexedDB"] },
  {
    title: "DevOps & Tools",
    skills: ["Docker", "Git", "Linux", "SEO", "AI Tools"],
  },
];

export const education = {
  school: "Anna University, Chennai, India",
  degree: "B.Eng, Electronics & Instrumentation Engineering",
  start: "Aug 2018",
  end: "Apr 2022",
};

function yearsSince(yyyyMm: string) {
  const months =
    (Date.now() - new Date(`${yyyyMm}-01`).getTime()) / (30.44 * 864e5);
  return Math.max(1, Math.floor(months / 12));
}
