import { motion } from "framer-motion";

const symbols = ["</>", "{ }", "( )", "[ ]", "=>", "_", "&&", "||", "++"];

export function FloatingSymbols() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {symbols.map((s, i) => {
        const left = (i * 97) % 100;
        const top = (i * 53) % 100;
        const dur = 8 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute font-mono text-sm md:text-base text-[var(--neon-blue)]/40 select-none"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.55, 0.2],
              rotate: [0, 6, 0],
            }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            {s}
          </motion.span>
        );
      })}
    </div>
  );
}
