import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Script from "next/script";
import Chat from "@/components/chat";

const lato = Lato({
  variable: "--font-lato",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meshaal | Full-Stack Developer",
  description: `A full-stack web developer with strong experience building scalable, modern web applications across freelance,
                startup, and mid-sized company environments. Skilled in JavaScript/TypeScript ecosystems with a focus on React,
                Next.js, and Node.js, and experienced in designing robust backend systems, RESTful APIs, and database
                architectures. Proven ability to rebuild and optimize complex legacy systems, develop real-time features such as
                messaging, notifications, and socket-based communication, and improve performance under high-traffic conditions.
                Adept at collaborating with cross-functional teams to deliver production-ready features with strong attention to
                UI/UX, performance, and reliability. Actively leverages modern AI tools to enhance development speed, code
                quality, and problem-solving efficiency while maintaining clean and maintainable engineering practices.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />

        <Navbar />
        {children}
        <Footer />

        {/* ai chat */}
        <Chat />
      </body>
    </html>
  );
}
