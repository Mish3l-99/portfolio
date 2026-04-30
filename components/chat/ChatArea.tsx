"use client";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { createSession } from "@/actions/create-session";
import { useChatStore } from "@/store/chat";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { useState } from "react";

function ChatArea() {
  const { closeChat } = useChatStore();

  const [loading, setLoading] = useState(true);

  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        return await createSession();
      },
    },
    theme: "light",
    header: {
      title: {
        text: `Chat with My AI Twin`,
      },
      leftAction: {
        icon: "close",
        onClick: () => closeChat(),
      },
    },
    startScreen: {
      greeting: `Hi! I'm Meshaal's Twin. Ask me anything about his work, experience, or projects.`,
      prompts: [
        {
          icon: "suitcase",
          label: "What's your experience?",
          prompt:
            "Tell me about your professional experience and previous roles",
        },
        {
          icon: "square-code",
          label: "What skills do you have?",
          prompt:
            "What technologies and programming languages do you specialize in?",
        },
        {
          icon: "cube",
          label: "What have you built?",
          prompt: "Show me some of your most interesting projects",
        },
        {
          icon: "profile",
          label: "Who are you?",
          prompt: "Tell me more about yourself and your background",
        },
      ],
    },
    composer: {
      models: [
        {
          id: "crisp",
          label: "Crisp",
          description: "Concise and factual",
        },
        {
          id: "clear",
          label: "Clear",
          description: "Focused and helpful",
        },
        {
          id: "chatty",
          label: "Chatty",
          description: "Conversational companion",
        },
      ],
    },
    onReady: () => setLoading(false),

    disclaimer: {
      text: "Disclaimer: This is my AI-powered twin. It may not be 100% accurate and should be verified for accuracy.",
    },
  });

  return (
    <>
      {loading && (
        <div className="size-full flex flex-col gap-y-3 items-center justify-center">
          <span className="animate-spin">
            <AiOutlineLoading3Quarters />
          </span>
          <span>Loading...</span>
        </div>
      )}
      <ChatKit control={control} className="size-full" />
    </>
  );
}

export default ChatArea;
