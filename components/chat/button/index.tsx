"use client";

import { HiSparkles } from "react-icons/hi2";

import { useChatStore } from "@/store/chat";

const ChatButton = () => {
  const openChat = useChatStore((s) => s.openChat);

  return (
    <button
      type="button"
      onClick={openChat}
      aria-label="Chat with my AI twin"
      className="group fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-ink/80 p-1.5 pr-1.5 shadow-2xl shadow-brand/20 backdrop-blur-xl transition hover:border-brand/50 md:right-6 md:bottom-6 md:pl-5"
    >
      <span className="hidden text-sm font-medium md:inline">
        Ask my AI twin
      </span>
      <span className="relative grid size-11 place-items-center rounded-full bg-linear-to-br from-brand to-brand-soft text-white">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:2.5s]" />
        <HiSparkles
          size={20}
          className="relative transition group-hover:rotate-12"
        />
      </span>
    </button>
  );
};

export default ChatButton;
