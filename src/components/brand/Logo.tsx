import { motion } from "framer-motion";

export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2 group">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-lg bg-primary/30 blur-md"
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg width="26" height="26" viewBox="0 0 28 28" className="relative">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.45 0.2 268)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 290)" />
            </linearGradient>
          </defs>
          <rect x="1.5" y="1.5" width="25" height="25" rx="6.5" fill="url(#lg)" />
          <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11,10 8,14 11,18" />
            <polyline points="17,10 20,14 17,18" />
          </g>
          <circle cx="14" cy="14" r="0.9" fill="white" />
        </svg>
      </motion.div>
      {withWordmark && (
        <span className="font-display font-semibold text-[15px] tracking-tight">
          CodeSense<span className="text-muted-foreground/60"> AI</span>
        </span>
      )}
    </div>
  );
}
