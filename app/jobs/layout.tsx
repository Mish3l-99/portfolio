import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Hunt",
  robots: { index: false, follow: false },
};

export default function JobsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className="flex-1">{children}</main>;
}
