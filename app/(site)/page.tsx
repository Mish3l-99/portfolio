import type { Metadata } from "next";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Main from "@/components/Main";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import JsonLd from "@/components/JsonLd";
import { homeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Main />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
