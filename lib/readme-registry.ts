export type ProjectReadmeId = "massive-ai" | "premium-content-hub" | "revolut-notion" | "skills-box";

/** Every id the UI and `/api/readme/[projectId]` allow. */
export const README_PROJECT_IDS: ProjectReadmeId[] = [
  "massive-ai",
  "premium-content-hub",
  "revolut-notion",
  "skills-box",
];

/** Server-side: maps each project to the env variable holding `owner/repo` or `owner/repo@branch`. */
export const README_GITHUB_REPO_ENV: Record<ProjectReadmeId, string> = {
  "massive-ai": "README_REPO_MASSIVE_AI",
  "premium-content-hub": "README_REPO_PREMIUM_CONTENT_HUB",
  "revolut-notion": "README_REPO_REVOLUT_NOTION",
  "skills-box": "README_REPO_SKILLS_BOX",
};

export function isProjectReadmeId(id: string): id is ProjectReadmeId {
  return README_PROJECT_IDS.includes(id as ProjectReadmeId);
}

/** Server-side: env key for a custom readme path inside the repo (defaults to `README.md`). */
export function readmeCustomPathEnv(projectId: ProjectReadmeId): string {
  return `README_PATH_${projectId.toUpperCase().replace(/-/g, "_")}`;
}
