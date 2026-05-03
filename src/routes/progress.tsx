import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BarChart3, Loader2, ArrowRight, GraduationCap, FileCode, Flame, Trophy, Sparkles, TrendingUp, TrendingDown } from "lucide-react";

type Result = { id: string; topic: string; language: string; score: number; total: number; created_at: string; difficulty?: string };

function topicStreak(rows: Result[]): { current: number; longest: number } {
  if (rows.length === 0) return { current: 0, longest: 0 };
  const days = Array.from(new Set(rows.map((r) => new Date(r.created_at).toISOString().slice(0, 10)))).sort();
  let longest = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = Math.round((new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000);
    if (diff === 1) { run += 1; longest = Math.max(longest, run); } else run = 1;
  }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const set = new Set(days);
  let current = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10);
    if (set.has(d)) current += 1;
    else if (i === 0) continue;
    else break;
  }
  return { current, longest };
}

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

  const streak = useMemo(() => {
    if (items.length === 0) return { current: 0, longest: 0 };
    const days = Array.from(new Set(items.map((r) => new Date(r.created_at).toISOString().slice(0, 10)))).sort();
    let longest = 1, run = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]); const cur = new Date(days[i]);
      const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) { run += 1; longest = Math.max(longest, run); } else { run = 1; }
    }
    // current streak: walk backwards from today/yesterday
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const set = new Set(days);
    let current = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today.getTime() - i * 86400000).toISOString().slice(0, 10);
      if (set.has(d)) current += 1;
      else if (i === 0) continue; // allow no-quiz today
      else break;
    }
    return { current, longest };
  }, [items]);

  const trend = useMemo(() => {
    if (items.length < 4) return 0;
    const pct = items.map((r) => (r.total > 0 ? r.score / r.total : 0));
    const half = Math.floor(pct.length / 2);
    const earlyAvg = pct.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const lateAvg = pct.slice(half).reduce((a, b) => a + b, 0) / (pct.length - half);
    return lateAvg - earlyAvg;
  }, [items]);

  const milestones = useMemo(() => {
    const list = [
      { id: "first", label: "First quiz", icon: Sparkles, achieved: stats.total >= 1, color: "var(--lime)" },
      { id: "five", label: "5 quizzes", icon: GraduationCap, achieved: stats.total >= 5, color: "var(--sky)" },
      { id: "ten", label: "10 quizzes", icon: GraduationCap, achieved: stats.total >= 10, color: "var(--violet)" },
      { id: "perfect", label: "Perfect run", icon: Trophy, achieved: items.some((r) => r.total > 0 && r.score === r.total), color: "var(--amber)" },
      { id: "streak3", label: "3-day streak", icon: Flame, achieved: streak.longest >= 3, color: "var(--coral)" },
      { id: "streak7", label: "7-day streak", icon: Flame, achieved: streak.longest >= 7, color: "var(--coral)" },
      { id: "polyglot", label: "3 languages", icon: FileCode, achieved: stats.byLang.length >= 3, color: "var(--lime)" },
      { id: "expert", label: "80% average", icon: Trophy, achieved: stats.avg >= 0.8 && stats.total >= 3, color: "var(--amber)" },
    ];
    return list;
  }, [items, stats, streak]);

  const byTopic = useMemo(() => {
    const map = new Map<string, Result[]>();
    items.forEach((r) => {
      const k = `${r.topic} · ${r.language}`;
      const arr = map.get(k) ?? [];
      arr.push(r);
      map.set(k, arr);
    });
    return [...map.entries()]
      .map(([key, rows]) => {
        const sorted = rows.slice().sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
        const pcts = sorted.map((r) => (r.total > 0 ? r.score / r.total : 0));
        const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
        const last = pcts[pcts.length - 1];
        const first = pcts[0];
        const stk = topicStreak(rows);
        return { key, rows: sorted, pcts, avg, last, first, n: rows.length, streak: stk };
      })
      .sort((a, b) => b.n - a.n);
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Stat color="var(--lime)" label="Quizzes taken" value={stats.total} />
          <Stat color="var(--sky)" label="Average score" value={`${Math.round(stats.avg * 100)}%`} />
          <Stat color="var(--amber)" label="Best run" value={`${Math.round(stats.best * 100)}%`} />
          <Stat color="var(--coral)" label="Current streak" value={`${streak.current}d 🔥`} />
          <Stat color="var(--violet)" label="Saved code" value={`${analyses}A · ${snippets}S`} />
        </div>

        <section className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="font-display font-bold text-lg inline-flex items-center gap-2"><Flame className="h-5 w-5" /> Streak & trend</div>
            {items.length >= 4 && (
              <span className={`inline-flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded border-2 border-foreground ${trend >= 0 ? "bg-[var(--lime)]" : "bg-[var(--coral)]"}`}>
                {trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {trend >= 0 ? "+" : ""}{Math.round(trend * 100)}% vs early quizzes
              </span>
            )}
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-[13px]">
            <div className="rounded-xl border-2 border-foreground p-3 bg-subtle">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Current</div>
              <div className="text-2xl font-display font-bold">{streak.current} day{streak.current === 1 ? "" : "s"}</div>
              <div className="text-muted-foreground text-[12px]">Take a quiz today to keep it alive.</div>
            </div>
            <div className="rounded-xl border-2 border-foreground p-3 bg-subtle">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Longest</div>
              <div className="text-2xl font-display font-bold">{streak.longest} day{streak.longest === 1 ? "" : "s"}</div>
              <div className="text-muted-foreground text-[12px]">Your personal best.</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
          <div className="font-display font-bold text-lg inline-flex items-center gap-2"><Trophy className="h-5 w-5" /> Milestones</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl border-2 border-foreground p-3 transition-all ${m.achieved ? "shadow-pop -translate-y-0.5" : "opacity-50"}`}
                style={{ background: m.achieved ? m.color : undefined }}
              >
                <m.icon className="h-5 w-5" />
                <div className="mt-1 font-display font-bold text-[13px]">{m.label}</div>
                <div className="text-[10.5px] font-mono uppercase tracking-widest opacity-70">{m.achieved ? "unlocked" : "locked"}</div>
              </div>
            ))}
          </div>
        </section>

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

        {byTopic.length > 0 && (
          <section className="rounded-2xl border-[2.5px] border-foreground bg-card p-5 shadow-pop">
            <div className="font-display font-bold text-lg inline-flex items-center gap-2"><Sparkles className="h-5 w-5" /> By topic</div>
            <p className="text-[12px] text-muted-foreground mt-1">Scores and streaks per concept over time.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {byTopic.map((t) => {
                const trend = t.last - t.first;
                return (
                  <div key={t.key} className="rounded-xl border-2 border-foreground p-3 bg-subtle/40">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-display font-bold text-[13.5px] truncate">{t.key}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{t.n} quiz{t.n === 1 ? "" : "zes"} · avg {Math.round(t.avg * 100)}%</div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-1.5 py-0.5 rounded border-2 border-foreground ${trend >= 0 ? "bg-[var(--lime)]" : "bg-[var(--coral)]"}`}>
                        {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trend >= 0 ? "+" : ""}{Math.round(trend * 100)}%
                      </span>
                    </div>
                    <Sparkline values={t.pcts} />
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" /> {t.streak.current}d / best {t.streak.longest}d</span>
                      <span>last {Math.round(t.last * 100)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border-[2.5px] border-foreground p-4 shadow-pop text-[oklch(0.18_0.02_270)]" style={{ background: color }}>
      <div className="text-[11px] font-mono uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold">{value}</div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  const W = 220, H = 36, P = 2;
  const step = values.length > 1 ? (W - P * 2) / (values.length - 1) : 0;
  const pts = values.map((v, i) => `${P + i * step},${H - P - v * (H - P * 2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full h-9">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
      {values.map((v, i) => (
        <circle key={i} cx={P + i * step} cy={H - P - v * (H - P * 2)} r="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}