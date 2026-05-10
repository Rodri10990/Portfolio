import {
  bundledReadmeFilePath,
  fetchGithubDefaultBranch,
  githubAuthorizationValue,
  parseGithubRepoSpec,
  rawGithubReadmeUrl,
} from "@/lib/github-readme";
import {
  README_GITHUB_REPO_ENV,
  readmeCustomPathEnv,
  README_PROJECT_IDS,
  type ProjectReadmeId,
} from "@/lib/readme-registry";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";

export const revalidate = 300;

export const runtime = "nodejs";

function resolveGithubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "text/plain,text/markdown;q=0.9,*/*;q=0.8",
    "User-Agent": "portfolio-readme-fetch/1",
  };

  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    const auth = githubAuthorizationValue(token);
    if (auth) headers.Authorization = auth;
  }

  return headers;
}

async function loadBundledMarkdown(projectId: ProjectReadmeId): Promise<string | null> {
  try {
    return await readFile(bundledReadmeFilePath(projectId), "utf-8");
  } catch {
    return null;
  }
}

function readmePathCandidates(configured: string): string[] {
  const path = configured.replace(/^\//, "") || "README.md";
  if (path.toLowerCase() !== "readme.md") return [path];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of ["README.md", "readme.md", "Readme.md"]) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

async function fetchFromGithub(
  projectId: ProjectReadmeId,
): Promise<{ text: string; repoPage: string } | null> {
  try {
    const envName = README_GITHUB_REPO_ENV[projectId];
    const spec = process.env[envName]?.trim();

    if (!spec) return null;

    const parsed = parseGithubRepoSpec(spec);
    if (!parsed) return null;

    const repoPage = `https://github.com/${parsed.owner}/${parsed.repo}`;
    const ghHeaders = resolveGithubHeaders();
    const envBranch = process.env.README_GITHUB_BRANCH?.trim();
    const branch =
      parsed.explicitBranch ||
      envBranch ||
      (await fetchGithubDefaultBranch(parsed.owner, parsed.repo, ghHeaders, revalidate)) ||
      "main";

    const configuredPath =
      process.env[readmeCustomPathEnv(projectId)]?.trim()?.replace(/^\//, "") || "README.md";

    for (const path of readmePathCandidates(configuredPath)) {
      const url = rawGithubReadmeUrl(parsed.owner, parsed.repo, branch, path);
      const res = await fetch(url, { headers: ghHeaders, next: { revalidate } });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.length > 0) return { text, repoPage };
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;

  if (!README_PROJECT_IDS.includes(projectId as ProjectReadmeId)) {
    return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  }

  const id = projectId as ProjectReadmeId;

  const gh = await fetchFromGithub(id);
  if (gh !== null && gh.text.length > 0) {
    return new NextResponse(gh.text, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "private, max-age=0, s-maxage=300, stale-while-revalidate=600",
        "X-Readme-GitHub-Url": gh.repoPage,
      },
    });
  }

  const bundled = await loadBundledMarkdown(id);
  if (bundled !== null) {
    return new NextResponse(bundled, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "private, max-age=0",
      },
    });
  }

  return NextResponse.json(
    {
      error:
        "No README loaded. Set README_REPO_* for this card, or add public/readmes/{id}.md. Private GitHub repos need GITHUB_TOKEN on the server (and the correct default branch or README path).",
    },
    { status: 404 },
  );
}
