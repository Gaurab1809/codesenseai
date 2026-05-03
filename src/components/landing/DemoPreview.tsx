import { motion } from "framer-motion";
import { Bug, Wand2, ShieldCheck, Languages, Play, Upload, ArrowRight, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link } from "@tanstack/react-router";

const STARTERS: Record<string, string> = {
  python: `def find_duplicates(items):\n    seen = set()\n    dupes = []\n    for x in items:\n        if x in seen:\n            dupes.append(x)\n        else:\n            seen.add(x)\n    return dupes`,
  javascript: `function findDuplicates(items) {\n  const seen = new Set();\n  const dupes = [];\n  for (const x of items) {\n    if (seen.has(x)) dupes.push(x);\n    else seen.add(x);\n  }\n  return dupes;\n}`,
  typescript: `function findDuplicates<T>(items: T[]): T[] {\n  const seen = new Set<T>();\n  const out: T[] = [];\n  for (const x of items) seen.has(x) ? out.push(x) : seen.add(x);\n  return out;\n}`,
  java: `import java.util.*;\nclass Demo {\n  static List<Integer> dupes(int[] items) {\n    Set<Integer> seen = new HashSet<>();\n    List<Integer> out = new ArrayList<>();\n    for (int x : items) if (!seen.add(x)) out.add(x);\n    return out;\n  }\n}`,
  cpp: `#include <vector>\n#include <unordered_set>\nstd::vector<int> dupes(const std::vector<int>& items) {\n  std::unordered_set<int> seen;\n  std::vector<int> out;\n  for (int x : items) if (!seen.insert(x).second) out.push_back(x);\n  return out;\n}`,
  go: `package main\nfunc dupes(items []int) []int {\n  seen := map[int]bool{}\n  out := []int{}\n  for _, x := range items {\n    if seen[x] { out = append(out, x) } else { seen[x] = true }\n  }\n  return out\n}`,
};

const LANGS = Object.keys(STARTERS);

const ACTIONS = [
  { id: "explain", icon: Play, label: "Explain", color: "var(--lime)" },
  { id: "bugs", icon: Bug, label: "Debug", color: "var(--coral)" },
  { id: "optimize", icon: Wand2, label: "Optimize", color: "var(--sky)" },
  { id: "security", icon: ShieldCheck, label: "Secure", color: "var(--amber)" },
  { id: "bangla", icon: Languages, label: "বাংলা", color: "var(--violet)" },
] as const;

export function DemoPreview() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>(STARTERS.python);
  const [active, setActive] = useState<typeof ACTIONS[number]["id"]>("explain");

  function changeLang(l: string) {
    setLanguage(l);
    if (Object.values(STARTERS).includes(code)) setCode(STARTERS[l] ?? "");
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, string> = { py: "python", js: "javascript", ts: "typescript", java: "java", cpp: "cpp", c: "cpp", go: "go", rs: "rust" };
    const detected = map[ext] ?? language;
    const reader = new FileReader();
    reader.onload = () => {
      setCode(String(reader.result ?? ""));
      setLanguage(detected);
    };
    reader.readAsText(file);
  }

  return (
    <section id="playground" className="relative py-24 bg-subtle border-y-2 border-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 max-w-3xl">
          <div>
            <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/playground</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
              Paste it. <span className="bg-[var(--lime)] px-2 border-2 border-foreground rounded-lg inline-block -rotate-1">Get it.</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">A real Monaco editor — type, paste, drop a file. Sign in to run any action against your live AI workspace.</p>
          </div>
          <Link to="/app" data-cursor="hover" className="inline-flex items-center gap-1.5 h-11 px-4 rounded-2xl bg-[var(--coral)] border-2 border-foreground font-bold shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            Open workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 sticker-lg overflow-hidden bg-card"
        >
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b-2 border-foreground bg-[var(--amber)]">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)] border border-foreground" />
              <span className="h-2.5 w-2.5 rounded-full bg-card border border-foreground" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--lime)] border border-foreground" />
            </div>
            <select
              value={language}
              onChange={(e) => changeLang(e.target.value)}
              className="ml-2 h-8 px-2 rounded-lg border-2 border-foreground bg-card font-mono text-[12px]"
            >
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <button
              onClick={() => fileRef.current?.click()}
              data-cursor="hover"
              className="h-8 px-2.5 rounded-lg border-2 border-foreground bg-card font-bold text-[12px] inline-flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" /> Upload file
            </button>
            <input ref={fileRef} type="file" hidden accept=".py,.js,.ts,.java,.cpp,.c,.go,.rs,.txt" onChange={onUpload} />
            <div className="ml-auto font-mono text-[10px] px-1.5 py-0.5 bg-foreground text-background rounded">live demo</div>
          </div>

          <div className="grid lg:grid-cols-2 min-h-[440px]">
            {/* Monaco editor */}
            <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
              <Editor
                height="440px"
                language={language}
                value={code}
                theme="vs-dark"
                onChange={(v) => setCode(v ?? "")}
                options={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 13,
                  minimap: { enabled: false },
                  smoothScrolling: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 14 },
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                }}
              />
              <div className="flex flex-wrap gap-1.5 p-3 border-t-2 border-foreground">
                {ACTIONS.map((b) => (
                  <button
                    key={b.id}
                    data-cursor="hover"
                    onClick={() => setActive(b.id)}
                    className={`inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border-2 border-foreground font-bold text-[11.5px] transition-all ${active === b.id ? "shadow-pop -translate-y-0.5" : "hover:translate-x-[1px] hover:translate-y-[1px]"}`}
                    style={{ background: b.color }}
                  >
                    <b.icon className="h-3 w-3" /> {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* preview pane */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground text-background rounded">preview · {active}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{code.split("\n").length} lines · {language}</span>
              </div>
              <div className="rounded-xl border-2 border-foreground p-3 bg-[var(--sky)]">
                <div className="text-[12px] font-bold flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> What you'll get in the workspace</div>
                <div className="mt-1 text-[12px]">{previewBlurb(active)}</div>
              </div>
              <ul className="text-[13px] space-y-1.5">
                <li>· Step-by-step explanation in plain English or বাংলা</li>
                <li>· Bug report with line numbers and fixes</li>
                <li>· Big-O analysis + concrete optimizations</li>
                <li>· Security checks for risky patterns</li>
                <li>· Auto-generated MCQs to practice the concepts</li>
              </ul>
              <Link to="/auth" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[var(--lime)] border-2 border-foreground font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Run on this code <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function previewBlurb(id: string) {
  switch (id) {
    case "bugs": return "Lists each bug with severity, impacted line, and a fenced fix snippet.";
    case "optimize": return "Big-O analysis plus a refactored version that's faster or cleaner.";
    case "security": return "Flags injection, unsafe inputs, and crypto pitfalls — with safer alternatives.";
    case "bangla": return "Same explanation rewritten in friendly বাংলা for easier learning.";
    default: return "Plain-English summary, line-by-line walkthrough, bugs, suggestions and concepts.";
  }
}
