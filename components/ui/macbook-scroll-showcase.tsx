"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function MacbookScrollShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <div ref={ref} className="relative">
      <motion.div style={{ rotateX, scale, y }} className="mx-auto w-full max-w-5xl" aria-label="El Kaiser showcase">
        <div className="emerald-glow rounded-[1.5rem] border border-emerald-500/30 bg-neutral-900 p-1.5 sm:rounded-[2rem] sm:p-2">
          <div className="rounded-[1.15rem] border border-neutral-700 bg-black p-3 sm:rounded-[1.5rem] sm:p-6">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">El Kaiser Dashboard</p>
                <h3 className="mt-1 text-base font-semibold text-white sm:text-xl">Ops & Financial Visibility</h3>
              </div>
              <span className="self-start rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] text-emerald-300 sm:text-xs">
                Live Preview
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-400">Inventory Velocity</p>
                <p className="mt-1.5 text-xl font-semibold text-emerald-300 sm:mt-2 sm:text-2xl">+23%</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-400">Margin Delta</p>
                <p className="mt-1.5 text-xl font-semibold text-emerald-300 sm:mt-2 sm:text-2xl">+12.4%</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-400">Process Cycle Time</p>
                <p className="mt-1.5 text-xl font-semibold text-emerald-300 sm:mt-2 sm:text-2xl">-31%</p>
              </div>
            </div>

            <div className="mt-3 h-32 rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black p-3 sm:mt-4 sm:h-44 sm:p-4">
              <div className="flex h-full items-end gap-1.5 sm:gap-2">
                {[48, 64, 56, 72, 88, 94, 82].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-emerald-400/80 sm:rounded-t-md" style={{ height: `${v}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
