"use client";

import { ReadmeMarkdownContent } from "@/components/ui/readme-markdown-content";
import { useReadmeModal } from "@/contexts/readme-modal-context";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId } from "react";

export function ReadmeModal() {
  const { phase, markdown, closeReadme, error, sourceRepoUrl } = useReadmeModal();
  const open = phase !== "closed";
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeReadme();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeReadme]);

  return (
    <AnimatePresence mode="sync">
      {open ? (
        <motion.div
          className="fixed inset-0 z-[900] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close README modal"
            className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
            onClick={() => closeReadme()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[1] flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#10b981] bg-black shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_0_42px_rgba(16,185,129,0.22)]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center gap-2 border-b border-emerald-500/20 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
              <div className="flex gap-2" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-red-400/95" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/95" />
                <span className="h-3 w-3 rounded-full bg-green-400/95" />
              </div>
              <p id={titleId} className="min-w-0 flex-1 truncate font-terminal text-[11px] text-emerald-500/95 sm:text-sm">
                ~/projects/README.md
              </p>
              {sourceRepoUrl ? (
                <a
                  href={`${sourceRepoUrl}?tab=readme-ov-file`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex max-w-[7rem] shrink-0 truncate rounded-md border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 font-terminal text-[10px] font-medium text-emerald-400 transition-colors hover:border-emerald-400/55 hover:bg-emerald-500/15 sm:max-w-none sm:px-2.5 sm:text-[11px]"
                >
                  GitHub
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => closeReadme()}
                className="-mr-1 rounded-full p-1.5 text-emerald-500/85 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 sm:-mr-2 sm:p-2"
                aria-label="Close README reader"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </header>

            <div className="min-h-[200px] flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
              {phase === "loading" ? (
                <div className="font-terminal text-sm leading-relaxed text-zinc-400">
                  Fetching data from GitHub<span className="animate-pulse">...</span>{" "}
                  <span className="text-emerald-400">[OK]</span>
                </div>
              ) : null}

              {phase === "error" ? (
                <p className="font-terminal text-sm text-red-400/90">{error ?? "Something went wrong."}</p>
              ) : null}

              {phase === "ready" && markdown !== null ? (
                <ReadmeMarkdownContent markdown={markdown} />
              ) : null}
            </div>

            {(phase === "ready" || phase === "error") && (
              <footer className="border-t border-emerald-500/10 px-3 py-2.5 font-terminal text-xs text-emerald-500 sm:px-5 sm:py-3">
                <span className="text-zinc-500">&gt;</span> Fetch complete <span className="font-medium text-emerald-400">[OK]</span>
              </footer>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
