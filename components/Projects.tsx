"use client";

import { BsArrowReturnRight } from "react-icons/bs";

import Project from "./Project";

import { motion } from "framer-motion";
import RecentProject from "./RecentProject";

const staggerVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const transitionVar = { duration: 0.6, staggerChildren: 0.6 };

const projVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: -30 },
};

import data from "@/data.json";

export type ProjectType = {
  id: string;
  title?: string;
  img?: string;
  code: string;
  demo: string;
  des: string;
  skills?: string[];
};

const Projects = () => {
  const projects: ProjectType[] = data.projects;

  return (
    <section id="projects">
      <div className="container">
        <h3 className="text-meshaal uppercase">Projects</h3>
        <div className="flex space-x-2">
          <span className="text-[25px] md:text-[30px]">
            <BsArrowReturnRight />
          </span>
          <h1 className="mb-4">What I&#39;ve done</h1>
        </div>
        <RecentProject />

        {/* projects grid */}
        <h3 className="font-bold text-2xl mb-4">More Projects:</h3>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerVariants}
          transition={transitionVar}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* highlighted project */}
          {/* <div className="col-span-12">hi</div> */}

          {/* the rest */}
          {projects.map((p, i) => (
            <motion.div
              variants={projVariants}
              transition={{ duration: 0.5 }}
              key={p.id}
            >
              <Project project={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
