import type { Metadata } from "next";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import NotFoundContent from "@/components/site/NotFoundContent";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="w-full flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}