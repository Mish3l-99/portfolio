import Head from "next/head";
import About from "../components/About";
import Contact from "../components/Contact";
import Main from "../components/Main";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Meshaal | Full-Stack Developer</title>
        <meta
          name="description"
          content="This is Meshaal Noureldien's Portfolio Website"
        />

        <link rel="icon" href="/assets/logo/favi.png" />
      </Head>

      <main className="">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <Navbar />
          <Main />
          <About />
          <Skills />
          <Projects />
          <Contact />
          <Footer />
        </motion.div>
      </main>
    </div>
  );
}
