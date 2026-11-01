import Chat from "@/components/chat";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/** Public portfolio chrome — kept out of private routes like /jobs. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chat />
    </>
  );
}
