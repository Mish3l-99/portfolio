import React, { useEffect, useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";

import Project from "./Project";

import sociaImg from "../public/assets/projects/socia.png";
import travelImg from "../public/assets/projects/travel.png";
import aptiveImg from "../public/assets/projects/aptive.png";
import defiImg from "../public/assets/projects/defi.png";
import dataImg from "../public/assets/projects/data.png";
import brandImg from "../public/assets/projects/brand.png";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase";

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

const Projects = () => {
  const [projects, setProjects] = useState();

  useEffect(() => {
    const projectsQ = query(collection(db, "projects"), limit(6));
    getDocs(projectsQ).then((data) => {
      setProjects(data.docs.map((doc) => ({ id: doc.id })));
    });
  }, []);

  if (!projects) {
    return <p>Loading...</p>;
  }

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
          // viewport={{ once: true }}
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
              key={i}
              className=""
            >
              <Project id={p.id} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
