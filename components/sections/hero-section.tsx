import { AnimatedTerminal } from "@/components/ui/animated-terminal";
import { SectionReveal } from "@/components/ui/section-reveal";

export function HeroSection() {
  return (
    <section className="container-shell py-20 sm:py-28">
      <SectionReveal className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-400">Ops x Engineering</p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            The Operations-Driven <span className="text-emerald-400">Frontend Developer</span>.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            I build products that combine operational rigor with modern web craftsmanship, converting complex
            workflows into clear interfaces and measurable business outcomes.
          </p>
        </div>
        <AnimatedTerminal />
      </SectionReveal>
    </section>
  );
}
