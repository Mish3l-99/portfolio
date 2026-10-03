import Image from "next/image";

import { cn } from "@/utils";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

/** A screenshot dressed up in minimal browser chrome. */
export default function BrowserFrame({
  src,
  alt,
  sizes,
  preload,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-[#18181c] shadow-2xl shadow-black/50",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
    </div>
  );
}
