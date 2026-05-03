import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "@/components/fx/Tilt";
import { Palette, Check, Plus, Trash2, Save, X, Sparkles } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";

type Theme = {
  id: string;
  name: string;
  vibe: string;
  bg: string;
  panel: string;
  text: string;
  muted: string;
  accent: string;
  syntax: {
    keyword: string;
    string: string;
    fn: string;
    num: string;
    comment: string;
    punct: string;
  };
};

const THEMES: Theme[] = [
  {
    id: "candyfloss",
    name: "Candyfloss",
    vibe: "sugar rush",
    bg: "#fff1f6",
    panel: "#ffe3ee",
    text: "#2a0a1f",
    muted: "#8a4a6a",
    accent: "#ff4f93",
    syntax: { keyword: "#d6005f", string: "#7b3aa6", fn: "#0d8aab", num: "#c2410c", comment: "#a07c8e", punct: "#2a0a1f" },
  },
  {
    id: "neonjungle",
    name: "Neon Jungle",
    vibe: "midnight bloom",
    bg: "#0d1f17",
    panel: "#0a2a1d",
    text: "#e6ffe9",
    muted: "#7fb89a",
    accent: "#39ff88",
    syntax: { keyword: "#39ff88", string: "#ffe066", fn: "#5cc8ff", num: "#ff7ab6", comment: "#5a8a72", punct: "#cfe9d8" },
  },
  {
    id: "retroarcade",
    name: "Retro Arcade",
    vibe: "8-bit dreams",
    bg: "#1a1033",
    panel: "#241548",
    text: "#ffeaff",
    muted: "#9a8acb",
    accent: "#ffcc00",
    syntax: { keyword: "#ff5dcd", string: "#ffcc00", fn: "#5cf5ff", num: "#a3ff5c", comment: "#7464a8", punct: "#ffeaff" },
  },
  {
    id: "creamsoda",
    name: "Cream Soda",
    vibe: "cozy paper",
    bg: "#fbf5e7",
    panel: "#f4ead0",
    text: "#2b231a",
    muted: "#7a6a52",
    accent: "#e85a3a",
    syntax: { keyword: "#c2410c", string: "#3f6e2a", fn: "#0e6e8c", num: "#8a4a00", comment: "#a89a7a", punct: "#2b231a" },
  },
  {
    id: "oceandrift",
    name: "Ocean Drift",
    vibe: "deep blue calm",
    bg: "#0a1a2f",
    panel: "#0f2742",
    text: "#e6f0ff",
    muted: "#7ea6cf",
    accent: "#3fc1ff",
    syntax: { keyword: "#ff7eb6", string: "#7be0c2", fn: "#3fc1ff", num: "#ffd166", comment: "#5a7a9a", punct: "#e6f0ff" },
  },
  {
    id: "lavafield",
    name: "Lava Field",
    vibe: "warm & spicy",
    bg: "#1a0a0a",
    panel: "#2a0f0d",
    text: "#ffeede",
    muted: "#c98a78",
    accent: "#ff7a1a",
    syntax: { keyword: "#ff5a3c", string: "#ffd166", fn: "#ffa54a", num: "#ff7eb6", comment: "#8a5a4a", punct: "#ffeede" },
  },
];

type Sample = { label: string; prism: string; filename: string; code: string };

