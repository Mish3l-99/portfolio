import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();

/** Social-card dimensions recommended by Open Graph and X. */
export const ogSize = { width: 1200, height: 630 };

export const ogColors = {
  ink: "#09090b",
  fg: "#f2f1ee",
  muted: "#8e8e98",
  line: "rgba(255,255,255,0.1)",
  brand: "#ff1616",
};

/** Reads a file under `public/` as a data URL for use in an `<img>`. */
export async function publicImage(path: string) {
  const data = await readFile(join(root, "public", path), "base64");
  return `data:image/png;base64,${data}`;
}

export async function ogFonts() {
  const font = (file: string) => readFile(join(root, "assets/fonts", file));
  const [regular, semibold, mono] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
    font("JetBrainsMono-Medium.ttf"),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const },
    { name: "Geist", data: semibold, weight: 600 as const },
    { name: "JetBrains Mono", data: mono, weight: 500 as const },
  ];
}

/** Dark canvas with the red glow and the MN mark, shared by every card. */
export function OgFrame({
  logo,
  children,
}: {
  logo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 72,
        position: "relative",
        backgroundColor: ogColors.ink,
        backgroundImage:
          "radial-gradient(circle at 12% 0%, rgba(255,22,22,0.32), transparent 55%)",
        color: ogColors.fg,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} height={44} width={80} alt="" />
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: ogColors.muted,
          }}
        >
          meshaal.site
        </div>
      </div>
      {children}
    </div>
  );
}
