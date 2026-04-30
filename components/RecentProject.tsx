"use client";

import Image from "next/image";
import { BsCodeSlash } from "react-icons/bs";

import { FaRegEye } from "react-icons/fa";

const proj = {
  img: "/assets/projects/arrivo.png",
  link: "https://arrivo-eight.vercel.app",
  codeLink: "https://github.com/Mish3l-99/arrivo",
  title: "none",
};

const RecentProject = () => {
  return (
    <div className="mt-2 mb-12 md:mb-24">
      <div className="my-6 grid grid-cols-12 items-center gap-2">
        <div className="col-span-12 md:col-span-4">
          <h3 className="mb-2">
            Check out this recent project I built for a tourism agency:
          </h3>

          <p>
            A modern tourism website designed for an early-stage travel company
            to showcase trips, destinations, and services. The project is
            heavily focused on polished UI, smooth animations, and creating an
            engaging user experience.
          </p>

          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <a
              target="_blank"
              rel="noreferrer"
              href={proj.link}
              className="bg-meshaal w-fit text-white hover:bg-white hover:text-black duration-500 ease-in px-4 py-2 rounded-lg border shadow flex items-center gap-x-2"
            >
              View Webpage
              <FaRegEye />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={proj.codeLink}
              className="bg-white w-fit text-gray-800 hover:bg-white hover:shadow-lg duration-500 ease-in py-1 px-4 rounded-full border flex items-center gap-x-2"
            >
              Code
              <BsCodeSlash />
            </a>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 ">
          <div className="w-full h-[260px] relative">
            <Image
              src={proj.img}
              alt="arrivo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentProject;