const SAMPLES: Sample[] = [
  {
    label: "Python",
    prism: "python",
    filename: "hello.py",
    code: `# say hi to a friend
def greet(name):
    return f"hello, {name}!"

for i in range(3):
    print(greet("world"))`,
  },
  {
    label: "JavaScript",
    prism: "javascript",
    filename: "fizzbuzz.js",
    code: `// classic warm-up
const fizzbuzz = (n) => {
  for (let i = 1; i <= n; i++) {
    console.log(i % 15 === 0 ? "fizzbuzz" : i);
  }
};
fizzbuzz(20);`,
  },
  {
    label: "TypeScript",
    prism: "typescript",
    filename: "user.ts",
    code: `type User = { id: string; name: string };

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const u: User = { id: "1", name: "Ada" };
console.log(greet(u));`,
  },
  {
    label: "Java",
    prism: "java",
    filename: "Main.java",
    code: `public class Main {
  public static int sum(int[] xs) {
    int total = 0;
    for (int x : xs) total += x;
    return total;
  }

  public static void main(String[] args) {
    System.out.println(sum(new int[]{1, 2, 3}));
  }
}`,
  },
  {
    label: "C++",
    prism: "cpp",
    filename: "primes.cpp",
    code: `#include <iostream>
using namespace std;

bool isPrime(int n) {
  if (n < 2) return false;
  for (int i = 2; i * i <= n; i++)
    if (n % i == 0) return false;
  return true;
}

int main() {
  for (int i = 2; i < 20; i++)
    if (isPrime(i)) cout << i << " ";
}`,
  },
  {
    label: "Go",
    prism: "go",
    filename: "main.go",
    code: `package main

import "fmt"

func double(xs []int) []int {
  out := make([]int, len(xs))
  for i, v := range xs {
    out[i] = v * 2
  }
  return out
}

func main() {
  fmt.Println(double([]int{1, 2, 3}))
}`,
  },
  {
    label: "Rust",
    prism: "rust",
    filename: "main.rs",
    code: `fn factorial(n: u64) -> u64 {
    (1..=n).product()
}

fn main() {
    for i in 0..6 {
        println!("{}! = {}", i, factorial(i));
    }
}`,
  },
  {
    label: "SQL",
    prism: "sql",
    filename: "query.sql",
    code: `-- top 5 customers by spend
SELECT c.name, SUM(o.amount) AS total
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.created_at > NOW() - INTERVAL '30 days'
GROUP BY c.name
ORDER BY total DESC
LIMIT 5;`,
  },
  {
    label: "Bangla",
    prism: "python",
    filename: "average.py",
    code: `# ছাত্রের গড় নম্বর
def average(marks):
    return sum(marks) / len(marks)

marks = [85, 90, 78]
print("গড়:", average(marks))`,
  },
];

// Map Prism token types -> theme syntax slot
function tokenColor(type: string, syn: Theme["syntax"]): string {
  if (["keyword", "boolean", "important", "atrule", "selector"].includes(type)) return syn.keyword;
  if (["string", "char", "regex", "url", "attr-value", "template-string"].includes(type)) return syn.string;
  if (["function", "class-name", "tag", "property"].includes(type)) return syn.fn;
  if (["number", "hexcode"].includes(type)) return syn.num;
  if (["comment", "prolog", "doctype", "cdata"].includes(type)) return syn.comment;
  return syn.punct;
}

function PrismCode({ code, lang, syn }: { code: string; lang: string; syn: Theme["syntax"] }) {
  const tokens = useMemo(() => {
    const grammar = (Prism.languages as any)[lang] || Prism.languages.javascript;
    return Prism.tokenize(code, grammar);
  }, [code, lang]);

  const render = (t: any, key: number): React.ReactNode => {
    if (typeof t === "string") return <span key={key} style={{ color: syn.punct }}>{t}</span>;
    const color = tokenColor(t.type, syn);
    if (Array.isArray(t.content)) {
      return (
        <span key={key} style={{ color }}>
          {t.content.map((c: any, i: number) => render(c, i))}
        </span>
      );
    }
    return <span key={key} style={{ color }}>{t.content}</span>;
  };

  return <>{tokens.map((t, i) => render(t, i))}</>;
}

// Custom theme builder + persistence
const STORAGE_KEY = "codesense.themes.v1";

