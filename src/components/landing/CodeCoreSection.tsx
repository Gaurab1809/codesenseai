import { CodeCore3D } from "@/components/fx/CodeCore3D";
import { motion } from "framer-motion";

export function CodeCoreSection() {
  return (
    <section id="core" className="relative border-y-2 border-foreground bg-background overflow-hidden">
      <div className="relative h-[640px]">
        <div className="absolute inset-0 dot-paper opacity-40 pointer-events-none" />
        <CodeCore3D />
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/ai-core</span>
              <motion.h2
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="mt-3 text-4xl sm:text-5xl font-display font-bold tracking-tight max-w-xl"
              >
                A living <span className="bg-[var(--lime)] px-2 border-2 border-foreground rounded-lg inline-block -rotate-1">AI core</span> orbiting your code.
              </motion.h2>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-card border-2 border-foreground shadow-pop">cursor reactive</span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-[var(--coral)] border-2 border-foreground shadow-pop">600 particles</span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-[var(--sky)] border-2 border-foreground shadow-pop">12 syntax orbs</span>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-md text-sm sm:text-[15px] leading-relaxed bg-card/80 backdrop-blur border-2 border-foreground rounded-2xl p-4 shadow-pop">
              Move your cursor across the scene — the particle field reacts in real time and orbiting syntax tokens dance around the AI core. Same magic, light or dark theme.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}