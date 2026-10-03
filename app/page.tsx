import About from "@/components/About";
import Contact from "@/components/Contact";
import Main from "@/components/Main";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Main />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
