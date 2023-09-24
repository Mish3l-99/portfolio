import React, { useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Link from "next/link";
import { CgMenuLeftAlt, CgClose } from "react-icons/cg";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = (props) => {
  const [mobNav, setMobNav] = useState(false);
  const router = useRouter();
  // const params = router.query;

  return (
    <div className="">
      {/* main nav */}
      <div
        className={
          router.route === "/"
            ? "fixed w-full h-fit py-1 hadow-xl bg-white z-[10]"
            : "fixed w-full h-fit py-1 z-[20] text-gray-100"
        }
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <Link href="/">
                <Image
                  src="/assets/logo/MN.png"
                  alt="/"
                  width="70"
                  height="50"
                  className="object-contain cursor-pointer"
                />
              </Link>
              {props.homee}
            </div>
            <div className="">
              <ul className="nav-ul hidden md:flex gap-x-8 font-semibold">
                <Link href="/">
                  <li className="">Home</li>
                </Link>
                <Link href="/#about">
                  <li className="">About</li>
                </Link>
                <Link href="/#skills">
                  <li className="">Skills</li>
                </Link>
                <Link href="/#projects">
                  <li className="">Projects</li>
                </Link>
                <Link href="/#contact">
                  <li className="">Contact</li>
                </Link>
              </ul>
            </div>

            {/* Nav toggler */}
            <div className="md:hidden" onClick={() => setMobNav(true)}>
              <CgMenuLeftAlt />
            </div>
          </div>
        </div>
      </div>

      {/* mobile nav */}
      <div
        className={
          mobNav
            ? "fixed left-0 w-full h-screen bg-black/50 duration-300 z-[30]"
            : ""
        }
      >
        <div
          className={
            mobNav
              ? "fixed left-0 top-0 w-[85%] sm:w-[60%] h-screen bg-[#ecf0f3] p-3 duration-700"
              : "fixed left-[-100%]"
          }
        >
          <div className="flex justify-between items-center mb-4">
            <Image
              src="/assets/logo/MN.png"
              alt="/"
              width="80"
              height="45"
              className="object-contain"
            />
            <div
              onClick={() => setMobNav(false)}
              className="rounded-full shadow-md p-2 cursor-pointer shadow-gray-400"
            >
              <CgClose />
            </div>
          </div>
          <div>
            <p className="my-2 py-2 border-b border-gray-300">
              Let&#39;s build something great together!
            </p>
          </div>
          <div>
            <ul onClick={() => setMobNav(false)} className="mob-ul">
              <Link href="/">
                <li className="">Home</li>
              </Link>
              <Link href="/#about">
                <li className="">About</li>
              </Link>
              <Link href="/#skills">
                <li className="">Skills</li>
              </Link>
              <Link href="/#projects">
                <li className="">Projects</li>
              </Link>
              <Link href="/#contact">
                <li className="">Contact</li>
              </Link>
            </ul>
          </div>
          <div className="mt-28">
            <p className="tracking-widest uppercase">Let&#39;s Connect</p>
            <div className="social flex justify-between items-center w-full  max-w-[220px] md:max-w-[350px] mt-8">
              <div className="p-1 shadow-lg shadow-gray-400 rounded-sm">
                <a
                  href="https://www.linkedin.com/in/mishaal-noureldien-204294208/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg shadow-gray-400 rounded-sm">
                <a
                  href="https://github.com/Mish3l-99"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg shadow-gray-400 rounded-sm">
                <a
                  href="mailto: meshaal.noureldien@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdEmail size={25} />
                </a>
              </div>
              <div className="p-1 shadow-lg shadow-gray-400 rounded-sm">
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

export default Navbar;
