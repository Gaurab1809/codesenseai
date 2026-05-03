import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const Body = z.object({
  code: z.string().min(1).max(20000),
  language: z.string().min(1).max(40),
  outputLang: z.enum(["en", "bn"]),
  mode: z.enum(["explain", "bugs", "optimize", "security", "bangla"]).default("explain"),
});

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        const token = auth.slice(7);
        const SUPABASE_URL = process.env.SUPABASE_URL!;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const sb = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claims, error: claimsErr } = await sb.auth.getClaims(token);
        if (claimsErr || !claims?.claims?.sub) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        let body: z.infer<typeof Body>;
        try {
          body = Body.parse(await request.json());
        } catch {
          return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });
        }

        const langInstruction =
          body.outputLang === "bn"
            ? "Reply ENTIRELY in Bangla (Bengali script). Use simple, friendly language a beginner can understand. Keep code, identifiers, and short technical terms in English."
            : "Reply in clear, friendly English a beginner can understand.";

        const modePrompts: Record<string, string> = {
          explain: `Always respond using this exact markdown structure:

## 🧠 Summary
One or two sentences explaining what the code is trying to do.

## 🔍 Step-by-step Explanation
Walk through the code in plain language. Use a numbered list.

## 🐞 Bugs & Issues
List bugs or risky patterns. If none, say "No obvious bugs found.".

## 💡 Suggestions
Concrete ways to improve readability, performance, or correctness.

## 📚 Concepts to Learn
Bullet list of 2-4 programming concepts the learner should explore next.`,
          bugs: `Focus ONLY on bug detection. Use this structure:

## 🐞 Bugs Found
For each bug: a short title, the impacted line(s), why it's a bug, and a fixed code snippet in a fenced block. If none, say "No obvious bugs found.".

## ⚠️ Risky Patterns
Edge cases, off-by-one risks, async pitfalls, missing error handling.

## ✅ Quick Fix Checklist
Bulleted, actionable items.`,
          optimize: `Focus on performance and clarity. Use this structure:

## ⚡ Complexity
Current Big-O for time and space.

## 🚀 Optimizations
Numbered list with concrete refactors. Include a fenced code block for the improved version.

## 🧹 Readability
Naming, structure, and idiomatic improvements.`,
          security: `Focus on security. Use this structure:

## 🔒 Security Findings
For each issue: title, severity (Low/Medium/High/Critical), why it's risky, and a fixed snippet.

## 🛡️ Hardening Tips
Bullet list of best practices that apply to this code.

## ✅ Safe Pattern
A fenced code block showing a safer alternative.`,
          bangla: `Reply ENTIRELY in Bangla (Bengali script). Translate the explanation, bugs, and suggestions into friendly beginner Bangla. Use this structure:

## 🧠 সারাংশ
## 🔍 ধাপে-ধাপে ব্যাখ্যা
## 🐞 বাগ ও সমস্যা
## 💡 পরামর্শ
## 📚 শেখার বিষয়`,
        };

        const modeKey = body.mode === "bangla" ? "bangla" : body.mode;
        const system = `You are CodeSense AI, a patient mentor for beginner programmers. ${body.mode === "bangla" ? "" : langInstruction}

${modePrompts[modeKey]}`;

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: system },
                {
                  role: "user",
                  content: `Language: ${body.language}\n\nCode:\n\`\`\`${body.language}\n${body.code}\n\`\`\``,
                },
              ],
            }),
          });
          if (res.status === 429)
            return new Response(JSON.stringify({ error: "Rate limit reached. Please wait and try again." }), { status: 429 });
          if (res.status === 402)
            return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), { status: 402 });
          if (!res.ok) {
            const t = await res.text();
            console.error("AI gateway error", res.status, t);
            return new Response(JSON.stringify({ error: "AI service unavailable" }), { status: 502 });
          }
          const json = await res.json();
          const content: string = json.choices?.[0]?.message?.content ?? "";
          return new Response(JSON.stringify({ content }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("analyze error", e);
          return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
        }
      },
    },
  },
});