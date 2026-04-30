"use client";

import { motion, Transition } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

const AnimateLayout2 = ({ children }: Props) => {
  const variants = {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0 },
  };

  const transition: Transition = {
    duration: 1,
    type: "spring",
    stiffness: 260, // Adjust the stiffness to control the spring effect
    damping: 20, // Adjust the damping to control the spring effect
    delay: 0.5,
  };

  return (
    <motion.div
      variants={variants}
      transition={transition}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateLayout2;
