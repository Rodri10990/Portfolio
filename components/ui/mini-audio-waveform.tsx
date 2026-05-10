"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Relative peak heights (0–1) — minimalist “levels” strip, not a literal spectrogram */
const PEAKS = [0.26, 0.48, 0.34, 0.62, 0.4, 0.74, 0.32, 0.55, 0.68, 0.38, 0.58, 0.44, 0.66];

const BAR_HEIGHT_PX = 46;

export function MiniAudioWaveform() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none -mx-6 mt-4 flex h-12 w-[calc(100%+3rem)] min-w-0 items-end sm:mt-5 sm:h-14"
      aria-hidden
    >
      {PEAKS.map((peak, i) => (
        <div key={i} className="flex min-w-0 flex-1 justify-center px-[1px] sm:px-0.5">
          <motion.span
            className="block w-[3px] max-w-full shrink-0 rounded-full bg-emerald-400 sm:w-1"
            style={{
              height: BAR_HEIGHT_PX,
              transformOrigin: "50% 100%",
            }}
            variants={
              reduceMotion
                ? {
                    rest: { scaleY: 0.22 + peak * 0.5, opacity: 0.5 },
                    hover: { scaleY: 0.22 + peak * 0.5, opacity: 0.5 },
                  }
                : {
                    rest: {
                      scaleY: 0.1 + peak * 0.06,
                      opacity: 0.22,
                      boxShadow: "0 0 0 transparent",
                    },
                    hover: {
                      scaleY: 0.2 + peak * 0.78,
                      opacity: 0.92,
                      boxShadow: "0 0 10px rgba(16, 185, 129, 0.35)",
                    },
                  }
            }
            transition={{
              duration: 0.42,
              delay: i * 0.026,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      ))}
    </div>
  );
}
