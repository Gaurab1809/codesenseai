import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "@/components/fx/Tilt";
import { Palette, Check } from "lucide-react";

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

const SAMPLES = {
  Python: [
    { t: "def ", c: "keyword" },
    { t: "greet", c: "fn" },
    { t: "(name):\n    ", c: "punct" },
    { t: "# say hi to a friend\n    ", c: "comment" },
    { t: "return ", c: "keyword" },
    { t: "f", c: "fn" },
    { t: '"hello, ', c: "string" },
    { t: "{name}", c: "punct" },
    { t: '!"', c: "string" },
    { t: "\n\n", c: "punct" },
    { t: "for ", c: "keyword" },
    { t: "i ", c: "punct" },
    { t: "in ", c: "keyword" },
    { t: "range", c: "fn" },
    { t: "(", c: "punct" },
    { t: "3", c: "num" },
    { t: "):\n    ", c: "punct" },
    { t: "print", c: "fn" },
    { t: "(", c: "punct" },
    { t: "greet", c: "fn" },
    { t: '("world"))', c: "string" },
  ],
  JavaScript: [
    { t: "const ", c: "keyword" },
    { t: "fizzbuzz ", c: "punct" },
    { t: "= ", c: "keyword" },
    { t: "(n) => {\n  ", c: "punct" },
    { t: "// classic warm-up\n  ", c: "comment" },
    { t: "for ", c: "keyword" },
    { t: "(", c: "punct" },
    { t: "let ", c: "keyword" },
    { t: "i = ", c: "punct" },
    { t: "1", c: "num" },
    { t: "; i <= n; i++) {\n    ", c: "punct" },
    { t: "console", c: "fn" },
    { t: ".log(i % ", c: "punct" },
    { t: "15 ", c: "num" },
    { t: "? ", c: "punct" },
    { t: '"fizzbuzz"', c: "string" },
    { t: " : i);\n  }\n}", c: "punct" },
  ],
  Bangla: [
    { t: "# ছাত্রের গড় নম্বর\n", c: "comment" },
    { t: "def ", c: "keyword" },
    { t: "average", c: "fn" },
    { t: "(marks):\n    ", c: "punct" },
    { t: "return ", c: "keyword" },
    { t: "sum", c: "fn" },
    { t: "(marks) / ", c: "punct" },
    { t: "len", c: "fn" },
    { t: "(marks)\n\n", c: "punct" },
    { t: "marks = [", c: "punct" },
    { t: "85, 90, 78", c: "num" },
    { t: "]\n", c: "punct" },
    { t: "print", c: "fn" },
    { t: "(", c: "punct" },
    { t: '"গড়:"', c: "string" },
    { t: ", ", c: "punct" },
    { t: "average", c: "fn" },
    { t: "(marks))", c: "punct" },
  ],
} as const;

type Lang = keyof typeof SAMPLES;

export function ThemePlayground() {
  const [active, setActive] = useState<Theme>(THEMES[0]);
  const [lang, setLang] = useState<Lang>("Python");

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
              Hover, click, swap. Every theme rewires backgrounds, accents, and syntax colors in real time.
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl border-2 border-foreground bg-card shadow-pop">
            {(Object.keys(SAMPLES) as Lang[]).map((l) => (
              <button
                key={l}
                data-cursor="hover"
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-colors ${
                  lang === l ? "bg-foreground text-background" : "hover:bg-subtle"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Theme picker */}
          <div className="space-y-3">
            {THEMES.map((t) => {
              const isActive = active.id === t.id;
              return (
                <button
                  key={t.id}
                  data-cursor="hover"
                  data-cursor-label={isActive ? "live" : "swap"}
                  onClick={() => setActive(t)}
                  className={`w-full text-left rounded-xl border-2 border-foreground p-3 transition-transform ${
                    isActive ? "shadow-pop -translate-y-0.5" : "hover:-translate-y-0.5 hover:shadow-pop"
                  }`}
                  style={{ background: t.panel, color: t.text }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-display font-bold text-[15px] leading-tight">{t.name}</div>
                      <div className="text-[11px] font-mono opacity-70 mt-0.5">{t.vibe}</div>
                    </div>
                    {isActive && (
                      <span
                        className="h-6 w-6 grid place-items-center rounded-full border-2"
                        style={{ borderColor: t.text, background: t.accent, color: t.bg }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
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
                </button>
              );
            })}
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
                <div className="font-mono text-[11px] font-bold opacity-80">
                  {lang === "JavaScript" ? "fizzbuzz.js" : lang === "Bangla" ? "average.py" : "hello.py"}
                </div>
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
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={active.id + lang}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    data-cursor="code"
                    className="font-mono text-[12.5px] leading-6 py-5 px-4 cursor-none whitespace-pre-wrap"
                  >
                    {SAMPLES[lang].map((tok, i) => (
                      <span key={i} style={{ color: active.syntax[tok.c as keyof Theme["syntax"]] }}>
                        {tok.t}
                      </span>
                    ))}
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
                <span className="opacity-70">UTF-8 · LF · spaces: 4</span>
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}