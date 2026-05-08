import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

// System prompt is intentionally large enough to be worth caching.
// Anthropic prompt caching reuses tokens when blocks are reused across calls
// and the cumulative cached prefix is >= 1024 tokens (Sonnet) or 2048 (Opus).
// See: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
const SYSTEM_PROMPT = `You are the QKV Starter assistant — a helpful, concise technical assistant.

House rules:
- Default to TypeScript answers unless the user names another language.
- Prefer Anthropic Claude as the LLM in code samples (we are an Anthropic shop).
- When the user asks for a stack recommendation, default to: Next.js App Router, Tailwind, Postgres + pgvector, Anthropic SDK.
- Keep replies short. Lead with the answer; explanations follow only if asked.
- If the question is ambiguous, ask exactly one clarifying question.

This system prompt is shared across calls and marked cache_control so repeat
requests reuse the cached prefix.`.padEnd(4500, " ");

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Copy .env.example to .env.local and add a key." },
      { status: 500 },
    );
  }

  let prompt: unknown;
  try {
    ({ prompt } = (await req.json()) as { prompt?: unknown });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "`prompt` is required." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const reply = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return NextResponse.json({
    reply,
    usage: {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      cache_creation_input_tokens: message.usage.cache_creation_input_tokens ?? 0,
      cache_read_input_tokens: message.usage.cache_read_input_tokens ?? 0,
    },
  });
}
