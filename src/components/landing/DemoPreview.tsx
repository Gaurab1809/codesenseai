import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Bug, Wand2, ShieldCheck, Languages } from "lucide-react";

const code = `def find_duplicates(items):
    seen = []
    duplicates = []
    for item in items:
        if item in seen:
            duplicates.append(item)
        seen.append(item)
    return duplicates`;

const lines = code.split("\n");

export function DemoPreview() {
  return (
    <section id="playground" className="relative py-28">
      <div className="absolute inset-0 bg-mesh opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Live workspace</div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
            Your AI <span className="text-gradient">code review</span>, instantly
          </h2>
          <p className="mt-4 text-muted-foreground">
            Paste code on the left. Switch tabs to see explanations, bugs, improvements, security, and Bangla mode.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 glass rounded-3xl p-3 sm:p-4 shadow-elegant"
        >
          <div className="grid lg:grid-cols-2 gap-3">
            {/* Editor */}
            <div className="rounded-2xl bg-[oklch(0.1_0.03_260)] border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="text-xs font-mono text-muted-foreground">main.py · Python</div>
                <div className="text-[10px] font-mono text-[var(--neon-cyan)]">● live</div>
              </div>
              <div className="relative font-mono text-[13px] leading-6 p-4 overflow-hidden">
                <div className="scan-line" />
                {lines.map((line, i) => (
                  <div key={i} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="text-muted-foreground/40 select-none">{i + 1}</span>
                    <code className="text-foreground/90 whitespace-pre">
                      {line.replace(/\b(def|for|in|if|return)\b/g, (m) => `__${m}__`)
                        .split(/(__[a-z]+__)/)
                        .map((p, idx) =>
                          p.startsWith("__") ? (
                            <span key={idx} className="text-[var(--neon-violet)]">{p.replace(/__/g, "")}</span>
                          ) : (
                            <span key={idx}>{p}</span>
                          )
                        )}
                    </code>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 p-3 border-t border-white/5">
                <Button size="sm" className="bg-brand-gradient text-white border-0"><Play className="h-3 w-3 mr-1" /> Explain</Button>
                <Button size="sm" variant="outline" className="border-white/10"><Bug className="h-3 w-3 mr-1" /> Debug</Button>
                <Button size="sm" variant="outline" className="border-white/10"><Wand2 className="h-3 w-3 mr-1" /> Optimize</Button>
                <Button size="sm" variant="outline" className="border-white/10"><ShieldCheck className="h-3 w-3 mr-1" /> Secure</Button>
                <Button size="sm" variant="outline" className="border-white/10"><Languages className="h-3 w-3 mr-1" /> বাংলা</Button>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl bg-[oklch(0.14_0.03_260)] border border-white/5 overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 text-xs font-medium overflow-x-auto">
                {["Explanation", "Bugs (2)", "Improvements", "Security", "বাংলা"].map((t, i) => (
                  <button
                    key={t}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${i === 0 ? "bg-brand-gradient text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Purpose</div>
                  <p className="mt-1 text-foreground/90">
                    Returns items that appear more than once in a list by tracking what's already been seen.
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Line-by-line</div>
                  <ul className="mt-2 space-y-2 text-muted-foreground">
                    <li><span className="font-mono text-[var(--neon-violet)]">L2-3</span> — Initialize tracking lists.</li>
                    <li><span className="font-mono text-[var(--neon-violet)]">L4-7</span> — Iterate; record duplicates before marking as seen.</li>
                    <li><span className="font-mono text-[var(--neon-violet)]">L8</span> — Return the duplicates list.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-[var(--neon-violet)]/30 bg-[oklch(0.7_0.26_295/0.08)] p-3">
                  <div className="text-xs font-semibold text-[var(--neon-violet)]">⚡ Optimization</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use a <span className="font-mono">set</span> instead of a list for O(1) membership checks — turns this from O(n²) into O(n).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
