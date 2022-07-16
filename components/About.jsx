import React from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { MdOutlineDoubleArrow } from "react-icons/md";
import Image from "next/image";

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
              <span>I am not your normal developer</span>
            </p>
            <p className="text-lg my-4">
              I have been building software since high school and always had a
              knack for technology and working with computers. In 2019 I started
              working with HTML & CSS to make some minor edits on a small
              bussiness website that I was operating. What I thought was just a
              few small edits turned into a passion and a career.
            </p>
            <p className="text-lg">
              Fascinated with how intricate programming can be I was quickly
              drawn to learn more. I started learning javascript and was even
              more enthused with making websites interactive, I mastered
              javascript, and php for the back-end. I then started freelancing
              and made many projects for clients online, and to this point I am
              still freelancing and learning with React JS, Firebase and Next JS
              being the Latest Technologies that I use.
            </p>
          </div>
          <div className="col-span-3 md:col-span-1">
            <div className="h-full w-full p-2 rounded bg-white shadow-lg shadow-gray-400">
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
