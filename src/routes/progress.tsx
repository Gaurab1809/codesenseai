import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BarChart3, Loader2, ArrowRight, GraduationCap, FileCode } from "lucide-react";

type Result = { id: string; topic: string; language: string; score: number; total: number; created_at: string };

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Progress · CodeSense AI" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Result[]>([]);
  const [analyses, setAnalyses] = useState(0);
  const [snippets, setSnippets] = useState(0);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate({ to: "/auth" }); });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setReady(true);
      const [{ data: rows, error }, { count: aCount }, { count: sCount }] = await Promise.all([
        supabase.from("quiz_results").select("*").order("created_at", { ascending: true }),
        supabase.from("analyses").select("*", { count: "exact", head: true }),
        supabase.from("snippets").select("*", { count: "exact", head: true }),
      ]);
      if (error) toast.error(error.message); else setItems(rows ?? []);
      setAnalyses(aCount ?? 0);
      setSnippets(sCount ?? 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const stats = useMemo(() => {
    if (items.length === 0) return { avg: 0, best: 0, total: 0, byLang: [] as { language: string; avg: number; n: number }[] };
    const total = items.length;
    const pct = items.map((r) => (r.total > 0 ? r.score / r.total : 0));
    const avg = pct.reduce((a, b) => a + b, 0) / total;
    const best = Math.max(...pct);
    const map = new Map<string, { sum: number; n: number }>();
    items.forEach((r) => {
      const k = r.language;
      const e = map.get(k) ?? { sum: 0, n: 0 };
      e.sum += r.total > 0 ? r.score / r.total : 0; e.n += 1;
      map.set(k, e);
    });
    const byLang = [...map.entries()].map(([language, v]) => ({ language, avg: v.sum / v.n, n: v.n }));
    return { avg, best, total, byLang };
  }, [items]);

  if (!ready) return <div className="min-h-screen grid place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  const max = Math.max(1, ...items.map((r) => (r.total > 0 ? r.score / r.total : 0)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="sticky top-0 z-30 border-b-2 border-foreground bg-card">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Logo /></Link>
            <span className="hidden md:inline text-xs font-mono px-2 py-0.5 rounded bg-foreground text-background">/progress</span>
          </div>
          <Link to="/app" className="h-9 px-3 rounded-xl border-2 border-foreground bg-[var(--coral)] font-bold text-[13px] inline-flex items-center gap-1.5 shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 space-y-8">
        <div>
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/learning</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight inline-flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7" /> Your progress
          </h1>
        </div>

        <div className="grid sm:grid-cols-4 gap-3">
          <Stat color="var(--lime)" label="Quizzes taken" value={stats.total} />
          <Stat color="var(--sky)" label="Average score" value={`${Math.round(stats.avg * 100)}%`} />
          <Stat color="var(--amber)" label="Best run" value={`${Math.round(stats.best * 100)}%`} />
          <Stat color="var(--violet)" label="Saved code" value={`${analyses}A · ${snippets}S`} />
        </div>

        <section className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
          <div className="font-display font-bold text-lg inline-flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Quiz history</div>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-2">No quizzes yet. <Link to="/app" className="underline">Try one from the workspace</Link>.</p>
          ) : (
            <div className="mt-5 space-y-2">
              {items.slice().reverse().map((r) => {
                const pct = r.total > 0 ? r.score / r.total : 0;
                return (
                  <div key={r.id} className="flex items-center gap-3">
                    <div className="w-32 text-[12px] font-mono truncate">{new Date(r.created_at).toLocaleDateString()}</div>
                    <div className="flex-1 h-3 rounded-full border-2 border-foreground bg-subtle overflow-hidden">
                      <div className="h-full bg-[var(--lime)]" style={{ width: `${(pct / max) * 100}%` }} />
                    </div>
                    <div className="w-28 text-right text-[12px] font-mono"><span className="font-bold">{r.score}/{r.total}</span> · {r.language}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {stats.byLang.length > 0 && (
          <section className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
            <div className="font-display font-bold text-lg inline-flex items-center gap-2"><FileCode className="h-5 w-5" /> By language</div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {stats.byLang.map((b) => (
                <div key={b.language} className="rounded-xl border-2 border-foreground p-3">
                  <div className="flex items-center justify-between text-[12.5px] font-mono">
                    <span className="font-bold">{b.language}</span>
                    <span>{Math.round(b.avg * 100)}% · {b.n} quizzes</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full border border-foreground bg-subtle overflow-hidden">
                    <div className="h-full bg-[var(--coral)]" style={{ width: `${b.avg * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border-[2.5px] border-foreground p-4 shadow-pop" style={{ background: color }}>
      <div className="text-[11px] font-mono uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold">{value}</div>
    </div>
  );
}