import type { IconType } from "react-icons";
import { FaWhatsapp } from "react-icons/fa";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export const site = {
  url: "https://meshaal.site",
  name: "Meshaal Noureldien",
  title: "Meshaal Noureldien — Full-Stack Developer",
  firstName: "Meshaal",
  lastName: "Noureldien",
  role: "Full-Stack Developer",
  email: "meshaal.noureldien@gmail.com",
  resume: "/MN.pdf",
  formAction: "https://getform.io/f/6b00cd38-3e80-4644-a68b-1e67dc7c9de7",
  description:
    "Meshaal Noureldien is a full-stack developer building fast, scalable web apps with React, Next.js, Node.js and Laravel. See projects, skills and get in touch.",
  keywords: [
    "Meshaal Noureldien",
    "Meshaal",
    "full-stack developer",
    "web developer",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "Laravel developer",
    "TypeScript",
    "freelance web developer",
    "portfolio",
  ],
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

export type Social = { label: string; href: string; icon: IconType };

export const socials: Social[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/meshaal-noureldien-204294208/",
    icon: FiLinkedin,
  },
  { label: "GitHub", href: "https://github.com/Mish3l-99", icon: FiGithub },
  { label: "WhatsApp", href: "https://wa.me/971504165096", icon: FaWhatsapp },
  { label: "Email", href: `mailto:${site.email}`, icon: FiMail },
];
