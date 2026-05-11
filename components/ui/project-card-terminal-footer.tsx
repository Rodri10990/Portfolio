"use client";

import { useReadmeModal } from "@/contexts/readme-modal-context";
import type { ProjectReadmeId } from "@/lib/readme-registry";
import { motion, useReducedMotion } from "framer-motion";

type ProjectCardTerminalFooterProps = {
  projectId: ProjectReadmeId;
};

/** Full-width CLI footer on project cards — click opens README modal */
export function ProjectCardTerminalFooter({ projectId }: ProjectCardTerminalFooterProps) {
  const { openReadme } = useReadmeModal();
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      className="relative z-[40] -mx-4 -mb-4 mt-4 flex min-h-[4.25rem] w-auto min-w-[calc(100%+2rem)] cursor-pointer flex-col justify-center gap-1 border-t border-emerald-500/20 bg-[#050505] px-4 py-3 text-left transition-colors duration-300 outline-none focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-emerald-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 group-hover:bg-[#090909] sm:-mx-5 sm:-mb-5 sm:min-h-[4.5rem] sm:min-w-[calc(100%+2.5rem)] sm:px-5 sm:py-4 md:-mx-6 md:-mb-6 md:min-h-[4.75rem] md:min-w-[calc(100%+3rem)] md:px-6 md:py-5"
      aria-label={`Run cat README.md and open docs for ${projectId}`}
      onClick={(e) => {
        e.stopPropagation();
        openReadme(projectId);
      }}
    >
      <span className="pointer-events-none inline-flex min-w-0 flex-wrap items-center gap-x-1 font-terminal text-xs leading-relaxed select-none sm:text-sm">
        <span className="shrink-0 text-zinc-500">guest@portfolio:~$</span>
        <span className="break-words text-emerald-500 transition-[text-shadow,color] duration-300 group-hover:[text-shadow:0_0_18px_rgba(16,185,129,0.55)]">
          cat README.md
        </span>
        <motion.span
          aria-hidden
          className="inline-block translate-y-px tabular-nums text-emerald-500"
          animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.15] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.4,
                  ease: "easeInOut",
                }
          }
        >
          │
        </motion.span>
      </span>
    </button>
  );
}
