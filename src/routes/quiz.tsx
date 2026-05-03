import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Check, X, ArrowRight, RotateCcw, GraduationCap, BarChart3 } from "lucide-react";

type Q = { type: "mcq" | "predict"; question: string; options: string[]; answerIndex: number; explanation: string };
type Quiz = { topic: string; questions: Q[] };

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz · CodeSense AI" }] }),
  component: QuizPage,
});

function QuizPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [meta, setMeta] = useState<{ name: string; language: string; analysisId: string | null; outputLang: "en" | "bn" } | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setReady(true);
      const raw = sessionStorage.getItem("quiz.payload");
      if (!raw) { toast.error("Open a snippet from the workspace first."); navigate({ to: "/app" }); return; }
      const payload = JSON.parse(raw);
      setMeta({ name: payload.name, language: payload.language, analysisId: payload.analysisId ?? null, outputLang: payload.outputLang ?? "en" });
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
          body: JSON.stringify({ code: payload.code, language: payload.language, outputLang: payload.outputLang ?? "en", count: 5 }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed");
        setQuiz(json);
      } catch (e: any) {
        toast.error(e?.message ?? "Could not generate quiz");
        navigate({ to: "/app" });
      } finally {
        setLoading(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  function pick(i: number) {
    if (answers[step] !== undefined) return;
    const next = [...answers]; next[step] = i; setAnswers(next);
  }
  function nextStep() {
    if (!quiz) return;
    if (step + 1 >= quiz.questions.length) finish();
    else setStep(step + 1);
  }

  async function finish() {
    if (!quiz) return;
    const score = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0), 0);
    setDone(true);
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (uid && meta) {
      await supabase.from("quiz_results").insert({
        user_id: uid,
        analysis_id: meta.analysisId,
        topic: quiz.topic,
        language: meta.language,
        score, total: quiz.questions.length,
        details: { answers, questions: quiz.questions },
      });
    }
  }

  function restart() { setAnswers([]); setStep(0); setDone(false); }

  if (!ready || loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background dot-paper">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin" />
          <span className="text-sm">Crafting your quiz…</span>
        </div>
      </div>
    );
  }

  if (!quiz) return null;
  const q = quiz.questions[step];
  const chosen = answers[step];
  const score = quiz.questions.reduce((a, qq, i) => a + (answers[i] === qq.answerIndex ? 1 : 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-card">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="hidden md:inline text-xs font-mono px-2 py-0.5 rounded bg-foreground text-background">/quiz</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/progress" className="h-9 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold inline-flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Progress
            </Link>
            <Link to="/app" className="h-9 px-3 rounded-xl border-2 border-foreground bg-card hover:bg-subtle text-[13px] font-semibold">Workspace</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="flex items-center justify-between text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {quiz.topic}</span>
          <span>{Math.min(step + 1, quiz.questions.length)} / {quiz.questions.length}</span>
        </div>
        <div className="mt-3 h-2 rounded-full border-2 border-foreground bg-card overflow-hidden">
          <div className="h-full bg-[var(--lime)]" style={{ width: `${((done ? quiz.questions.length : step) / quiz.questions.length) * 100}%` }} />
        </div>

        {!done ? (
          <div className="mt-8 rounded-2xl border-[2.5px] border-foreground bg-card p-6 shadow-pop-lg">
            <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-[var(--violet)] border border-foreground rounded">{q.type === "predict" ? "Predict the output" : "Multiple choice"}</span>
            <h2 className="mt-3 text-xl font-display font-bold leading-snug">{q.question}</h2>
            <ul className="mt-5 space-y-2">
              {q.options.map((opt, i) => {
                const picked = chosen === i;
                const correct = chosen !== undefined && i === q.answerIndex;
                const wrong = picked && i !== q.answerIndex;
                return (
                  <li key={i}>
                    <button
                      onClick={() => pick(i)}
                      disabled={chosen !== undefined}
                      className={`w-full text-left p-3 rounded-xl border-2 border-foreground font-medium transition-all flex items-start gap-2.5 ${
                        correct ? "bg-[var(--lime)]" : wrong ? "bg-[var(--coral)]" : picked ? "bg-card" : "bg-card hover:-translate-y-0.5 hover:shadow-pop"
                      }`}
                    >
                      <span className="font-mono text-[11px] mt-0.5 px-1.5 py-0.5 rounded bg-background border border-foreground">{String.fromCharCode(65 + i)}</span>
                      <span className="flex-1 whitespace-pre-wrap">{opt}</span>
                      {correct && <Check className="h-4 w-4 mt-0.5" />}
                      {wrong && <X className="h-4 w-4 mt-0.5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            {chosen !== undefined && (
              <div className="mt-4 rounded-xl border-2 border-foreground p-3 bg-subtle text-[13.5px] leading-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Why</div>
                {q.explanation}
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button
                onClick={nextStep}
                disabled={chosen === undefined}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-foreground bg-[var(--coral)] font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
              >
                {step + 1 >= quiz.questions.length ? "See results" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border-[2.5px] border-foreground bg-card p-7 shadow-pop-lg text-center">
            <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground">your score</div>
            <div className="mt-2 text-6xl font-display font-bold">{score}<span className="text-2xl text-muted-foreground"> / {quiz.questions.length}</span></div>
            <div className="mt-2 text-muted-foreground">{score === quiz.questions.length ? "Perfect run! 🎉" : score >= quiz.questions.length / 2 ? "Solid work — keep going!" : "Take another pass and you've got this."}</div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button onClick={restart} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-foreground bg-card font-bold text-[13px]">
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
              <Link to="/progress" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-foreground bg-[var(--lime)] font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <BarChart3 className="h-4 w-4" /> View progress
              </Link>
              <Link to="/app" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-foreground bg-[var(--coral)] font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Back to workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}