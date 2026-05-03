import { motion } from "framer-motion";
import { Variable, Repeat, Boxes, GitBranch, Brain, Sigma } from "lucide-react";

const concepts = [
  { icon: Variable, label: "Variables" },
  { icon: Repeat, label: "Loops" },
  { icon: GitBranch, label: "Control flow" },
  { icon: Boxes, label: "OOP" },
  { icon: Brain, label: "Recursion" },
  { icon: Sigma, label: "Algorithms" },
];

export function Education() {
  return (
    <section className="relative py-28 border-t border-border bg-subtle">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
        <div>
          <div className="text-[12px] font-medium text-primary">Built to teach</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            A concept library, error explainer, and quiz engine — all from your code.
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Every analysis links back to fundamentals. Every error becomes a lesson. Every snippet can become a quiz.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {concepts.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-lg border border-border bg-card p-3 flex flex-col items-start gap-2"
              >
                <c.icon className="h-4 w-4 text-primary" />
                <span className="text-[12.5px] font-medium">{c.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-soft p-5">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Quiz · generated from your code</div>
          <h3 className="mt-2 text-[15px] font-semibold">What does <code className="font-mono text-primary">find_duplicates([1,2,2,3,3,3])</code> return?</h3>
          <div className="mt-4 space-y-2">
            {[
              { t: "[1, 2, 3]", correct: false },
              { t: "[2, 3, 3]", correct: true },
              { t: "[2, 3]", correct: false },
              { t: "[1, 1, 2]", correct: false },
            ].map((opt) => (
              <button
                key={opt.t}
                className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-[13.5px] transition-colors font-mono ${
                  opt.correct
                    ? "border-primary/40 bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                {opt.t}
                {opt.correct && <span className="ml-2 text-[11px] text-primary not-italic font-sans">✓ correct</span>}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-subtle p-3 text-[12.5px] text-muted-foreground">
            <span className="text-foreground font-medium">Why?</span> Both <span className="font-mono">2</span> and <span className="font-mono">3</span> appear after their first occurrence; the function appends each repeat.
          </div>
        </div>
      </div>
    </section>
  );
}
