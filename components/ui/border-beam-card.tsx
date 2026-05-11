"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { ProjectCardHighlights, type ProjectHighlights } from "@/components/ui/project-card-highlights";
import { ProjectCardTerminalFooter } from "@/components/ui/project-card-terminal-footer";
import type { ProjectReadmeId } from "@/lib/readme-registry";

type BorderBeamCardProps = {
  title: string;
  description: string;
  eyebrow?: ReactNode;
  /** Impact / core value / stack — rendered in a highlighted block below the body. */
  highlights?: ProjectHighlights;
  /** Behind content; use for subtle motion / metrics (keeps z-index below copy). */
  backdrop?: ReactNode;
  children?: ReactNode;
  /** Opens README viewer when clicking the simulated `cat README.md` line. */
  readmeProjectId?: ProjectReadmeId;
  className?: string;
};

export function BorderBeamCard({
  title,
  description,
  eyebrow,
  highlights,
  backdrop,
  children,
  readmeProjectId,
  className,
}: BorderBeamCardProps) {
  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={{
        rest: { y: 0 },
        hover: { y: -5 },
      }}
      transition={{ duration: 0.25 }}
      className={`group relative isolate flex h-auto w-full max-w-none flex-shrink-0 flex-col self-start overflow-hidden rounded-xl border border-emerald-500/25 bg-neutral-950 p-4 sm:rounded-2xl sm:p-5 md:p-6 ${className ?? ""}`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-28 top-0 z-[1] h-28 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
        animate={{ x: ["-20%", "120%"] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <div className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />
      </div>
      {backdrop ? (
        <div className="pointer-events-none absolute inset-0 z-[9] overflow-hidden">{backdrop}</div>
      ) : null}
      <div className="relative z-10 space-y-2.5 sm:space-y-3">
        {eyebrow != null ? (
          typeof eyebrow === "string" ? (
            <p className="break-words text-[11px] uppercase tracking-[0.18em] text-emerald-400/85 sm:text-xs sm:tracking-[0.2em]">
              {eyebrow}
            </p>
          ) : (
            eyebrow
          )
        ) : null}
        <h3 className="break-words text-lg font-semibold leading-tight text-white [overflow-wrap:anywhere] sm:text-xl">
          {title}
        </h3>
        <p className="break-words text-sm leading-relaxed text-neutral-300 [overflow-wrap:anywhere]">
          {description}
        </p>
        {highlights ? <ProjectCardHighlights highlights={highlights} /> : null}
        {children}
      </div>
      {readmeProjectId ? <ProjectCardTerminalFooter projectId={readmeProjectId} /> : null}
    </motion.article>
  );
}
