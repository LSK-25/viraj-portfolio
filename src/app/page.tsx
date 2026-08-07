import { CursorAura } from "@/components/CursorAura";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/hero/Hero";
import { Works } from "@/components/sections/Works";
import { About } from "@/components/sections/About";
import { CaseFiles } from "@/components/sections/CaseFiles";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Loader />
      <CursorAura />
      <Header />
      <Hero />
      <Works />
      <About />
      <CaseFiles />
      <Contact />
    </main>
  );
}