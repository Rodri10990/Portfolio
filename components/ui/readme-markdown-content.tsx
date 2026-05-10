"use client";

import type { ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import nightOwl from "react-syntax-highlighter/dist/esm/styles/prism/night-owl";

const night = nightOwl as Record<string, React.CSSProperties>;

const emeraldPrismWrap: Record<string, React.CSSProperties> = {
  ...night,
  keyword: { ...(night.keyword ?? {}), color: "#10b981" },
  string: { ...(night.string ?? {}), color: "#6ee7b7" },
  function: { ...(night.function ?? {}), color: "#2dd4bf" },
  property: { ...(night.property ?? {}), color: "#34d399" },
  number: { ...(night.number ?? {}), color: "#34d399" },
};

const headingClass = "mt-8 font-semibold text-[#10b981] first:mt-0";
const proseBody = "text-zinc-300";

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  return "";
}

const markdownComponents: Partial<Components> = {
  h1: ({ children }) => <h1 className={`${headingClass} text-2xl`}>{children}</h1>,
  h2: ({ children }) => <h2 className={`${headingClass} text-xl`}>{children}</h2>,
  h3: ({ children }) => <h3 className={`${headingClass} text-lg`}>{children}</h3>,
  h4: ({ children }) => <h4 className={`${headingClass} text-base`}>{children}</h4>,
  h5: ({ children }) => <h5 className={`${headingClass} text-sm`}>{children}</h5>,
  h6: ({ children }) => <h6 className={`${headingClass} text-xs`}>{children}</h6>,
  p: ({ children }) => <p className={`my-4 text-base leading-relaxed ${proseBody}`}>{children}</p>,
  a: ({ children, href }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      className="break-words text-[#10b981] underline decoration-emerald-500/50 underline-offset-2 hover:decoration-emerald-400"
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className={`my-4 list-disc pl-6 ${proseBody}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`my-4 list-decimal pl-6 ${proseBody}`}>{children}</ol>,
  li: ({ children }) => <li className="my-1.5 pl-1 marker:text-emerald-500">{children}</li>,
  hr: () => <hr className="my-8 border-t border-emerald-500/20" />,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-emerald-500/50 pl-4 text-zinc-400 italic">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-emerald-500/20">
      <table className="w-full border-collapse text-left text-sm text-zinc-300">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-emerald-500/20 bg-zinc-900 px-3 py-2 font-medium text-emerald-400">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-emerald-500/15 px-3 py-2 text-zinc-300">{children}</td>
  ),
  code: ({ className, children }) => {
    const txt = extractText(children).replace(/\n$/, "");
    const match = /language-([\w-]+)/.exec(className ?? "");

    if (match) {
      return (
        <SyntaxHighlighter
          style={emeraldPrismWrap}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: "1rem 0",
            padding: "1rem 1rem",
            borderRadius: "0.5rem",
            background: "#18181b",
            border: "1px solid rgba(16, 185, 129, 0.28)",
            fontSize: "0.85rem",
            lineHeight: 1.6,
          }}
        >
          {txt}
        </SyntaxHighlighter>
      );
    }

    return (
      <code className="readme-md-inline rounded bg-[#27272a] px-1.5 py-0.5 font-mono text-[0.9em] font-medium text-emerald-300 ring-1 ring-emerald-500/25">
        {children}
      </code>
    );
  },
};

type ReadmeMarkdownContentProps = {
  markdown: string;
};

/** Markdown README body with emerald-forward typography inside the modal. */
export function ReadmeMarkdownContent({ markdown }: ReadmeMarkdownContentProps) {
  return (
    <div className="readme-md font-terminal text-[0.9375rem] md:text-[0.9625rem]">
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </Markdown>
    </div>
  );
}
