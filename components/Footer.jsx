import React from "react";
import Image from "next/image";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-300 py-2">
      <div className="container">
        <div className="flex justify-between items-center relative">
          <div>
            <Image
              alt="/"
              src="/assets/logo/FMN.png"
              height={40}
              width={80}
              objectFit="contain"
            />
          </div>

          {/* absolute arrow up */}
          <div className="absolute left-[50%] translate-x-[-50%] top-[33px] p-1 rounded-full bg-white shadow-lg shadow-gray-700 mt-[-60px] cursor-pointer hover:scale-110 ease-in duration-500">
            <MdOutlineDoubleArrow
              size={25}
              className="rotate-[-90deg] text-meshaal"
            />
          </div>
          <div>
            <a
              className="text-green-800"
              href="https://wa.me/919884826404"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={25} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
