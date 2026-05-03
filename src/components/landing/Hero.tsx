import { motion } from "framer-motion";
import { ArrowRight, Bug, Sparkles, Zap, Code2, Languages } from "lucide-react";
import { ParallaxScene } from "@/components/fx/Parallax";
import { Magnetic } from "@/components/fx/Magnetic";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* background paper */}
      <div className="absolute inset-0 dot-paper opacity-50" aria-hidden />

      {/* big background blobs that follow the cursor */}
      <ParallaxScene className="absolute inset-0 pointer-events-none" >
        <div data-depth="0.6" className="absolute -top-20 -left-16 h-[420px] w-[420px] blob bg-[var(--lime)] opacity-70" />
        <div data-depth="0.9" className="absolute top-32 -right-20 h-[380px] w-[380px] blob bg-[var(--sky)] opacity-70" style={{ animationDelay: "-3s" }} />
        <div data-depth="0.4" className="absolute bottom-0 left-1/3 h-[260px] w-[260px] blob bg-[var(--violet)] opacity-60" style={{ animationDelay: "-6s" }} />
      </ParallaxScene>

      <ParallaxScene className="relative mx-auto max-w-6xl px-5 sm:px-6 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        {/* LEFT */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-foreground px-3 py-1 text-[12px] font-semibold shadow-pop"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--coral)]" />
            New: Bangla learning mode <span className="font-mono">v2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-5 text-balance text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.98] tracking-tight"
          >
            Code is fun.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Bugs aren't.</span>
              <svg viewBox="0 0 200 14" className="absolute -bottom-1 left-0 w-full h-3" preserveAspectRatio="none">
                <path d="M2 8 Q 50 0 100 6 T 198 4" stroke="var(--coral)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            Let AI <span className="bg-[var(--lime)] px-2 -rotate-1 inline-block border-2 border-foreground rounded-lg">explain</span> your code.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-5 text-[17px] text-pretty text-muted-foreground max-w-xl"
          >
            Paste a snippet → get plain-English explanations, bug fixes, optimization tips, and Bangla support. Your friendly AI mentor for learning to code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#start"
                data-cursor="hover"
                data-cursor-label="let's go"
                className="inline-flex items-center gap-1.5 h-12 px-5 rounded-2xl bg-[var(--coral)] border-2 border-foreground text-foreground font-bold shadow-pop-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Start coding free <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic strength={10}>
              <a
                href="#playground"
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 h-12 px-5 rounded-2xl bg-card border-2 border-foreground text-foreground font-semibold shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                ▶ Watch demo
              </a>
            </Magnetic>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { l: "Beginner friendly", c: "var(--lime)" },
              { l: "বাংলা সাপোর্ট", c: "var(--sky)" },
              { l: "8 languages", c: "var(--amber)" },
            ].map((b) => (
              <span key={b.l} className="text-[12px] font-semibold px-2.5 py-1 rounded-full border-2 border-foreground" style={{ background: b.c }}>
                {b.l}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — playful 3D sticker scene */}
        <div className="relative h-[520px] lg:h-[560px]" style={{ perspective: 1200 }}>
          {/* Main editor card */}
          <div data-depth="0.3" data-rot="2" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[88%]">
            <div className="sticker-lg p-3.5 bg-card">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)] border border-foreground" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)] border border-foreground" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--lime)] border border-foreground" />
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">main.py</div>
                <div className="font-mono text-[10px] px-1.5 py-0.5 bg-[var(--lime)] border border-foreground rounded">live</div>
              </div>
              <pre className="font-mono text-[12.5px] leading-6 bg-subtle rounded-xl p-3 border-2 border-foreground/10">
{`def greet(name):
    return f"hi, {name} 👋"

print(greet("dev"))`}
              </pre>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {[
                  ["Explain", "var(--sky)"],
                  ["Debug", "var(--coral)"],
                  ["Bangla", "var(--violet)"],
                ].map(([l, c]) => (
                  <div key={l} data-cursor="hover" className="text-center text-[11px] font-bold py-1.5 rounded-lg border-2 border-foreground cursor-none" style={{ background: c }}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating sticker cards */}
          <div data-depth="1.6" data-rot="-4" className="absolute top-2 left-0 sticker p-3 w-44 wobble bg-[var(--lime)]" style={{ animationDelay: "-1s" }}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <Bug className="h-3.5 w-3.5" /> Bug found
            </div>
            <div className="mt-1 font-mono text-[11px]">off-by-one · L14</div>
          </div>

          <div data-depth="1.3" data-rot="3" className="absolute bottom-6 right-0 sticker p-3 w-48 float-y bg-[var(--sky)]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <Zap className="h-3.5 w-3.5" /> Optimized
            </div>
            <div className="mt-1 font-mono text-[11px]">O(n²) → O(n)</div>
          </div>

          <div data-depth="2" data-rot="6" className="absolute top-24 right-2 sticker p-3 w-44 bg-[var(--coral)]" style={{ animationDelay: "-2s" }}>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <Sparkles className="h-3.5 w-3.5" /> Explained
            </div>
            <div className="mt-1 text-[11px]">Loops 3x and prints!</div>
          </div>

          <div data-depth="1.8" data-rot="-5" className="absolute bottom-2 left-2 sticker p-3 bg-[var(--violet)]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <Languages className="h-3.5 w-3.5" /> বাংলা
            </div>
            <div className="mt-1 text-[11px]">লুপটি ৫ বার চলবে</div>
          </div>

          {/* Floating syntax stickers */}
          {[
            { s: "</>", x: "10%", y: "8%", c: "var(--amber)", d: 2.5, r: -8 },
            { s: "{ }", x: "82%", y: "14%", c: "var(--lime)", d: 2.2, r: 8 },
            { s: "=>", x: "4%", y: "62%", c: "var(--sky)", d: 1.8, r: -6 },
            { s: "[ ]", x: "88%", y: "60%", c: "var(--coral)", d: 2.4, r: 6 },
            { s: "( )", x: "46%", y: "94%", c: "var(--violet)", d: 1.6, r: 4 },
          ].map((it, i) => (
            <div
              key={i}
              data-depth={it.d}
              data-rot={it.r}
              className="absolute font-mono font-bold text-sm h-10 w-10 grid place-items-center rounded-xl border-2 border-foreground sticker"
              style={{ left: it.x, top: it.y, background: it.c, animation: `float-y ${4 + i}s ease-in-out infinite`, animationDelay: `-${i}s` }}
            >
              {it.s}
            </div>
          ))}

          {/* Spinning gear sticker */}
          <div data-depth="0.8" className="absolute top-4 right-10 spin-slow">
            <div className="h-12 w-12 rounded-full border-2 border-foreground bg-[var(--amber)] grid place-items-center font-mono text-[10px] font-bold">AI</div>
          </div>
        </div>
      </ParallaxScene>

      {/* Marquee strip */}
      <div className="relative mt-16 border-y-2 border-foreground bg-[var(--lime)] overflow-hidden">
        <div className="marquee flex gap-10 py-3 whitespace-nowrap font-mono font-bold text-[13px] uppercase tracking-wider">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {["Python", "•", "JavaScript", "•", "TypeScript", "•", "Java", "•", "C++", "•", "C#", "•", "Go", "•", "PHP", "•", "Rust", "•"].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
