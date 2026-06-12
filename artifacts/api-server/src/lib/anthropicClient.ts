import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

const apiKey = process.env["ANTHROPIC_API_KEY"];

if (!apiKey) {
  logger.warn("ANTHROPIC_API_KEY is not set — AI routes will fail");
}

export const anthropic = new Anthropic({ apiKey: apiKey ?? "" });

export async function callClaude(prompt: string, maxTokens = 1500): Promise<unknown> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Claude returned no JSON. Response: ${text.slice(0, 200)}`);
  }

  return JSON.parse(jsonMatch[0]);
}
