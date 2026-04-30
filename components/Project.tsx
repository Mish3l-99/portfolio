"use client";

import Image from "next/image";
import Link from "next/link";
import { ProjectType } from "./Projects";

interface Props {
  project: ProjectType;
}

const Project = ({ project }: Props) => {
  return (
    <div className="col-span-3 md:col-span-1 relative h-75 w-full shadow-xl shadow-gray-400 rounded-md overflow-hidden group">
      {/* Image */}
      <Image
        className="object-cover transition-opacity duration-500 object-top-left group-hover:opacity-20"
        src={project.img!}
        fill
        quality={20}
        alt={project.title!}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-meshaal to-[#ff7c7c] opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <h3 className="text-2xl text-white tracking-wider">{project.title}</h3>

        <p className="pb-4 pt-2 text-white">{project.skills?.[0]}</p>

        <Link href={`/projects/${project.id}`}>
          <p className="py-1 px-3 rounded-lg bg-white text-gray-700 font-bold text-lg cursor-pointer hover:scale-110 transition-transform duration-300">
            More Info
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Project;
