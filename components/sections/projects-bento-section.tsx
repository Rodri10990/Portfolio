"use client";

import { BorderBeamCard } from "@/components/ui/border-beam-card";
import { MiniAudioWaveform } from "@/components/ui/mini-audio-waveform";
import { SavingsMetricsBlock } from "@/components/ui/savings-metrics-block";
import { SectionReveal } from "@/components/ui/section-reveal";
import { motion } from "framer-motion";

export function ProjectsBentoSection() {
  return (
    <section className="container-shell py-20 sm:py-24">
      <SectionReveal className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">Builds & Experience</p>
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Project Bento Grid</h2>
      </SectionReveal>

      <div className="grid auto-rows-auto gap-4 sm:gap-5 lg:grid-cols-12 lg:items-start">
        <SectionReveal className="lg:col-span-7">
          <BorderBeamCard
            eyebrow="Mobile Product"
            title="MASSIVE AI WORKOUTS | INTELLIGENT TRAINING HUB"
            description="An all-in-one hub featuring a Gemini-powered coach that creates and automates training plans and progressions based on your last session. Includes a built-in tracker and exercise library."
            highlights={{
              impact: "100% data-driven progressions.",
              coreValue: "Data-Driven AI Coaching & Unified Management",
              stack: "Next.js • Gemini API • FastAPI • Framer Motion",
            }}
            readmeProjectId="massive-ai"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 sm:gap-x-4">
            <motion.span
              variants={{
                rest: { opacity: 0, y: 6, scale: 0.96 },
                hover: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex w-fit rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300"
            >
              AI Powered
            </motion.span>
            
            <motion.span
              variants={{
                rest: { opacity: 0, y: 6, scale: 0.96 },
                hover: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex w-fit rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300"
            >
              IOS
            </motion.span>
            <motion.span
              variants={{
                rest: { opacity: 0, y: 6, scale: 0.96 },
                hover: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-flex w-fit rounded-full border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300"
            >
              Android
            </motion.span>
            </div>
          </BorderBeamCard>
        </SectionReveal>

        <SectionReveal className="lg:col-span-5" delay={0.05}>
          <BorderBeamCard
            eyebrow="Commercial SaaS"
            title="WWW.MARIAVICTORIAMAZZOLA.COM.AR | PREMIUM CONTENT HUB"
            description="A scalable subscription platform built to host and stream professional psychology content. It integrates high-fidelity video, podcasts, and editorial resources into a unified, high-performance digital experience."
            highlights={{
              impact: "Centralized content ecosystem with multi-format support.",
              coreValue: "Seamless multimedia delivery and subscription-gated access.",
              stack: "Next.js • Tailwind CSS • Framer Motion • Stripe / Auth integration",
            }}
            readmeProjectId="premium-content-hub"
          >
            <MiniAudioWaveform />
          </BorderBeamCard>
        </SectionReveal>

        <SectionReveal className="lg:col-span-4" delay={0.08}>
          <BorderBeamCard
            eyebrow={
              <div className="space-y-0.5">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400/85">Savings optimizer</p>
                <p className="text-[11px] font-normal tracking-[0.06em] text-emerald-400/55 normal-case">
                  budget intelligence
                </p>
              </div>
            }
            title="REVOLUT-NOTION | FINANCIAL AUTOMATION ENGINE"
            description="Automated financial intelligence that analyzes Revolut data to identify expense-cutting opportunities and monitor savings goals in real time."
            highlights={{
              impact: "Targeted expense reduction and fully automated goal tracking.",
              coreValue: "From passive tracking to active financial decision support.",
              stack: "Python • Notion API • Webhooks • GCP",
            }}
            readmeProjectId="revolut-notion"
          >
            <SavingsMetricsBlock />
          </BorderBeamCard>
        </SectionReveal>

        <SectionReveal className="lg:col-span-8" delay={0.1}>
          <BorderBeamCard
            eyebrow="Background + Technical Edge"
            title="Skills Box"
            description="Years as an Operations Manager across Argentina and Ireland now fused with modern engineering skills: Python, React Native, Next.js, data visualization, and workflow automation."
            readmeProjectId="skills-box"
          >
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-emerald-300">
              {["Operations Strategy", "Next.js", "Framer Motion", "React Native", "Python", "API Integrations"].map(
                (skill) => (
                  <span key={skill} className="rounded-full border border-emerald-400/40 px-2.5 py-1">
                    {skill}
                  </span>
                ),
              )}
            </div>
          </BorderBeamCard>
        </SectionReveal>
      </div>
    </section>
  );
}
