"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

const DISPLAY_NAME = "Rodrigo Massi";

/** Segments typed as one logical line (`charIndex` runs on `full`). */
const WELCOME_BEFORE = "> Welcome to ";
const WELCOME_AFTER = "'s workspace.";
const WELCOME_FULL = `${WELCOME_BEFORE}${DISPLAY_NAME}${WELCOME_AFTER}`;

const SCRIPT_LINES = [
  "root@portfolio:~# ./load_profile.sh",
  "> [INFO] Booting Full-Stack Developer profile...",
  "> [LOAD] Extracting background: Operations Management (5.5 years)... [OK]",
  "> [LOAD] Initializing stack: React Native, Python, Next.js, Google Cloud, Supabase... [READY]",
  "> [LOAD] Starting automation engine: n8n automation engine (Self-Hosted on GCP)... [READY]",
  "> [EXEC] Compiling problem-solving capabilities... 100%",
  "> System Ready. ",
  WELCOME_FULL,
];

const NAME_START = WELCOME_BEFORE.length;
const NAME_END = NAME_START + DISPLAY_NAME.length;

function welcomeLineContent(typedLength: number): ReactNode {
  const slice = WELCOME_FULL.slice(0, typedLength);

  const parts: ReactNode[] = [];

  if (slice.length === 0) {
    return formatTerminalLine("");
  }

  if (slice.length <= NAME_START) {
    return slice;
  }

  parts.push(slice.slice(0, NAME_START));

  if (slice.length <= NAME_END) {
    parts.push(
      <span key="name" className="font-bold text-emerald-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.45)]">
        {slice.slice(NAME_START)}
      </span>,
    );
    return <>{parts}</>;
  }

  parts.push(
    <span key="name" className="font-bold text-emerald-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.45)]">
      {DISPLAY_NAME}
    </span>,
  );
  parts.push(slice.slice(NAME_END));
  return <>{parts}</>;
}

function formatTerminalLine(raw: string) {
  return raw.startsWith(">") ? raw : `> ${raw}`;
}

export function AnimatedTerminal() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= SCRIPT_LINES.length) return;

    const currentLine = SCRIPT_LINES[lineIndex];
    const isLineComplete = charIndex >= currentLine.length;
    const timeout = setTimeout(
      () => {
        if (isLineComplete) {
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
          return;
        }
        setCharIndex((prev) => prev + 1);
      },
      isLineComplete ? 320 : 35,
    );

    return () => clearTimeout(timeout);
  }, [lineIndex, charIndex]);

  const visibleRows = useMemo(() => {
    const welcomeIdx = SCRIPT_LINES.length - 1;
    const rows: { key: string; node: ReactNode }[] = [];

    for (let idx = 0; idx < SCRIPT_LINES.length; idx++) {
      const raw = SCRIPT_LINES[idx];

      if (idx < lineIndex) {
        rows.push({
          key: `line-${idx}-done`,
          node: idx === welcomeIdx ? welcomeLineContent(raw.length) : formatTerminalLine(raw),
        });
        continue;
      }

      if (idx === lineIndex) {
        if (idx === welcomeIdx) {
          rows.push({
            key: `line-${idx}-${charIndex}`,
            node: welcomeLineContent(charIndex),
          });
        } else {
          rows.push({
            key: `line-${idx}-${charIndex}`,
            node: formatTerminalLine(raw.slice(0, charIndex)),
          });
        }
      }
      break;
    }

    return rows;
  }, [lineIndex, charIndex]);

  return (
    <div className="emerald-glow rounded-2xl border border-emerald-500/30 bg-neutral-950/95 p-4 sm:p-5 md:p-6">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
      </div>

      <div className="space-y-2 font-mono text-[11px] text-emerald-400 sm:text-sm md:text-base">
        {visibleRows.map((row) => (
          <p key={row.key} className="leading-relaxed whitespace-pre-wrap break-words">
            {row.node}
          </p>
        ))}
        <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
      </div>
    </div>
  );
}
