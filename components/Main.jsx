import React from "react";
import Typed from "react-typed";
import Link from "next/link";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";

const Main = () => {
  return (
    <div className="w-full h-screen text-center" id="main">
      <div className="container">
        <div className="h-full flex flex-col justify-center items-center ">
          <div className="max-w-4xl">
            <p className="tracking-widest uppercase">
              let&#39;s build something together
            </p>
            <h1 className="mt-1">
              Hi, I am <span className="text-meshaal my-2">Meshaal!</span>
            </h1>
            <div className="flex flex-col">
              <span className="text-blue-900 font-semibold">I am a </span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold pl-2 text-gray-800">
                Full Stack{" "}
                <Typed
                  className=""
                  strings={["Javascript Developer."]}
                  // strings={["Hi, I am Meshaal!&nbsp;&#x1f91d;"]}
                  // strings={["BTB.", "BTC.", "SASS."]}
                  typeSpeed={70}
                  backSpeed={70}
                  loop
                />
              </span>
            </div>
            <p className="p-2 my-4">
              I am a full-stack developer specializing in building (and
              desiging) Exeptional Digital Experiences. Currently I am focused
              on building modern responsive full-stack Web Applications using
              React and NextJS for the frontend and Node+Express for the backend
              apps.
            </p>
            <div className="social flex justify-between items-center w-full max-w-[220px] md:max-w-[350px] mx-auto mt-8">
              <div className="p-1 shadow-lg border border-gray-600 bg-white rounded">
                <a
                  href="https://www.linkedin.com/in/mishaal-noureldien-204294208/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg border border-gray-600 bg-white rounded">
                <a
                  href="https://github.com/Mish3l-99"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg border border-gray-600 bg-white rounded">
                <a
                  href="mailto: meshaal.noureldien@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdEmail size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg border border-gray-600 bg-white rounded">
                <a href="/Resume.pdf" download>
                  <BsPersonLinesFill size={25} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
