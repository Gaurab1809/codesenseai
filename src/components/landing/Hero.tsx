import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import aiCore from "@/assets/ai-core.jpg";
import { FloatingSymbols } from "./FloatingSymbols";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <FloatingSymbols />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
            AI that actually explains your code
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            Learn Programming With{" "}
            <span className="text-gradient">AI That Actually Explains</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 text-lg text-muted-foreground max-w-xl"
          >
            Paste your code and get beginner-friendly explanations, bug detection,
            optimization suggestions, and Bangla learning support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" className="bg-brand-gradient text-white border-0 shadow-glow hover:opacity-95 group">
              Try Free
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="glass border-white/10">
              <Play className="mr-1 h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Beginner Friendly", "বাংলা Supported", "Multi-language AI"].map((b) => (
              <span key={b} className="glass rounded-full px-3 py-1 text-xs text-muted-foreground">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "50K+", l: "Analyses" },
              { v: "98%", l: "Satisfaction" },
              { v: "100+", l: "Universities" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative h-[480px] lg:h-[560px]">
          <div className="absolute inset-0 rounded-3xl bg-[var(--gradient-glow)] blur-2xl" aria-hidden />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, 4, 0, -4, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative w-[88%] aspect-square">
              <img
                src={aiCore}
                alt="CodeSense AI core visualization"
                width={1024}
                height={1024}
                className="w-full h-full object-cover rounded-full opacity-90 mix-blend-screen"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
            </div>
          </motion.div>

          {/* orbiting symbols */}
          {["</>", "{ }", "=>", "[ ]"].map((s, i) => (
            <motion.div
              key={s}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 glass rounded-xl px-3 py-1.5 text-sm font-mono text-foreground/80"
              style={{ ["--orbit-r" as never]: `${180 + i * 8}px` } as React.CSSProperties}
              animate={{ rotate: 360 }}
              transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear" }}
            >
              <div style={{ transform: `translateX(${180 + i * 8}px)` }}>
                <span className="block" style={{ transform: "rotate(0deg)" }}>{s}</span>
              </div>
            </motion.div>
          ))}

          {/* Floating UI cards */}
          <motion.div
            className="absolute top-6 left-2 glass rounded-xl p-3 shadow-elegant"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bug detected</div>
            <div className="text-xs mt-1 font-mono text-[var(--neon-violet)]">off-by-one · line 14</div>
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-2 glass rounded-xl p-3 shadow-elegant"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Score</div>
            <div className="text-xs mt-1 font-mono text-[var(--neon-cyan)]">Readability · 92/100</div>
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-0 glass rounded-xl p-3 shadow-elegant"
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">বাংলা মোড</div>
            <div className="text-xs mt-1">লুপটি ৫ বার চলবে</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