function loadCustom(): Theme[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Theme[]) : [];
  } catch { return []; }
}
function saveCustom(themes: Theme[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

function ThemeBuilder({
  base, onCancel, onSave,
}: { base: Theme; onCancel: () => void; onSave: (t: Theme) => void }) {
  const [draft, setDraft] = useState<Theme>(() => ({
    ...base,
    id: "custom-" + Math.random().toString(36).slice(2, 8),
    name: base.name.startsWith("My ") ? base.name : "My " + base.name,
    vibe: "custom",
  }));

  const set = (patch: Partial<Theme>) => setDraft((d) => ({ ...d, ...patch }));
  const setSyn = (k: keyof Theme["syntax"], v: string) =>
    setDraft((d) => ({ ...d, syntax: { ...d.syntax, [k]: v } }));

  const SwatchInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <label className="flex items-center justify-between gap-2 text-[12px]">
      <span className="font-mono opacity-80">{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 rounded border-2 border-foreground cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 h-7 px-1.5 rounded border-2 border-foreground bg-background font-mono text-[11px] outline-none"
        />
      </span>
    </label>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border-[2.5px] border-foreground bg-card shadow-pop-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground bg-subtle">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-display font-bold">Theme builder</span>
          </div>
          <button onClick={onCancel} data-cursor="hover" className="h-8 w-8 grid place-items-center rounded-lg border-2 border-foreground bg-card hover:bg-subtle">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-[260px_1fr]">
          {/* Controls */}
          <div className="p-4 space-y-3 border-r-2 border-foreground max-h-[70vh] overflow-y-auto">
            <label className="block">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Name</span>
              <input
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border-2 border-foreground bg-background font-semibold text-[13px] outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Vibe</span>
              <input
                value={draft.vibe}
                onChange={(e) => set({ vibe: e.target.value })}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border-2 border-foreground bg-background text-[12px] font-mono outline-none"
              />
            </label>

            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Surfaces</div>
              <SwatchInput label="background" value={draft.bg} onChange={(v) => set({ bg: v })} />
              <SwatchInput label="panel" value={draft.panel} onChange={(v) => set({ panel: v })} />
              <SwatchInput label="text" value={draft.text} onChange={(v) => set({ text: v })} />
              <SwatchInput label="muted" value={draft.muted} onChange={(v) => set({ muted: v })} />
              <SwatchInput label="accent" value={draft.accent} onChange={(v) => set({ accent: v })} />
            </div>
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Syntax</div>
              {(Object.keys(draft.syntax) as Array<keyof Theme["syntax"]>).map((k) => (
                <SwatchInput key={k} label={k} value={draft.syntax[k]} onChange={(v) => setSyn(k, v)} />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 space-y-3">
            <div
              className="rounded-xl border-2 border-foreground overflow-hidden"
              style={{ background: draft.bg, color: draft.text }}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b-2"
                   style={{ background: draft.panel, borderColor: draft.text }}>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: draft.accent }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: draft.syntax.fn }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: draft.syntax.string }} />
                </div>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: draft.accent, color: draft.bg }}>preview</span>
              </div>
              <pre className="font-mono text-[12px] leading-6 p-4 whitespace-pre-wrap">
                <PrismCode code={SAMPLES[0].code} lang={SAMPLES[0].prism} syn={draft.syntax} />
              </pre>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onCancel} className="h-9 px-3 rounded-lg border-2 border-foreground bg-card hover:bg-subtle font-semibold text-[13px]">Cancel</button>
              <button
                onClick={() => onSave(draft)}
                className="h-9 px-3 rounded-lg border-2 border-foreground bg-[var(--lime)] font-bold text-[13px] shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all inline-flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save theme
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ThemePlayground() {
  const [custom, setCustom] = useState<Theme[]>([]);
  useEffect(() => { setCustom(loadCustom()); }, []);
  const allThemes = useMemo(() => [...THEMES, ...custom], [custom]);

  const [active, setActive] = useState<Theme>(THEMES[0]);
  const [sampleIdx, setSampleIdx] = useState(0);
  const sample = SAMPLES[sampleIdx];

  const [builderOpen, setBuilderOpen] = useState(false);

  const handleSaveCustom = (t: Theme) => {
    const next = [...custom, t];
    setCustom(next);
    saveCustom(next);
    setActive(t);
    setBuilderOpen(false);
  };
  const removeCustom = (id: string) => {
    const next = custom.filter((c) => c.id !== id);
    setCustom(next);
    saveCustom(next);
    if (active.id === id) setActive(THEMES[0]);
  };

  return (
    <section id="themes" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded inline-flex items-center gap-1.5">
              <Palette className="h-3 w-3" /> /themes
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
              Pick a vibe.{" "}
              <span className="bg-[var(--violet)] px-2 border-2 border-foreground rounded-lg inline-block -rotate-1">Code in style.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Hover, click, swap. Build your own. Real Prism tokenization, every color rewires in real time.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 p-1 rounded-xl border-2 border-foreground bg-card shadow-pop max-w-full">
            {SAMPLES.map((s, i) => (
              <button
                key={s.label}
                data-cursor="hover"
                onClick={() => setSampleIdx(i)}
                className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  sampleIdx === i ? "bg-foreground text-background" : "hover:bg-subtle"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Theme picker */}
          <div className="space-y-3">
            {allThemes.map((t) => {
              const isActive = active.id === t.id;
              const isCustom = t.id.startsWith("custom-");
              return (
                <div
                  key={t.id}
                  data-cursor="hover"
                  data-cursor-label={isActive ? "live" : "swap"}
                  onClick={() => setActive(t)}
                  className={`group relative w-full text-left rounded-xl border-2 border-foreground p-3 transition-transform cursor-pointer ${
                    isActive ? "shadow-pop -translate-y-0.5" : "hover:-translate-y-0.5 hover:shadow-pop"
                  }`}
                  style={{ background: t.panel, color: t.text }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display font-bold text-[15px] leading-tight truncate">{t.name}</div>
                      <div className="text-[11px] font-mono opacity-70 mt-0.5">{t.vibe}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCustom && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeCustom(t.id); }}
                          className="h-6 w-6 grid place-items-center rounded-md border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ borderColor: t.text, background: t.bg, color: t.text }}
                          aria-label="Delete theme"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                      {isActive && (
                        <span
                          className="h-6 w-6 grid place-items-center rounded-full border-2"
                          style={{ borderColor: t.text, background: t.accent, color: t.bg }}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {[t.bg, t.accent, t.syntax.keyword, t.syntax.string, t.syntax.fn, t.syntax.num].map((c, i) => (
                      <span
                        key={i}
                        className="h-5 flex-1 rounded border"
                        style={{ background: c, borderColor: t.text }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setBuilderOpen(true)}
              data-cursor="hover"
              className="w-full rounded-xl border-2 border-dashed border-foreground p-3 text-left hover:bg-subtle transition-colors inline-flex items-center gap-2 font-semibold text-[13px]"
            >
              <Plus className="h-4 w-4" /> Build your own theme
            </button>
          </div>

          {/* Live editor */}
          <Tilt max={3}>
            <div
              className="rounded-2xl border-[2.5px] border-foreground shadow-pop-lg overflow-hidden transition-colors duration-500"
              style={{ background: active.bg, color: active.text }}
            >
              {/* title bar */}
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b-2"
                style={{ background: active.panel, borderColor: active.text }}
              >
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: active.accent }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: active.syntax.fn }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: active.syntax.string }} />
                </div>
                <div className="font-mono text-[11px] font-bold opacity-80">{sample.filename}</div>
                <div
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
                  style={{ background: active.accent, color: active.bg }}
                >
                  {active.name}
                </div>
              </div>

              {/* code body */}
              <div className="grid grid-cols-[44px_1fr]">
                <div
                  className="font-mono text-[11.5px] leading-6 py-5 text-right pr-3 select-none"
                  style={{ color: active.muted, background: active.panel }}
                >
                  {sample.code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={active.id + sample.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    data-cursor="code"
                    className="font-mono text-[12.5px] leading-6 py-5 px-4 cursor-none whitespace-pre-wrap"
                  >
                    <PrismCode code={sample.code} lang={sample.prism} syn={active.syntax} />
                  </motion.pre>
                </AnimatePresence>
              </div>

              {/* status bar */}
              <div
                className="flex items-center justify-between px-4 py-2 border-t-2 font-mono text-[11px]"
                style={{ background: active.panel, borderColor: active.text }}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: active.accent }} />
                  CodeSense AI · live preview
                </span>
                <span className="opacity-70">UTF-8 · LF · {sample.prism}</span>
              </div>
            </div>
          </Tilt>
        </div>
      </div>

      <AnimatePresence>
        {builderOpen && (
          <ThemeBuilder
            base={active}
            onCancel={() => setBuilderOpen(false)}
            onSave={handleSaveCustom}
          />
        )}
      </AnimatePresence>
    </section>
  );
}