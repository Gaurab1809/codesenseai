import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const Body = z.object({
  code: z.string().min(1).max(20000),
  language: z.string().min(1).max(40),
  outputLang: z.enum(["en", "bn"]).default("en"),
  count: z.number().int().min(3).max(8).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const Route = createFileRoute("/api/quiz")({
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
        if (!apiKey) return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500 });

        const langInstr = body.outputLang === "bn"
          ? "Write all questions and explanations in Bangla (Bengali script). Keep code/identifiers in English."
          : "Write in clear, beginner-friendly English.";

        const diffInstr = body.difficulty === "easy"
          ? "Target absolute beginners. Focus on naming, syntax, and reading the code. Distractors should be obviously wrong."
          : body.difficulty === "hard"
          ? "Target advanced learners. Include subtle edge cases, complexity analysis, and tricky predict-the-output questions. Distractors must be plausible."
          : "Target intermediate learners with a balanced mix of concept and prediction questions.";

        const system = `You are a programming quiz author. Create high-quality multiple-choice and prediction questions from the given code. ${langInstr}
Difficulty: ${body.difficulty}. ${diffInstr}
Mix question types: concept understanding, predict-the-output, and bug spotting.
Return ONLY via the provided tool call.`;

        const tools = [{
          type: "function",
          function: {
            name: "make_quiz",
            description: "Return a quiz",
            parameters: {
              type: "object",
              properties: {
                topic: { type: "string", description: "Short topic label" },
                questions: {
                  type: "array",
                  minItems: body.count,
                  maxItems: body.count,
                  items: {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["mcq", "predict"] },
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 4 },
                      answerIndex: { type: "integer", minimum: 0, maximum: 3 },
                      explanation: { type: "string" },
                    },
                    required: ["type", "question", "options", "answerIndex", "explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["topic", "questions"],
              additionalProperties: false,
            },
          },
        }];

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: system },
                { role: "user", content: `Language: ${body.language}\nCount: ${body.count}\n\nCode:\n\`\`\`${body.language}\n${body.code}\n\`\`\`` },
              ],
              tools,
              tool_choice: { type: "function", function: { name: "make_quiz" } },
            }),
          });
          if (res.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached." }), { status: 429 });
          if (res.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402 });
          if (!res.ok) {
            console.error("AI quiz error", res.status, await res.text());
            return new Response(JSON.stringify({ error: "AI service unavailable" }), { status: 502 });
          }
          const json = await res.json();
          const call = json.choices?.[0]?.message?.tool_calls?.[0];
          const args = call?.function?.arguments;
          if (!args) return new Response(JSON.stringify({ error: "No quiz returned" }), { status: 502 });
          const parsed = typeof args === "string" ? JSON.parse(args) : args;
          return new Response(JSON.stringify(parsed), { headers: { "Content-Type": "application/json" } });
        } catch (e) {
          console.error("quiz error", e);
          return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
        }
      },
    },
  },
});