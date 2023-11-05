import React from "react";
import Image from "next/image";

import { BsArrowReturnRight } from "react-icons/bs";

import { motion } from "framer-motion";

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const transitionVar = { duration: 0.6, staggerChildren: 0.3 };

const singleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

const skills = [
  { name: "HTML", img: "html.png" },
  { name: "CSS", img: "css.png" },
  { name: "Tailwind CSS", img: "tailwind.png" },
  { name: "Javascript", img: "javascript.png" },
  { name: "Typescript", img: "ts.png" },
  { name: "React JS", img: "react.png" },
  { name: "Next JS", img: "next.png" },
  { name: "Firebase", img: "firebase.png" },
  { name: "PHP", img: "php.png" },
  { name: "MySQL", img: "mysql.png" },
  { name: "Git", img: "git.png" },
  { name: "Express js", img: "express.png" },
  { name: "Mongo DB", img: "mongo.png" },
  { name: "SEO", img: "seo.png" },
  { name: "Web Hosting", img: "hosting.avif" },
];

const Skills = () => {
  return (
    <section id="skills">
      <div className="container">
        <h3 className="text-meshaal uppercase">Skills</h3>
        <div className="flex space-x-2">
          <span className="text-[25px] md:text-[30px]">
            <BsArrowReturnRight />
          </span>
          <h1 className="mb-4">What I can do</h1>
        </div>

        {/* grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          // viewport={{ once: true }}
          variants={staggerVariants}
          transition={transitionVar}
          className="grid grid-cols-2 md:grid-cols-5 mt-8 gap-4 max-w-[900px] mx-auto"
        >
          {/* item */}
          {skills.map((item, i) => (
            <motion.div
              variants={singleVariants}
              transition={{ duration: 0.5 }}
              key={i}
              className="item"
            >
              <div className="flex justify-center items-center space-x-3">
                <div>
                  <Image
                    height={40}
                    width={50}
                    alt="/"
                    src={`/assets/skills/${item.img}`}
                    objectFit="contain"
                  />
                </div>
                <p className="">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
