"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

import { createSession } from "@/actions/create-session";
import { threadHasReply } from "@/actions/thread-has-reply";
import { site } from "@/lib/site";
import { useChatStore } from "@/store/chat";

// ChatKit renders in an iframe, so it loads its own copy of the site fonts.
const fontSources = [
  {
    family: "Geist",
    src: "https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2",
    weight: "100 900",
    display: "swap" as const,
  },
  {
    family: "JetBrains Mono",
    src: "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2",
    weight: "100 800",
    display: "swap" as const,
  },
];

// How long ChatKit gets to load before we give up and show a fallback.
const LOAD_TIMEOUT_MS = 15_000;

function ChatArea() {
  // Bumping the key remounts ChatKit for a fresh attempt.
  const [attempt, setAttempt] = useState(0);
  return <ChatFrame key={attempt} onRetry={() => setAttempt((n) => n + 1)} />;
}

function ChatFrame({ onRetry }: { onRetry: () => void }) {
  const closeChat = useChatStore((s) => s.closeChat);

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [offline, setOffline] = useState(false);
  const threadId = useRef<string | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        try {
          return await createSession();
        } catch (error) {
          setFailed(true);
          throw error;
        }
      },
    },
    theme: {
      colorScheme: "dark",
      radius: "round",
      color: {
        accent: { primary: "#ff1616", level: 1 },
        grayscale: { hue: 240, tint: 1, shade: -2 },
      },
      typography: {
        baseSize: 15,
        fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif",
        fontFamilyMono: "'JetBrains Mono', ui-monospace, monospace",
        fontSources,
      },
    },
    history: { enabled: false },
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
    onReady: () => {
      ready.current = true;
      setLoading(false);
    },
    onError: () => {
      if (!ready.current) setFailed(true);
      else setOffline(true);
    },
    onThreadChange: ({ threadId: id }) => {
      threadId.current = id;
    },
    onResponseStart: () => setOffline(false),
    onResponseEnd: async () => {
      if (threadId.current && !(await threadHasReply(threadId.current))) {
        setOffline(true);
      }
    },

    disclaimer: {
      text: "Disclaimer: This is my AI-powered twin. It may not be 100% accurate and should be verified for accuracy.",
    },
  });

  if (failed) {
    return (
      <div
        role="alert"
        className="relative flex size-full flex-col items-center justify-center gap-4 p-8 text-center text-sm"
      >
        <button
          type="button"
          onClick={closeChat}
          aria-label="Close chat"
          className="absolute top-4 left-4 rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-current"
        >
          <IoClose className="size-5" />
        </button>
        <p className="text-base font-medium">My AI twin is offline right now.</p>
        <p className="max-w-xs text-muted">
          Something went wrong while starting the chat. Please try again, or
          reach me directly at{" "}
          <a href={`mailto:${site.email}`} className="text-brand underline">
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-brand/40 px-4 py-2 text-brand transition hover:bg-brand/10"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface text-sm text-muted">
          <AiOutlineLoading3Quarters className="animate-spin text-brand" />
          Waking up my twin…
        </div>
      )}
      <ChatKit control={control} className="size-full" />
      {offline && (
        <div
          role="alert"
          className="absolute inset-x-4 bottom-40 z-10 rounded-2xl border border-brand/30 bg-ink/95 p-4 text-sm shadow-xl backdrop-blur"
        >
          <p className="font-medium">My AI twin is offline right now.</p>
          <p className="mt-1 text-muted">
            Please reach me directly at{" "}
            <a href={`mailto:${site.email}`} className="text-brand underline">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}

export default ChatArea;
