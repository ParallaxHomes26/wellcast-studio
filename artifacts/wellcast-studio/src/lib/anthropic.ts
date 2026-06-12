import type { EpisodeBrief } from "@/types";

export async function generateAssets(
  brief: EpisodeBrief,
  cta: string
): Promise<Record<string, string>> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief, cta }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error ?? `Request failed with status ${response.status}`);
  }

  return response.json();
}
