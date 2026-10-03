import { ImageResponse } from "next/og";

import { OgFrame, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";
import { getProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const alt = `Project by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const project = getProject((await params).id)!;
  const number = String(projects.indexOf(project) + 1).padStart(2, "0");
  const [logo, screenshot] = await Promise.all([
    publicImage("/assets/logo/MN.png"),
    publicImage(project.image),
  ]);

  return new ImageResponse(
    <OgFrame logo={logo}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          width: 500,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 24,
            color: ogColors.brand,
          }}
        >
          {`Project ${number}`}
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 600,
            letterSpacing: -5,
            lineHeight: 1,
            marginTop: 12,
          }}
        >
          {project.title}
        </div>
        <div style={{ fontSize: 32, color: ogColors.muted, marginTop: 16 }}>
          {project.summary}
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 36 }}
        >
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "6px 16px",
                border: `1px solid ${ogColors.line}`,
                borderRadius: 999,
                fontFamily: "JetBrains Mono",
                fontSize: 20,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Screenshot bleeding off the right edge, in minimal browser chrome. */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 640,
          width: 640,
          height: 420,
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          border: `1px solid ${ogColors.line}`,
          backgroundColor: "#18181c",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", gap: 8, padding: "14px 18px" }}>
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <img
          src={screenshot}
          width={640}
          height={380}
          alt=""
          style={{ objectFit: "cover", objectPosition: "top left" }}
        />
      </div>
    </OgFrame>,
    { ...ogSize, fonts: await ogFonts() },
  );
}
