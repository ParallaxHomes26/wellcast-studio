import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

const apiKey = process.env["ANTHROPIC_API_KEY"];

if (!apiKey) {
  logger.warn("ANTHROPIC_API_KEY is not set — AI routes will fail");
}

export const anthropic = new Anthropic({ apiKey: apiKey ?? "" });

export async function callClaude(
  prompt: string,
  maxTokens = 4096
): Promise<unknown> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  if (response.stop_reason === "max_tokens") {
    logger.warn(
      { maxTokens, textLength: text.length, promptLength: prompt.length },
      "Claude hit max_tokens — response was truncated"
    );
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    logger.error(
      { responsePreview: text.slice(0, 500) },
      "Claude returned no JSON object"
    );
    throw new Error(
      `Claude returned no JSON. Response preview: ${text.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (parseErr) {
    logger.error(
      {
        err: parseErr,
        jsonPreview: jsonMatch[0].slice(-300),
        stopReason: response.stop_reason,
        maxTokens,
        textLength: text.length,
      },
      "Failed to parse Claude JSON — likely truncated by max_tokens"
    );
    throw new Error(
      `Claude JSON parse failed (stop_reason: ${response.stop_reason}). Try again — if this persists, the prompt response is too long.`
    );
  }
}
