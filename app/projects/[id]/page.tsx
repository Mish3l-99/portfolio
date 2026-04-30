"use client";

import Image from "next/image";

import { BsArrowReturnRight } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

import data from "@/data.json";
import { ProjectType } from "@/components/Projects";
import { useParams } from "next/navigation";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const projects: ProjectType[] = data.projects;

  const project = projects.find((p) => p.id === id);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <div className="w-screen h-[220px] md:h-[260px] relative bg-black">
        <Image
          src={project.img!}
          alt="/"
          layout="fill"
          objectFit="cover"
          className="opacity-10 object-center"
        />

        {/* the absolute layer */}
        <div className="absolute left-0 top-0 z-[10] w-full h-full flex flex-col justify-end py-12 text-gray-200">
          <div>
            <div className="container">
              <h2>{project.title}</h2>
              <p>{`${project.skills?.[0]}/${project.skills?.[1]}`}</p>
            </div>
          </div>
        </div>
      </div>

      {/* under image grid */}
      <div className="container mt-12 pb-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-meshaal uppercase">Project</h3>
            <div className="flex space-x-2">
              <span className="text-[25px] md:text-[30px]">
                <BsArrowReturnRight />
              </span>
              <h1 className="mb-4">Overview</h1>
            </div>
            <p className="my-3">{project.des}</p>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-1 rounded-md">
                <a target="_blank" rel="noreferrer" href={project.demo}>
                  View Demo
                </a>
              </button>
              <button className="px-4 py-1 rounded-md">
                <a target="_blank" rel="noreferrer" href={project.code}>
                  Code
                </a>
              </button>
            </div>
            <span
              className="my-2 cursor-pointer underline block hover:text-meshaal"
              onClick={() => history.back()}
            >
              back
            </span>
          </div>

          {/* technologies col */}
          <div className="md:col-span-1 p-2 shadow-md shadow-gray-400 rounded-md">
            <div className="text-center">
              <h3 className="text-lg md:text-2xl">Technologies</h3>
            </div>
            <div className="my-2 p-4">
              {project.skills?.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 my-1 md:text-lg"
                >
                  <IoMdCheckmarkCircleOutline className="text-meshaal" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
