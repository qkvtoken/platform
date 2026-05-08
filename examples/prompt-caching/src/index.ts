/**
 * Anthropic prompt caching demo.
 *
 * Runs two calls back-to-back with the same large system prompt:
 *   1. First call → cache MISS, tokens are written to cache.
 *      Expect `cache_creation_input_tokens` > 0.
 *   2. Second call → cache HIT, tokens are read from cache (~10% the cost).
 *      Expect `cache_read_input_tokens` > 0.
 *
 * The cached prefix must reach a minimum size: 1024 tokens for Sonnet/Haiku,
 * 2048 tokens for Opus. The "library" string below is padded so we cross the
 * Sonnet threshold without depending on a real document.
 *
 * Docs: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
 *
 * Run:
 *   ANTHROPIC_API_KEY=sk-ant-... pnpm example:caching
 */
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

// Synthetic "internal knowledge base" — represents the kind of large, stable
// context (style guide, schema, framework docs) we would cache in a real app.
const KNOWLEDGE_BASE = `
QKV INTERNAL KNOWLEDGE BASE (synthetic, for demo only)
======================================================

# Stack defaults
- Language: TypeScript for app code; Python only when the AI/ML library forces it.
- Frontend: Next.js App Router + Tailwind. Vercel for prototype hosting.
- AI: Anthropic Claude is primary. OpenAI / open-weights only when a client requires it.
- Vector / retrieval: Postgres + pgvector. Move to a dedicated vector DB only with measured reason.
- Auth: Clerk or Auth.js. Don't roll your own.
- Infra: cheapest thing that works for prototypes. Document the production migration path; don't pre-build it.

# Engineering principles
- Working software over docs.
- Smallest thing that proves the idea.
- Comment the WHY, not the WHAT.
- Test the change, not the world.
- Don't pre-build for hypothetical clients.
${"\n# Padding section (synthetic, present only to push the cached prefix above the 1024-token Sonnet threshold).\n".repeat(30)}
`.trim();

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const ask = async (label: string, question: string) => {
    const start = Date.now();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      system: [
        {
          type: "text",
          text: KNOWLEDGE_BASE,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: question }],
    });
    const ms = Date.now() - start;
    const u = res.usage;
    console.log(`\n[${label}] (${ms}ms)`);
    console.log(`  input_tokens:                 ${u.input_tokens}`);
    console.log(`  output_tokens:                ${u.output_tokens}`);
    console.log(`  cache_creation_input_tokens:  ${u.cache_creation_input_tokens ?? 0}`);
    console.log(`  cache_read_input_tokens:      ${u.cache_read_input_tokens ?? 0}`);
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    console.log(`  reply:                        ${text.slice(0, 120).replace(/\s+/g, " ")}…`);
  };

  console.log(`Model: ${MODEL}`);
  await ask("call 1 — expect cache CREATION", "What's our default vector DB and why?");
  await ask("call 2 — expect cache READ", "What's our default frontend stack?");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
