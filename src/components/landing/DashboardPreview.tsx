import { motion } from "framer-motion";
import { Activity, BookOpen, Code2, Flame, Trophy } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="relative py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium text-primary">Your dashboard</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Track every analysis, fix, and learning streak.
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            A focused workspace for your code, your bugs, and your progress — not a busy dashboard graveyard.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-xl border border-border bg-card shadow-elegant overflow-hidden"
        >
          <div className="grid grid-cols-[180px_1fr]">
            {/* Sidebar */}
            <aside className="border-r border-border bg-subtle p-3 hidden md:block">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1.5">Workspace</div>
              {[
                ["Overview", true],
                ["New Analysis", false],
                ["History", false],
                ["Saved Snippets", false],
                ["Quizzes", false],
                ["Learning", false],
                ["Community", false],
                ["Settings", false],
              ].map(([label, active]) => (
                <div
                  key={label as string}
                  className={`px-2.5 py-1.5 rounded-md text-[12.5px] mb-0.5 ${active ? "bg-card border border-border text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {label}
                </div>
              ))}
            </aside>

            {/* Main */}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[12px] text-muted-foreground">Welcome back, Ayesha</div>
                  <div className="text-[18px] font-semibold tracking-tight">Overview</div>
                </div>
                <div className="text-[11px] px-2 py-1 rounded-md bg-primary/10 text-primary">Pro</div>
              </div>

              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: Activity, label: "Total scans", value: "1,284", delta: "+12%" },
                  { icon: Code2, label: "Bugs fixed", value: "327", delta: "+8%" },
                  { icon: BookOpen, label: "Hours learned", value: "46.2", delta: "+3.4h" },
                  { icon: Flame, label: "Streak", value: "21d", delta: "Personal best" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-background p-3">
                    <div className="flex items-center justify-between">
                      <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-primary">{s.delta}</span>
                    </div>
                    <div className="mt-2 text-[20px] font-semibold tracking-tight">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid lg:grid-cols-[1.4fr_1fr] gap-3">
                {/* Chart */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[12.5px] font-medium">Analyses this week</div>
                    <div className="text-[11px] text-muted-foreground">Mon–Sun</div>
                  </div>
                  <div className="mt-4 flex items-end gap-2 h-24">
                    {[40, 65, 30, 80, 55, 95, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
                        className="flex-1 rounded-sm bg-primary/80"
                        style={{ background: `linear-gradient(180deg, oklch(0.55 0.19 268), oklch(0.55 0.19 268 / 0.4))` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="text-[12.5px] font-medium">Languages</div>
                  <div className="mt-3 space-y-2.5">
                    {[
                      ["Python", 62],
                      ["JavaScript", 24],
                      ["C++", 9],
                      ["Go", 5],
                    ].map(([lang, pct]) => (
                      <div key={lang as string}>
                        <div className="flex items-center justify-between text-[11.5px]">
                          <span>{lang}</span>
                          <span className="text-muted-foreground">{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-subtle overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-border bg-background p-4 flex items-center gap-3">
                <Trophy className="h-4 w-4 text-primary" />
                <div className="text-[12.5px]">
                  <span className="font-medium">Learning Score 1,840</span>
                  <span className="text-muted-foreground"> · 160 to next tier</span>
                </div>
                <div className="flex-1 h-1.5 ml-2 rounded-full bg-subtle overflow-hidden">
                  <div className="h-full w-[78%] bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
