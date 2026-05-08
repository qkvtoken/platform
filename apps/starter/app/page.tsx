"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("In one sentence, what is pgvector?");
  const [reply, setReply] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setPending(true);
    setError(null);
    setReply("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setReply(data.reply ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">QKV Starter</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Next.js + Tailwind + Anthropic. Edit{" "}
          <code className="rounded bg-neutral-200/60 px-1 py-0.5 text-xs dark:bg-neutral-800">
            apps/starter/app/page.tsx
          </code>{" "}
          to start a client demo.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <label className="text-sm font-medium" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          id="prompt"
          className="min-h-24 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="button"
          onClick={send}
          disabled={pending || prompt.trim().length === 0}
          className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          {pending ? "Asking Claude…" : "Ask Claude"}
        </button>
      </section>

      {error && (
        <pre className="whitespace-pre-wrap rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </pre>
      )}

      {reply && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Reply</h2>
          <pre className="whitespace-pre-wrap rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900">
            {reply}
          </pre>
        </section>
      )}
    </main>
  );
}
