import React from "react";
import Image from "next/image";
import Link from "next/link";

const Project = (props) => {
  const { backgroundImg, title, projectUrl } = props;
  return (
    <div className="col-span-3 md:col-span-1 relative flex items-center justify-center w-full shadow-xl shadow-gray-400 rounded-md p-4 group hover:bg-gradient-to-r from-[#ff1616] to-[#ff7c7c] overflow-hidden max-h-[300px]">
      <Image
        className="rounded-xl group-hover:opacity-10"
        src={backgroundImg}
        objectFit="cover"
        quality={20}
        alt="/"
      />
      <div className="hidden group-hover:block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl text-white tracking-wider text-center">
          {title}
        </h3>
        <p className="pb-4 pt-2 text-white text-center">React JS</p>
        <Link href={"/projects/" + title}>
          <p className="text-center py-1 px-3 rounded-lg bg-white text-gray-700 font-bold text-lg cursor-pointer hover:scale-110 duration-500">
            More Info
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Project;
