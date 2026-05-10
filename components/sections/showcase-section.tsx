import { SectionReveal } from "@/components/ui/section-reveal";
import { MacbookScrollShowcase } from "@/components/ui/macbook-scroll-showcase";

export function ShowcaseSection() {
  return (
    <section className="container-shell py-20 sm:py-24">
      <SectionReveal className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Featured Project</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Scalable B2B digital transformation through custom automation.</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-300 sm:text-base">
        A full-scale digital ecosystem. It replaces legacy physical workflows with a React Native interface, powered by a backend orchestrator using n8n (self-hosted on Google Cloud Platform). This architecture eliminates administrative manual input and human error, providing secure, real-time financial insights for business stakeholders.
        </p>
      </SectionReveal>
      <MacbookScrollShowcase />
    </section>
  );
}
