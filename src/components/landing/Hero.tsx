import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-pattern" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 text-center">
        <motion.a
          href="#changelog"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[12px] text-muted-foreground hover:bg-subtle transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          New · Bangla learning mode is live
          <ArrowRight className="h-3 w-3" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-balance text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02] text-gradient"
        >
          The AI that explains
          <br className="hidden sm:block" /> code like a senior dev.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-pretty text-[17px] sm:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Paste any snippet. Get clear explanations, real bug detection, optimization
          tips, and Bangla learning support — built for beginner programmers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Button size="lg" className="h-10 px-4 rounded-md shadow-glow group">
            Start for free
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button size="lg" variant="outline" className="h-10 px-4 rounded-md">
            Watch the demo
          </Button>
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
          {["Free forever plan", "No credit card", "8 languages", "বাংলা supported"].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary" /> {t}
            </span>
          ))}
        </div>

        {/* Product preview card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-x-12 -top-12 -bottom-12 -z-10 dot-pattern opacity-50" />
          <div className="rounded-xl border border-border bg-card shadow-elegant overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-subtle">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
              </div>
              <div className="text-[11px] font-mono text-muted-foreground">codesense.app · main.py</div>
              <div className="text-[11px] text-muted-foreground">⌘K</div>
            </div>
            <HeroPreview />
          </div>
        </motion.div>

        {/* Logo strip */}
        <div className="mt-16">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Trusted by learners at
          </p>
          <div className="mt-5 marquee-fade flex items-center justify-center gap-10 text-muted-foreground/60 font-display font-medium text-sm">
            {["BUET", "MIT OCW", "Stanford CIP", "freeCodeCamp", "Coursera", "Kaggle"].map((n) => (
              <span key={n} className="whitespace-nowrap">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const lines = [
    { n: 1, c: <><span className="text-[oklch(0.55_0.18_300)]">def</span> <span className="text-[oklch(0.45_0.15_240)]">find_duplicates</span>(items):</> },
    { n: 2, c: <>    seen = []</> },
    { n: 3, c: <>    duplicates = []</> },
    { n: 4, c: <>    <span className="text-[oklch(0.55_0.18_300)]">for</span> item <span className="text-[oklch(0.55_0.18_300)]">in</span> items:</> },
    { n: 5, c: <>        <span className="text-[oklch(0.55_0.18_300)]">if</span> item <span className="text-[oklch(0.55_0.18_300)]">in</span> seen:</> },
    { n: 6, c: <>            duplicates.append(item)</> },
    { n: 7, c: <>        seen.append(item)</> },
    { n: 8, c: <>    <span className="text-[oklch(0.55_0.18_300)]">return</span> duplicates</> },
  ];
  return (
    <div className="grid md:grid-cols-[1.05fr_1fr]">
      <div className="font-mono text-[12.5px] leading-6 p-5 text-left bg-card">
        {lines.map((l) => (
          <motion.div
            key={l.n}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + l.n * 0.04, duration: 0.3 }}
            className="grid grid-cols-[1.75rem_1fr]"
          >
            <span className="text-muted-foreground/50 select-none">{l.n}</span>
            <code>{l.c}</code>
          </motion.div>
        ))}
      </div>
      <div className="border-t md:border-t-0 md:border-l border-border bg-subtle/60 p-5 text-left">
        <div className="flex items-center gap-2 text-[11px]">
          {["Explain", "Bugs · 1", "Optimize", "Secure", "বাংলা"].map((t, i) => (
            <span
              key={t}
              className={`px-2 py-1 rounded-md border ${i === 0 ? "border-primary/30 bg-primary/10 text-primary" : "border-transparent text-muted-foreground"}`}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">Summary</div>
          <p className="mt-1.5 text-[13.5px] leading-relaxed">
            Returns items that appear more than once by tracking a <span className="font-mono text-foreground">seen</span> list as it iterates.
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-border bg-card p-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
            <div>
              <div className="text-[12.5px] font-medium">Performance · O(n²)</div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Use a <span className="font-mono">set</span> instead of a list for O(1) membership checks.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-border bg-card p-3">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">বাংলা</div>
          <p className="mt-1 text-[12.5px]">
            ফাংশনটি একটি লিস্টে যেসব আইটেম একাধিকবার আছে সেগুলো ফেরত দেয়।
          </p>
        </div>
      </div>
    </div>
  );
}
