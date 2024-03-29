import React from "react";
import Image from "next/image";

import { GiArrowWings } from "react-icons/gi";
import { BsArrowReturnRight } from "react-icons/bs";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import AnimateLayout from "./layout/AnimateLayout";
import AnimateLayout2 from "./layout/AnimateLayout2";

const Contact = () => {
  return (
    <section id="contact">
      <div className="container">
        <h3 className="text-meshaal uppercase">Contact</h3>
        <div className="flex space-x-2">
          <span className="text-[25px] md:text-[30px]">
            <BsArrowReturnRight />
          </span>
          <h1 className="mb-4">Get in touch</h1>
        </div>

        {/* grid */}
        <div className="grid grid-cols-3 mt-8 gap-x-6 gap-y-4">
          <div className="col-span-3 md:col-span-1 p-4 shadow-md shadow-gray-400 rounded">
            <Image
              className="rounded-lg"
              alt="/"
              src="/contact.jpg"
              height={300}
              width={440}
              objectFit="cover"
            />
            <div className="mt-6">
              <h2>Meshaal Noureldien</h2>
              <p className="text-meshaal font-semibold">Front-End Developer</p>
              <p className="mt-6">
                I am available for freelance or full-time positions.
              </p>
              <p className="mb-12">Contact me and let&#39;s talk.</p>
            </div>

            {/* social media shit */}
            <div className="social flex justify-between items-center w-full  max-w-[220px] mt-8">
              <div className="p-1 border border-gray-400 bg-white rounded">
                <a
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={25} />
                </a>
              </div>
              <div className="p-1 border border-gray-400 bg-white rounded">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={25} />
                </a>
              </div>
              <div className="p-1 border border-gray-400 bg-white rounded">
                <a
                  href="https://www.linkedin.com/in/mishaal-noureldien-204294208/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={25} />
                </a>
              </div>
              <div className="p-1 border border-gray-400 bg-white rounded">
                <a
                  href="https://github.com/Mish3l-99"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={25} />
                </a>
              </div>
            </div>
          </div>

          {/* form col */}

          <div className="col-span-3 md:col-span-2">
            <AnimateLayout2>
              <form
                action="https://getform.io/f/6b00cd38-3e80-4644-a68b-1e67dc7c9de7"
                method="POST"
                className="form"
              >
                <div className="flex items-center space-x-2 text-lg md:text-3xl mb-4 font-semibold">
                  <GiArrowWings size={25} />
                  <h3 className="">You can leave a message!</h3>
                </div>
                <input name="name" type="text" placeholder="Name.." />
                <input name="email" type="email" placeholder="Email.." />
                <textarea name="message" placeholder="Message.." rows="8" />
                <button className="mt-12 w-fit mx-auto py-1 px-8">
                  Submit
                </button>

                <div className="mt-8 flex items-center gap-x-2">
                  Email:
                  <a
                    className="text-black hover:text-meshaal "
                    href="mailto:meshaal.noureldien@gmail.com"
                  >
                    meshaal.noureldien@gmail.com
                  </a>
                </div>
              </form>
            </AnimateLayout2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
