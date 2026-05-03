import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  code: z.string().min(1).max(20000),
  language: z.string().min(1).max(40),
  outputLang: z.enum(["en", "bn"]),
});

export const analyzeCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured." };
    }

    const langInstruction =
      data.outputLang === "bn"
        ? "Reply ENTIRELY in Bangla (Bengali script). Use simple, friendly language a beginner can understand. Keep code, identifiers and short technical terms in English."
        : "Reply in clear, friendly English a beginner can understand.";

    const system = `You are CodeSense AI, a patient mentor for beginner programmers. ${langInstruction}

Always respond using this exact markdown structure:

## 🧠 Summary
One or two sentences explaining what the code is trying to do.

## 🔍 Step-by-step Explanation
Walk through the code in plain language. Use a numbered list.

## 🐞 Bugs & Issues
List bugs or risky patterns. If none, say "No obvious bugs found.".

## 💡 Suggestions
Concrete ways to improve readability, performance, or correctness.

## 📚 Concepts to Learn
Bullet list of 2-4 programming concepts the learner should explore next.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: system },
            {
              role: "user",
              content: `Language: ${data.language}\n\nCode:\n\`\`\`${data.language}\n${data.code}\n\`\`\``,
            },
          ],
        }),
      });

      if (res.status === 429)
        return { ok: false as const, error: "Rate limit reached. Please wait a moment and try again." };
      if (res.status === 402)
        return { ok: false as const, error: "AI credits exhausted. Add credits in workspace settings." };
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "The AI service is unavailable right now." };
      }
      const json = await res.json();
      const content: string = json.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, content };
    } catch (e) {
      console.error("analyzeCode failed", e);
      return { ok: false as const, error: "Something went wrong while analyzing." };
    }
  });