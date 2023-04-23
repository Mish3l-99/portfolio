import React from "react";
import Image from "next/image";

import { BsArrowReturnRight } from "react-icons/bs";

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
        <div className="grid grid-cols-2 md:grid-cols-5 mt-8 gap-4 max-w-[900px] mx-auto">
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/html.png"
                  objectFit="contain"
                />
              </div>
              <p className="">HTML</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/css.png"
                  objectFit="contain"
                />
              </div>
              <p className="">CSS</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/tailwind.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Tailwind CSS</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/javascript.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Javascript</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/ts.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Typescript</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={50}
                  width={50}
                  alt="/"
                  src="/assets/skills/native.png"
                  objectFit="contain"
                />
              </div>
              <p className="">React Native</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/react.png"
                  objectFit="contain"
                />
              </div>
              <p className="">React JS</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/next.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Next JS</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/firebase.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Firebase</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/php.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Php</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/mysql.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Mysql</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/git.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Git</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/express.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Express js</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/mongo.png"
                  objectFit="contain"
                />
              </div>
              <p className="">Mongo DB</p>
            </div>
          </div>
          {/* item */}
          <div className="item">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Image
                  height={40}
                  width={50}
                  alt="/"
                  src="/assets/skills/hosting.avif"
                  objectFit="contain"
                />
              </div>
              <p className="">Web Hosting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
