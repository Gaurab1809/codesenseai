import { motion } from "framer-motion";

export function Logo({ size = 32, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <motion.div
        className="relative"
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 rounded-lg bg-brand-gradient opacity-60 blur-lg animate-pulse-glow" />
        <svg viewBox="0 0 40 40" width={size} height={size} className="relative">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.22 250)" />
              <stop offset="100%" stopColor="oklch(0.7 0.26 295)" />
            </linearGradient>
            <radialGradient id="logoCore" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="oklch(0.85 0.18 200)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="oklch(0.7 0.26 295)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="9" fill="url(#logoGrad)" opacity="0.18" />
          <rect x="2" y="2" width="36" height="36" rx="9" fill="none" stroke="url(#logoGrad)" strokeWidth="1.4" />
          <circle cx="20" cy="20" r="10" fill="url(#logoCore)" />
          {/* neural nodes */}
          <g stroke="url(#logoGrad)" strokeWidth="1" opacity="0.7">
            <line x1="20" y1="6" x2="20" y2="12" />
            <line x1="20" y1="28" x2="20" y2="34" />
            <line x1="6" y1="20" x2="12" y2="20" />
            <line x1="28" y1="20" x2="34" y2="20" />
          </g>
          <g fill="url(#logoGrad)">
            <circle cx="20" cy="6" r="1.6" />
            <circle cx="20" cy="34" r="1.6" />
            <circle cx="6" cy="20" r="1.6" />
            <circle cx="34" cy="20" r="1.6" />
          </g>
          {/* </> mark */}
          <g fill="none" stroke="oklch(0.98 0 0)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16,16 12,20 16,24" />
            <polyline points="24,16 28,20 24,24" />
            <line x1="22" y1="14" x2="18" y2="26" opacity="0.7" />
          </g>
        </svg>
      </motion.div>
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-display font-bold text-base tracking-tight">
            CodeSense<span className="text-gradient"> AI</span>
          </span>
        </div>
      )}
    </div>
  );
}
