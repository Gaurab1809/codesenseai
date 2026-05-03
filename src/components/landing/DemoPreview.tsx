import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Bug, Wand2, ShieldCheck, Languages, Copy, Save } from "lucide-react";

export function DemoPreview() {
  return (
    <section id="playground" className="relative py-28 border-t border-border bg-subtle">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium text-primary">Live workspace</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Your AI code review, on tap.
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Paste code on the left. Switch tabs for explanations, bugs, improvements, security, and Bangla mode.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-xl border border-border bg-card shadow-elegant overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1fr_1fr]">
            {/* Editor */}
            <div className="border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="font-mono text-muted-foreground">main.py</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-muted-foreground">Python</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="p-1.5 hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                  <button className="p-1.5 hover:text-foreground"><Save className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="font-mono text-[12.5px] leading-6 p-5">
                <div className="grid grid-cols-[1.75rem_1fr] text-muted-foreground/50">
                  {["1","2","3","4","5","6","7","8"].map((n) => <span key={n} className="select-none">{n}</span>)}
                </div>
                <pre className="-mt-[12rem] pl-7 text-foreground/90 whitespace-pre-wrap">
{`def find_duplicates(items):
    seen = set()
    duplicates = []
    for item in items:
        if item in seen:
            duplicates.append(item)
        else:
            seen.add(item)
    return duplicates`}
                </pre>
              </div>
              <div className="flex flex-wrap gap-1.5 p-3 border-t border-border">
                <Button size="sm" className="h-7 text-[12px]"><Play className="h-3 w-3 mr-1" /> Explain</Button>
                <Button size="sm" variant="outline" className="h-7 text-[12px]"><Bug className="h-3 w-3 mr-1" /> Debug</Button>
                <Button size="sm" variant="outline" className="h-7 text-[12px]"><Wand2 className="h-3 w-3 mr-1" /> Optimize</Button>
                <Button size="sm" variant="outline" className="h-7 text-[12px]"><ShieldCheck className="h-3 w-3 mr-1" /> Secure</Button>
                <Button size="sm" variant="outline" className="h-7 text-[12px]"><Languages className="h-3 w-3 mr-1" /> বাংলা</Button>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border text-[12px] overflow-x-auto">
                {["Explanation", "Bugs", "Improvements", "Security", "বাংলা"].map((t, i) => (
                  <button
                    key={t}
                    className={`px-2.5 py-1 rounded-md whitespace-nowrap ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div>
                  <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Purpose</div>
                  <p className="mt-1 text-[13.5px] text-foreground/90">
                    Returns items that appear more than once by tracking what's already been seen using a set for O(1) lookups.
                  </p>
                </div>
                <div>
                  <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Line-by-line</div>
                  <ul className="mt-2 space-y-1.5 text-[13px] text-muted-foreground">
                    <li><span className="font-mono text-foreground">L2-3</span> · Initialize a set and a result list.</li>
                    <li><span className="font-mono text-foreground">L4-7</span> · Iterate; record dupes before marking as seen.</li>
                    <li><span className="font-mono text-foreground">L8</span> · Return the duplicates list.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-subtle p-3">
                  <div className="text-[12px] font-medium">⚡ Complexity · O(n)</div>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                    Down from O(n²) by switching the seen list to a set.
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
