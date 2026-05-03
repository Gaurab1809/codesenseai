import { motion } from "framer-motion";
import { Bug, Wand2, ShieldCheck, Languages, Play } from "lucide-react";
import { Tilt } from "@/components/fx/Tilt";

export function DemoPreview() {
  return (
    <section id="playground" className="relative py-24 bg-subtle border-y-2 border-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/playground</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
            Paste it. <span className="bg-[var(--lime)] px-2 border-2 border-foreground rounded-lg inline-block -rotate-1">Get it.</span>
          </h2>
        </div>

        <Tilt max={4}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 sticker-lg overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              {/* Editor */}
              <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
                <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-foreground bg-[var(--amber)]">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)] border border-foreground" />
                    <span className="h-2.5 w-2.5 rounded-full bg-card border border-foreground" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--lime)] border border-foreground" />
                  </div>
                  <div className="font-mono text-[11px] font-bold">main.py</div>
                  <div className="font-mono text-[10px] px-1.5 py-0.5 bg-foreground text-background rounded">PY</div>
                </div>
                <pre data-cursor="code" className="font-mono text-[12.5px] leading-6 p-5 cursor-none">
{`def find_duplicates(items):
    seen = set()
    dupes = []
    for x in items:
        if x in seen:
            dupes.append(x)
        else:
            seen.add(x)
    return dupes`}
                </pre>
                <div className="flex flex-wrap gap-1.5 p-3 border-t-2 border-foreground">
                  {[
                    { i: Play, l: "Explain", c: "var(--lime)" },
                    { i: Bug, l: "Debug", c: "var(--coral)" },
                    { i: Wand2, l: "Optimize", c: "var(--sky)" },
                    { i: ShieldCheck, l: "Secure", c: "var(--amber)" },
                    { i: Languages, l: "বাংলা", c: "var(--violet)" },
                  ].map((b) => (
                    <button
                      key={b.l}
                      data-cursor="hover"
                      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border-2 border-foreground font-bold text-[11.5px] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform"
                      style={{ background: b.c }}
                    >
                      <b.i className="h-3 w-3" /> {b.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div>
                <div className="flex items-center gap-1 px-3 py-2.5 border-b-2 border-foreground text-[12px] overflow-x-auto">
                  {["Explanation", "Bugs · 0", "Improvements", "বাংলা"].map((t, i) => (
                    <button
                      key={t}
                      data-cursor="hover"
                      className={`px-2.5 py-1 rounded-lg whitespace-nowrap border-2 ${i === 0 ? "border-foreground bg-[var(--coral)] font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground text-background rounded inline-block">summary</div>
                    <p className="mt-2 text-[14px]">
                      Returns items that show up <span className="bg-[var(--lime)] px-1 border border-foreground rounded">more than once</span> using a fast set lookup.
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-foreground p-3 bg-[var(--sky)]">
                    <div className="text-[12px] font-bold">⚡ Complexity</div>
                    <div className="mt-0.5 text-[12px]">O(n) — set lookups are O(1) on average.</div>
                  </div>
                  <div className="rounded-xl border-2 border-foreground p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">line by line</div>
                    <ul className="mt-1.5 space-y-1 text-[12.5px]">
                      <li>· <span className="font-mono">L2-3</span> — empty set + result list.</li>
                      <li>· <span className="font-mono">L4-7</span> — loop, record dupes, mark as seen.</li>
                      <li>· <span className="font-mono">L8</span> — return the dupes.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Tilt>
      </div>
    </section>
  );
}
