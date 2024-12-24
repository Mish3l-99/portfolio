import React from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { MdOutlineDoubleArrow } from "react-icons/md";
import Image from "next/image";

import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="grid grid-cols-3 gap-4">
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
              <span>I am not your typical developer</span>
            </p>
            <motion.div className="">
              <p className="text-lg my-4">
                My journey with software development began in high school,
                fueled by a natural curiosity for technology and working with
                computers. In 2019, I started tinkering with HTML and CSS to
                make minor edits to a small business website I was managing.
                What began as a simple task quickly evolved into a deep passion
                and a fulfilling career.
              </p>
              <p className="text-lg">
                Captivated by the complexity and creativity of programming, I
                dove deeper into the world of code. I started learning
                JavaScript and fell in love with the ability to create
                interactive websites. Soon after, I expanded my skills to
                include PHP for backend development. Eager to put my skills to
                work, I ventured into freelancing, building a diverse range of
                projects for clients around the globe. Along the way, I
                continuously honed my expertise, exploring modern technologies
                like React.js, Firebase, Next.js, Laravel, and Strapi. These
                tools have enabled me to craft dynamic, responsive applications
                and develop robust APIs that drive efficient and user-friendly
                solutions.
              </p>
              <p className="mt-2 text-lg">
                Today, I am both a full-time employee and a freelancer,
                leveraging my skills to deliver exceptional solutions while
                continually learning and pushing the boundaries of what I can
                create. For me, software development is not just a career—it is
                a lifelong passion.
              </p>
            </motion.div>
          </div>
          <div className="col-span-3 md:col-span-1 ">
            <div className="shrink-0 h-full w-full p-2 rounded bg-white shadow-lg shadow-gray-400">
              <div className="image_wrapper">
                <Image
                  alt="/"
                  src="/about.jpg"
                  layout="fill"
                  objectFit="cover"
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
