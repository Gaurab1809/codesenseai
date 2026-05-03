import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2, Check, X, ArrowRight, RotateCcw, GraduationCap, BarChart3, BookOpen, Flame, Snowflake, Zap } from "lucide-react";

type Q = { type: "mcq" | "predict"; question: string; options: string[]; answerIndex: number; explanation: string };
type Quiz = { topic: string; questions: Q[] };
type Difficulty = "easy" | "medium" | "hard";

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
  const [reviewing, setReviewing] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
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
        // Adaptive difficulty: look at last 3 quiz results in this language
        const uid = data.session.user.id;
        const { data: recent } = await supabase
          .from("quiz_results")
          .select("score,total")
          .eq("user_id", uid)
          .eq("language", payload.language)
          .order("created_at", { ascending: false })
          .limit(3);
        let nextDiff: Difficulty = "medium";
        if (recent && recent.length > 0) {
          const avg = recent.reduce((a, r) => a + (r.total > 0 ? r.score / r.total : 0), 0) / recent.length;
          if (avg >= 0.8) nextDiff = "hard";
          else if (avg < 0.5) nextDiff = "easy";
        }
        setDifficulty(nextDiff);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
            body: JSON.stringify({ code: payload.code, language: payload.language, outputLang: payload.outputLang ?? "en", count: 5, difficulty: nextDiff }),
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
        difficulty,
        details: { answers, questions: quiz.questions },
      });
    }
  }

  function restart() { setAnswers([]); setStep(0); setDone(false); setReviewing(false); }

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
          <span className="inline-flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-foreground ${difficulty === "easy" ? "bg-[var(--lime)]" : difficulty === "hard" ? "bg-[var(--coral)]" : "bg-[var(--amber)]"}`}>
              {difficulty === "easy" ? <Snowflake className="h-3 w-3" /> : difficulty === "hard" ? <Flame className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
              {difficulty}
            </span>
            <span>{Math.min(step + 1, quiz.questions.length)} / {quiz.questions.length}</span>
          </span>
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
        ) : reviewing ? (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl inline-flex items-center gap-2"><BookOpen className="h-5 w-5" /> Review</h2>
              <button onClick={() => setReviewing(false)} className="h-9 px-3 rounded-xl border-2 border-foreground bg-card text-[12.5px] font-bold">Back to results</button>
            </div>
            {quiz.questions.map((qq, i) => {
              const mine = answers[i];
              const correct = mine === qq.answerIndex;
              return (
                <div key={i} className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-subtle border border-foreground rounded">Q{i + 1} · {qq.type === "predict" ? "Predict" : "MCQ"}</span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border-2 border-foreground ${correct ? "bg-[var(--lime)]" : "bg-[var(--coral)]"}`}>
                      {correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {correct ? "Correct" : "Wrong"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display font-bold text-base leading-snug">{qq.question}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {qq.options.map((opt, j) => {
                      const isCorrect = j === qq.answerIndex;
                      const isMine = j === mine;
                      return (
                        <li key={j} className={`flex items-start gap-2 p-2.5 rounded-lg border-2 border-foreground/80 ${isCorrect ? "bg-[var(--lime)]" : isMine ? "bg-[var(--coral)]" : "bg-subtle"}`}>
                          <span className="font-mono text-[11px] mt-0.5 px-1.5 py-0.5 rounded bg-background border border-foreground">{String.fromCharCode(65 + j)}</span>
                          <span className="flex-1 whitespace-pre-wrap text-[13px]">{opt}</span>
                          {isCorrect && <span className="text-[10px] font-mono uppercase">correct</span>}
                          {isMine && !isCorrect && <span className="text-[10px] font-mono uppercase">your pick</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 rounded-xl border-2 border-foreground p-3 bg-subtle text-[13px] leading-6">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Explanation</div>
                    {qq.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border-[2.5px] border-foreground bg-card p-7 shadow-pop-lg text-center">
            <div className="text-sm font-mono uppercase tracking-widest text-muted-foreground">your score</div>
            <div className="mt-2 text-6xl font-display font-bold">{score}<span className="text-2xl text-muted-foreground"> / {quiz.questions.length}</span></div>
            <div className="mt-2 text-muted-foreground">{score === quiz.questions.length ? "Perfect run! 🎉" : score >= quiz.questions.length / 2 ? "Solid work — keep going!" : "Take another pass and you've got this."}</div>
            <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Difficulty: {difficulty} · next quiz adapts to your scores</div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button onClick={() => setReviewing(true)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 border-foreground bg-[var(--sky)] font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <BookOpen className="h-4 w-4" /> Review answers
              </button>
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