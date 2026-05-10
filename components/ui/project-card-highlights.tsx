type ProjectHighlights = {
  impact?: string;
  coreValue?: string;
  stack?: string;
};

type ProjectCardHighlightsProps = {
  highlights: ProjectHighlights;
};

const rows: { key: keyof ProjectHighlights; label: string }[] = [
  { key: "impact", label: "Impact" },
  { key: "coreValue", label: "Core value" },
  { key: "stack", label: "Stack" },
];

export function ProjectCardHighlights({ highlights }: ProjectCardHighlightsProps) {
  const items = rows.filter(({ key }) => highlights[key]?.trim());

  if (items.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5 sm:px-3.5">
      <ul className="space-y-2 sm:space-y-2.5">
        {items.map(({ key, label }) => (
          <li key={key}>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400/95">{label}</p>
            <p className="mt-1 text-sm leading-snug text-neutral-200">{highlights[key]}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { ProjectHighlights };
