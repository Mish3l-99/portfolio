import { ImageResponse } from "next/og";

import { OgFrame, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

const stack = ["React", "Next.js", "Node.js", "Laravel"];

export default async function Image() {
  const logo = await publicImage("/assets/logo/MN.png");

  return new ImageResponse(
    <OgFrame logo={logo}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 600,
            letterSpacing: -7,
            lineHeight: 0.9,
          }}
        >
          {site.firstName}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontFamily: "JetBrains Mono",
            fontSize: 72,
            letterSpacing: -3,
          }}
        >
          <span style={{ color: "rgba(142,142,152,0.5)" }}>{"<"}</span>
          <span
            style={{
              backgroundImage: "linear-gradient(90deg, #ff1616, #ff7a5c)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {site.lastName}
          </span>
          <span style={{ color: "rgba(142,142,152,0.5)", marginLeft: 24 }}>
            {"/>"}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 56,
          fontFamily: "JetBrains Mono",
          fontSize: 26,
          color: ogColors.muted,
        }}
      >
        <span>{"// Full-stack developer"}</span>
        <div style={{ display: "flex", gap: 12 }}>
          {stack.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "8px 18px",
                border: `1px solid ${ogColors.line}`,
                borderRadius: 999,
                color: ogColors.fg,
                fontSize: 22,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </OgFrame>,
    { ...ogSize, fonts: await ogFonts() },
  );
}
