"use client";

import { type ProjectReadmeId } from "@/lib/readme-registry";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ReadmePhase = "closed" | "loading" | "ready" | "error";

type ReadmeModalContextValue = {
  openReadme: (projectId: ProjectReadmeId) => void;
  closeReadme: () => void;
  phase: ReadmePhase;
  projectId: ProjectReadmeId | null;
  markdown: string | null;
  error: string | null;
  /** Present when markdown was fetched from GitHub (header from `/api/readme/*`). */
  sourceRepoUrl: string | null;
};

const ReadmeModalContext = createContext<ReadmeModalContextValue | null>(null);

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function fetchReadmeFromApi(projectId: ProjectReadmeId): Promise<{
  markdown: string;
  repoPage: string | null;
}> {
  const url = new URL(`/api/readme/${projectId}`, window.location.origin).toString();
  const res = await fetch(url, { credentials: "same-origin" });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    let message = `Could not load README (${res.status}).`;

    if (contentType.includes("application/json")) {
      try {
        const body = (await res.json()) as { error?: string };
        if (body?.error) message = body.error;
      } catch {
        /* ignore */
      }
    }

    throw new Error(message);
  }

  const repoPage = res.headers.get("X-Readme-GitHub-Url");
  const markdown = await res.text();

  return { markdown, repoPage: repoPage && repoPage.length > 0 ? repoPage : null };
}

export function ReadmeModalProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<ReadmePhase>("closed");
  const [projectId, setProjectId] = useState<ProjectReadmeId | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceRepoUrl, setSourceRepoUrl] = useState<string | null>(null);

  const closeReadme = useCallback(() => {
    setPhase("closed");
    setProjectId(null);
    setMarkdown(null);
    setError(null);
    setSourceRepoUrl(null);
  }, []);

  const openReadme = useCallback((id: ProjectReadmeId) => {
    setProjectId(id);
    setMarkdown(null);
    setError(null);
    setSourceRepoUrl(null);
    setPhase("loading");

    void (async () => {
      try {
        const results = await Promise.all([delay(600), fetchReadmeFromApi(id)]);
        const { markdown: text, repoPage } = results[1];
        setMarkdown(text);
        setSourceRepoUrl(repoPage);
        setPhase("ready");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load README.");
        setPhase("error");
      }
    })();
  }, []);

  useEffect(() => {
    if (phase === "closed") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  const value = useMemo(
    (): ReadmeModalContextValue => ({
      openReadme,
      closeReadme,
      phase,
      projectId,
      markdown,
      error,
      sourceRepoUrl,
    }),
    [closeReadme, error, markdown, openReadme, phase, projectId, sourceRepoUrl],
  );

  return <ReadmeModalContext.Provider value={value}>{children}</ReadmeModalContext.Provider>;
}

export function useReadmeModal() {
  const ctx = useContext(ReadmeModalContext);
  if (!ctx) {
    throw new Error("useReadmeModal must be used within ReadmeModalProvider.");
  }
  return ctx;
}
