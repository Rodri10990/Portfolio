"use client";

import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SPEND_BASE = 2847;
const SPEND_OPT = 2412;
const SAVE_BASE = 312;
const SAVE_OPT = 589;

function formatEuro(n: number) {
  return `€${n.toLocaleString("en-IE")}`;
}

/** Animated Spending / Savings row for the Revolut card — in-flow so it centers between highlights & CLI footer. */
export function SavingsMetricsBlock() {
  const reduceMotion = useReducedMotion();
  const spendingMv = useMotionValue(SPEND_BASE);
  const savingsMv = useMotionValue(SAVE_BASE);
  const [spendLabel, setSpendLabel] = useState(SPEND_BASE);
  const [saveLabel, setSaveLabel] = useState(SAVE_BASE);

  useMotionValueEvent(spendingMv, "change", (v) => {
    setSpendLabel(Math.round(v));
  });
  useMotionValueEvent(savingsMv, "change", (v) => {
    setSaveLabel(Math.round(v));
  });

  useEffect(() => {
    if (reduceMotion) return;

    let active = true;

    const run = async () => {
      while (active) {
        await Promise.all([
          animate(spendingMv, SPEND_OPT, { duration: 1.1, ease: [0.22, 1, 0.36, 1] }),
          animate(savingsMv, SAVE_OPT, { duration: 1.1, ease: [0.22, 1, 0.36, 1] }),
        ]);
        if (!active) break;
        await new Promise<void>((r) => setTimeout(r, 3200));
        if (!active) break;

        await Promise.all([
          animate(spendingMv, SPEND_BASE, { duration: 1.05, ease: [0.22, 1, 0.36, 1] }),
          animate(savingsMv, SAVE_BASE, { duration: 1.05, ease: [0.22, 1, 0.36, 1] }),
        ]);
        if (!active) break;
        await new Promise<void>((r) => setTimeout(r, 2800));
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [reduceMotion, spendingMv, savingsMv]);

  const spendDisplay = reduceMotion ? SPEND_OPT : spendLabel;
  const saveDisplay = reduceMotion ? SAVE_OPT : saveLabel;

  return (
    <div
      className="mt-5 flex min-h-[6.75rem] w-full flex-col justify-center py-3 sm:mt-6 sm:min-h-[7.5rem]"
      aria-hidden
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Spending</p>
          <p className="tabular-nums text-lg font-semibold text-neutral-200 sm:text-xl">
            {formatEuro(spendDisplay)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-400/75">Savings</p>
          <p className="tabular-nums text-lg font-semibold text-emerald-300 sm:text-xl">
            {formatEuro(saveDisplay)}
          </p>
        </div>
      </div>
    </div>
  );
}
