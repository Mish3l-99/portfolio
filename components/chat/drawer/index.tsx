"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import { useChatStore } from "@/store/chat";
import ChatArea from "../ChatArea";

const ChatDrawer = () => {
  const { chatOpen, closeChat } = useChatStore();

  useEffect(() => {
    if (!chatOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [chatOpen, closeChat]);

  return (
    <AnimatePresence>
      {chatOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeChat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Chat with my AI twin"
            className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden border-l border-line bg-surface sm:inset-y-3 sm:right-3 sm:w-[30rem] sm:rounded-3xl sm:border"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            <ChatArea />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChatDrawer;
