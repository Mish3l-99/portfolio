"use client";

import Image from "next/image";
import { BsArrowReturnRight } from "react-icons/bs";
import { MdOutlineDoubleArrow } from "react-icons/md";

import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="grid grid-cols-3 gap-4 md:gap-12">
          <div className="col-span-3 md:col-span-2">
            <h3 className="text-meshaal uppercase">About</h3>
            <div className="flex space-x-2">
              <span className="text-[25px] md:text-[30px]">
                <BsArrowReturnRight />
              </span>
              <h1 className="mb-4">Who I am</h1>
            </div>
            <p className="text-lg my-4 flex space-x-2 items-center">
              <MdOutlineDoubleArrow />
              <span>Not your typical developer</span>
            </p>
            <motion.div>
              <p className="text-lg my-4">
                My journey into software development started out of pure
                curiosity—experimenting with small changes to a website and
                quickly realizing how much could be built from just a few lines
                of code. What began with simple HTML and CSS edits soon evolved
                into a deeper interest in building interactive and meaningful
                digital experiences.
              </p>
              <p className="text-lg">
                As I progressed, I moved into JavaScript and backend
                development, eventually working with technologies like React,
                Next.js, Node.js, and Laravel. I gained hands-on experience
                through freelancing, delivering 15+ projects for clients across
                different industries, which exposed me to real-world challenges
                beyond just writing code—performance, scalability, and
                reliability.
              </p>
              <p className="text-lg">
                Over time, I transitioned into building and maintaining larger
                production systems, including redesigning legacy platforms,
                developing scalable architectures, and implementing real-time
                features such as messaging and notifications. I’ve worked across
                full-stack environments, handling everything from frontend
                interfaces to backend APIs and deployment.
              </p>
              <p className="text-lg">
                Today, I work as a full-time developer while continuing to grow
                through side projects and continuous learning. I actively
                leverage modern AI tools to enhance my development workflow,
                improve code quality, and solve complex problems more
                efficiently.
              </p>
              <p className="tmt-2 ext-lg">
                For me, development is not just about building features—it’s
                about building systems that last, perform, and deliver real
                value.
              </p>
            </motion.div>
          </div>
          <div className="col-span-3 md:col-span-1 ">
            <div className="h-full w-full p-2 rounded bg-white shadow-lg shadow-gray-400">
              <div className="image_wrapper">
                <Image
                  alt="/"
                  src="/about.jpg"
                  layout="fill"
                  objectFit="cover"
                  className="object-left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
