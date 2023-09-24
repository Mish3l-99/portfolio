import { motion } from "framer-motion";

const AnimateLayout = ({ children }) => {
  const variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  };

  const transition = {
    duration: 0.6,
    type: "spring",
    stiffness: 260, // Adjust the stiffness to control the spring effect
    damping: 20, // Adjust the damping to control the spring effect
    duration: 1,
    delay: 0.2,
  };

  return (
    <motion.div
      variants={variants}
      transition={transition}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateLayout;
