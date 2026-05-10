import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsBentoSection } from "@/components/sections/projects-bento-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_40%)]" />
      <HeroSection />
      <ShowcaseSection />
      <ProjectsBentoSection />
    </main>
  );
}
