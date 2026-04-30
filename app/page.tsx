"use client";

import { motion } from "framer-motion";
import About from "../components/About";
import Contact from "../components/Contact";
import Main from "../components/Main";
import Projects from "../components/Projects";
import Skills from "../components/Skills";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <Main />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </motion.div>
      </main>
    </div>
  );
}
