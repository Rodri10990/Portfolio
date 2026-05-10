"use client";

/**
 * ARCHIVE - cinematic digital transformation sequence (paper, ash, keyboard, neural streams, dashboard).
 * Not used by the app. To restore: move or copy this file to `components/sections/FeaturedProject.tsx`,
 * export as `FeaturedProject`, and in `showcase-section.tsx` replace `MacbookScrollShowcase` with it.
 */

import {
  animate,
  motion,
  useAnimationControls,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Metric = {
  label: string;
  target: number;
  suffix: string;
  decimals?: number;
};

type AshParticle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  delay: number;
  duration: number;
};

const METRICS: Metric[] = [
  { label: "Inventory Velocity", target: 23, suffix: "%" },
  { label: "Margin Delta", target: 12.4, suffix: "%", decimals: 1 },
  { label: "Process Cycle Time", target: -31, suffix: "%" },
];

const BAR_VALUES = [48, 64, 56, 72, 88, 94, 82];
const KEYBOARD_ROWS = [10, 9, 9, 7];

const EMERALD = "#10b981";

/** Paths start at keyboard row (~y 540–558), curve up toward dashboard (~y 80–120). viewBox 0 0 1000 640 */
const NEURAL_PATHS = [
  "M 395 554 C 415 480, 445 360, 485 240 C 515 150, 535 95, 548 78",
  "M 500 558 C 505 470, 510 340, 518 220 C 522 140, 518 88, 505 72",
  "M 605 554 C 575 480, 530 360, 490 240 C 465 150, 475 95, 495 78",
];

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function RollingValue({
  target,
  suffix,
  decimals = 0,
  active,
}: {
  target: number;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!active) {
      return;
    }

    const controls = animate(value, target, {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
    });

    const unsubscribe = value.on("change", (latest) => {
      const abs = Math.abs(latest).toFixed(decimals);
      const sign = latest > 0 ? "+" : latest < 0 ? "-" : "";
      setDisplay(`${sign}${abs}${suffix}`);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [active, decimals, suffix, target, value]);

  return <span>{display}</span>;
}

type SequencePhase = "idle" | "paper" | "ash" | "bridge" | "final";

export function FeaturedProject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { amount: 0.5, margin: "0px 0px -12% 0px" });

  const [phase, setPhase] = useState<SequencePhase>("idle");
  const [lockedFinal, setLockedFinal] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const parallaxX = useSpring(0, { stiffness: 140, damping: 22 });
  const parallaxY = useSpring(0, { stiffness: 140, damping: 22 });

  const paperControls = useAnimationControls();
  const keyboardControls = useAnimationControls();
  const streamControls = useAnimationControls();
  const dashboardControls = useAnimationControls();

  const ashParticles = useMemo<AshParticle[]>(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const seed = Math.sin(i * 73.17) * 10000;
        const rand = seed - Math.floor(seed);
        const rand2 = Math.sin((i + 11) * 41.9) * 43758.5453;
        const rand2n = rand2 - Math.floor(rand2);
        const rand3 = Math.sin((i + 31) * 91.3) * 19198.3;
        const rand3n = rand3 - Math.floor(rand3);
        return {
          id: i,
          x: (rand - 0.5) * 240,
          y: 80 + rand2n * 260,
          rotate: (rand3n - 0.5) * 400,
          size: 6 + rand2n * 6,
          delay: rand3n * 0.35,
          duration: 1.15 + rand * 0.95,
        };
      }),
    [],
  );

  const keyPulseDelays = useMemo(() => {
    return KEYBOARD_ROWS.map((count, rowIdx) =>
      Array.from({ length: count }, (_, colIdx) => {
        const flatIndex =
          KEYBOARD_ROWS.slice(0, rowIdx).reduce((sum, rowCount) => sum + rowCount, 0) + colIdx;
        const seed = Math.abs(Math.sin((flatIndex + 1) * 17.71));
        return rowIdx * 0.06 + colIdx * 0.028 + seed * 0.16;
      }),
    );
  }, []);

  const runIdRef = useRef(0);
  const sequenceDoneRef = useRef(false);

  const runSequence = useCallback(async () => {
    const id = ++runIdRef.current;
    sequenceDoneRef.current = false;
    setLockedFinal(false);

    if (reduceMotion) {
      setPhase("final");
      await paperControls.start({ opacity: 0, transition: { duration: 0.2 } });
      await keyboardControls.start({ opacity: 0, transition: { duration: 0.2 } });
      await streamControls.start({ opacity: 0, pathLength: 0, transition: { duration: 0 } });
      await dashboardControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        translateZ: 56,
        transition: { duration: 0.25 },
      });
      sequenceDoneRef.current = true;
      setLockedFinal(true);
      return;
    }

    setPhase("paper");
    await paperControls.start({
      opacity: 1,
      y: 0,
      rotate: -2,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    });

    if (id !== runIdRef.current) return;
    await sleep(950);

    if (id !== runIdRef.current) return;
    setPhase("ash");
    await paperControls.start({
      opacity: 0,
      y: -12,
      scale: 0.96,
      rotate: 3,
      filter: "blur(2px)",
      transition: { duration: 0.55, ease: "easeOut" },
    });

    if (id !== runIdRef.current) return;
    await sleep(350);

    if (id !== runIdRef.current) return;
    await keyboardControls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "brightness(1)",
      translateZ: 42,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    });

    if (id !== runIdRef.current) return;
    await sleep(1600);

    if (id !== runIdRef.current) return;
    setPhase("bridge");
    await streamControls.start({
      opacity: 1,
      pathLength: 1,
      strokeDasharray: "12 16",
      strokeDashoffset: 0,
      transition: {
        opacity: { duration: 0.25 },
        pathLength: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
      },
    });

    if (id !== runIdRef.current) return;
    void streamControls.start({
      strokeDashoffset: [0, -56],
      transition: { duration: 1.15, ease: "linear", repeat: Number.POSITIVE_INFINITY },
    });

    if (id !== runIdRef.current) return;
    await sleep(2400);

    if (id !== runIdRef.current) return;
    setPhase("final");
    streamControls.stop();
    await Promise.all([
      keyboardControls.start({
        opacity: 0.22,
        y: 28,
        scale: 0.9,
        filter: "brightness(0.55)",
        translateZ: 4,
        transition: { duration: 0.65, ease: "easeOut" },
      }),
      dashboardControls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        translateZ: 56,
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
      }),
      streamControls.start({
        opacity: 0,
        pathLength: 0,
        strokeDashoffset: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      }),
    ]);

    if (id !== runIdRef.current) return;
    sequenceDoneRef.current = true;
    setLockedFinal(true);
  }, [
    reduceMotion,
    paperControls,
    keyboardControls,
    streamControls,
    dashboardControls,
  ]);

  useEffect(() => {
    if (!inView) {
      runIdRef.current += 1;
      if (!sequenceDoneRef.current) {
        setPhase("idle");
        void paperControls.start({ opacity: 0 });
        void keyboardControls.start({ opacity: 0, translateZ: 32 });
        void streamControls.start({ opacity: 0, pathLength: 0, strokeDashoffset: 0 });
        void dashboardControls.start({
          opacity: 0,
          scale: 0.94,
          y: 28,
          translateZ: 12,
          clipPath: "inset(100% 0% 0% 0%)",
        });
      }
      return;
    }

    if (sequenceDoneRef.current) {
      return;
    }

    const handle = window.setTimeout(() => {
      void runSequence();
    }, 0);

    return () => window.clearTimeout(handle);
  }, [inView, runSequence, paperControls, keyboardControls, streamControls, dashboardControls]);

  const showAsh = phase === "ash";
  const showNeuralMotion = phase === "bridge";
  const showFinal = phase === "final" || lockedFinal;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    parallaxX.set(x * 20);
    parallaxY.set(y * 16);
  };

  return (
    <div ref={containerRef} className="relative py-10 [perspective:1000px]">
      <motion.div
        className="relative mx-auto min-h-[660px] max-w-6xl overflow-visible rounded-[2.2rem] border border-emerald-500/25 bg-neutral-950/70 p-5 backdrop-blur-sm sm:p-8"
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setPointerActive(true)}
        onPointerLeave={() => {
          setPointerActive(false);
          parallaxX.set(0);
          parallaxY.set(0);
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.98, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_55%)]" />

        <motion.div
          className="relative h-[540px] w-full overflow-visible"
          style={{
            transformStyle: "preserve-3d",
            x: pointerActive && !reduceMotion && showFinal ? parallaxX : 0,
            y: pointerActive && !reduceMotion && showFinal ? parallaxY : 0,
          }}
        >
          <motion.div
            className="absolute left-1/2 top-8 z-[32] h-56 w-[82%] max-w-xl -translate-x-1/2 rounded-2xl border border-emerald-200/40 bg-[#f7f2e8] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
            style={{ rotate: "-2deg", translateZ: "60px" }}
            initial={{ opacity: 0, y: 14, rotate: -3, scale: 0.98 }}
            animate={paperControls}
          >
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-[2px] rounded bg-neutral-700/25" />
              ))}
              <svg className="mt-2 h-20 w-full" viewBox="0 0 500 120" fill="none">
                <path
                  d="M20 50 C70 20, 140 85, 210 48 C290 12, 350 80, 470 36"
                  stroke="rgba(35,35,35,0.55)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M18 80 C90 55, 180 100, 255 65 C315 39, 398 92, 472 70"
                  stroke="rgba(35,35,35,0.42)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-14 z-[24] flex h-60 w-[86%] max-w-xl -translate-x-1/2 flex-wrap content-start justify-center gap-2"
            style={{ translateZ: "35px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showAsh ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {ashParticles.map((particle) => (
              <motion.span
                key={particle.id}
                className="rounded-full shadow-[0_0_6px_rgba(16,185,129,0.55)]"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: "rgba(16,185,129,0.85)",
                }}
                initial={{ opacity: 0, scale: 0.35, x: 0, y: 0, rotate: 0 }}
                animate={
                showAsh
                  ? {
                      opacity: [1, 0.9, 0],
                      scale: [1.12, 1, 0.3],
                      x: particle.x,
                      y: particle.y,
                      rotate: particle.rotate,
                    }
                  : { opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }
                }
                transition={{
                  delay: particle.delay,
                  duration: particle.duration,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className={`absolute bottom-6 left-1/2 z-[26] w-[92%] max-w-3xl -translate-x-1/2 rounded-[1.75rem] border border-neutral-700 bg-gradient-to-b from-neutral-800 to-neutral-900 px-4 py-4 shadow-[0_30px_60px_rgba(0,0,0,0.45)] sm:px-6 ${lockedFinal ? "pointer-events-none" : ""}`}
            initial={{ opacity: 0, y: 40, scale: 0.95, translateZ: 42 }}
            animate={keyboardControls}
          >
            <div className="space-y-2.5">
              {KEYBOARD_ROWS.map((count, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: count }).map((_, keyIdx) => (
                    <motion.div
                      key={`${rowIdx}-${keyIdx}`}
                      className="h-6 rounded-md border border-neutral-600/80 bg-neutral-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:h-7"
                      animate={
                        reduceMotion || (!showAsh && !showNeuralMotion && !showFinal)
                          ? { opacity: 0.9 }
                          : showAsh || showNeuralMotion
                            ? {
                                opacity: [0.88, 1, 0.9],
                                boxShadow: [
                                  "0 0 0 rgba(16,185,129,0)",
                                  "0 0 14px rgba(16,185,129,0.45)",
                                  "0 0 0 rgba(16,185,129,0)",
                                ],
                                backgroundColor: [
                                  "rgb(38 38 38)",
                                  "rgba(16,185,129,0.55)",
                                  "rgb(38 38 38)",
                                ],
                              }
                            : { opacity: 0.85 }
                      }
                      transition={{
                        duration: 1,
                        repeat:
                          showAsh || showNeuralMotion ? Number.POSITIVE_INFINITY : 0,
                        repeatDelay: 0.55,
                        delay: keyPulseDelays[rowIdx][keyIdx],
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="mx-auto mt-4 h-2.5 w-36 rounded-full bg-neutral-700/70 sm:w-44" />
            <div className="mx-auto mt-2 h-12 w-48 rounded-2xl border border-neutral-600/70 bg-neutral-800/85 sm:h-14 sm:w-56" />
          </motion.div>

          <svg
            className="pointer-events-none absolute inset-0 z-[30] h-full w-full overflow-visible"
            viewBox="0 0 1000 640"
            preserveAspectRatio="xMidYMid meet"
          >
            {NEURAL_PATHS.map((d, idx) => (
              <motion.path
                key={idx}
                d={d}
                stroke={EMERALD}
                strokeOpacity={1}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="12 16"
                fill="none"
                initial={{ opacity: 0, pathLength: 0, strokeDashoffset: 0 }}
                animate={streamControls}
                style={{
                  filter: showNeuralMotion ? "drop-shadow(0 0 6px rgba(16,185,129,0.7))" : "none",
                }}
                transition={{
                  pathLength: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.35 },
                }}
              />
            ))}
          </svg>

          <motion.div
            className="absolute left-1/2 top-2 z-[36] w-[94%] max-w-5xl -translate-x-1/2 overflow-visible rounded-3xl border border-emerald-500/30 bg-neutral-950 p-4 emerald-glow sm:p-6"
            style={{ willChange: "transform, opacity" }}
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 36,
              filter: "blur(6px)",
              clipPath: "inset(100% 0% 0% 0%)",
              translateZ: 12,
            }}
            animate={dashboardControls}
          >
            <motion.span
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent"
              initial={{ x: "-100%" }}
              animate={showFinal ? { x: ["0%", "520%"] } : { x: "-100%" }}
              transition={{ duration: 1.25, ease: "easeInOut", delay: 0.2 }}
            />

            <div className="relative z-20 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-400">El Kaiser Dashboard</p>
                <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                  Automated Operations + Finance
                </h3>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(16,185,129,0.45)" }}
                whileTap={{ scale: 0.98 }}
                className="relative z-30 cursor-pointer rounded-full border border-emerald-400/50 bg-black/40 px-3 py-1 text-xs font-medium text-emerald-300"
              >
                Live Preview
              </motion.button>
            </div>

            <div className="relative z-20 grid gap-3 sm:grid-cols-3">
              {METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-3"
                >
                  <p className="text-xs text-neutral-400">{metric.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">
                    <RollingValue
                      target={metric.target}
                      suffix={metric.suffix}
                      decimals={metric.decimals}
                      active={lockedFinal}
                    />
                  </p>
                </div>
              ))}
            </div>

            <div className="relative z-20 mt-4 h-56 rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black p-4 sm:h-64">
              <div className="flex h-full items-end gap-2">
                {BAR_VALUES.map((value, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-1 rounded-t-md bg-emerald-400/85"
                    initial={{ height: 0 }}
                    animate={{ height: lockedFinal ? `${value}%` : "0%" }}
                    transition={{
                      delay: lockedFinal ? 0.12 + idx * 0.05 : 0,
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
