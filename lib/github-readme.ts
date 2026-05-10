import { join } from "path";

/** If `input` looks like a GitHub repo URL, return `owner/repo`; otherwise null. Query/hash segments are ignored. */
function slugFromGithubRepoUrl(input: string): string | null {
  try {
    if (!/^https?:\/\//i.test(input)) return null;
    const url = new URL(input);
    if (url.hostname.toLowerCase() !== "github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

export type ParsedGithubRepoSpec = {
  owner: string;
  repo: string;
  /** Set only when the spec used `owner/repo@branch` (URL or shorthand). */
  explicitBranch: string | null;
};

/**
 * Parses `owner/repo`, `owner/repo@branch`, or a full repo URL (`https://github.com/owner/repo...`).
 * Query strings and fragments (e.g. `?tab=readme-ov-file`) are ignored.
 * Branch resolution (`main` vs default branch) is done separately via the GitHub API.
 */
export function parseGithubRepoSpec(raw: string): ParsedGithubRepoSpec | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let slug = slugFromGithubRepoUrl(trimmed) ?? trimmed;

  let explicitBranch: string | null = null;
  const atIdx = slug.lastIndexOf("@");
  if (atIdx > 0 && atIdx < slug.length - 1) {
    const b = slug.slice(atIdx + 1).trim();
    explicitBranch = b || null;
    slug = slug.slice(0, atIdx).trim();
  }

  const segments = slug.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const [owner, repo] = segments;

  return { owner, repo, explicitBranch };
}

/** Authorization header value for GitHub REST API and raw — classic PAT uses `token`, fine-grained uses `Bearer`. */
export function githubAuthorizationValue(token: string): string {
  const t = token.trim();
  if (!t) return "";
  return t.startsWith("github_pat_") ? `Bearer ${t}` : `token ${t}`;
}

/**
 * Resolves the repo default branch (e.g. `master` vs `main`). Returns null if the repo is missing,
 * private without auth, or the request fails.
 */
export async function fetchGithubDefaultBranch(
  owner: string,
  repo: string,
  headers: HeadersInit,
  revalidateSeconds: number,
): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
      headers: {
        ...headers,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { default_branch?: string };
    const b = data.default_branch?.trim();
    return b || null;
  } catch {
    return null;
  }
}

export function rawGithubReadmeUrl(owner: string, repo: string, branch: string, path = "README.md") {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/** Fallback sample README path under `/public/readmes/` (no leading slash). */
export function bundledReadmeFilePath(projectId: string) {
  return join(process.cwd(), "public", "readmes", `${projectId}.md`);
}
