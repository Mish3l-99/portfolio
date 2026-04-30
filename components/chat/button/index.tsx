"use client";

import { useChatStore } from "@/store/chat";
import { BsChatDots } from "react-icons/bs";

const ChatButton = () => {
  const { openChat } = useChatStore();
  return (
    <button
      title="Chat with my AI Twin"
      className="fixed shadow-gray-600 shadow-lg inset-e-4 bottom-4 cursor-pointer md:bottom-6 md:inset-e-6 z-9 bg-meshaal flex items-center justify-center rounded-full aspect-square size-15 "
      onClick={openChat}
    >
      <BsChatDots size={30} />
    </button>
  );
};

export default ChatButton;
