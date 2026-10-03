"use client";

import { useEffect, useState } from "react";

type Props = {
  words: string[];
  /** How long a fully typed word stays on screen, in ms. */
  pause?: number;
};

/** Types each word out, holds it, deletes it, and moves on — with a blinking caret. */
export default function Typewriter({ words, pause = 1800 }: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const typed = !deleting && text === word;
    const cleared = deleting && text === "";
    const delay = typed ? pause : cleared ? 300 : deleting ? 35 : 75;

    const timer = setTimeout(() => {
      if (typed) setDeleting(true);
      else if (cleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, pause]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] animate-blink bg-brand" />
      </span>
    </>
  );
}
