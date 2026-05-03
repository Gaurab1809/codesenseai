import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "$0", desc: "Get started with AI explanations.", features: ["5 analyses / day", "Bug detection", "Bangla mode", "Community support"], cta: "Start free", highlight: false },
  { name: "Pro", price: "$12", suffix: "/mo", desc: "For serious learners and devs.", features: ["Unlimited analyses", "Optimization engine", "Security analysis", "PDF exports", "Quiz generator"], cta: "Go Pro", highlight: true },
  { name: "Team", price: "$29", suffix: "/mo", desc: "Collaborate and learn together.", features: ["Everything in Pro", "Shared workspaces", "Team leaderboards", "API access", "Priority support"], cta: "Start team trial", highlight: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Pricing</div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
            Simple plans. <span className="text-gradient">Serious value.</span>
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative glass rounded-2xl p-7 shadow-card ${
                p.highlight ? "ring-1 ring-[var(--neon-violet)]/50 shadow-glow-violet" : ""
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.suffix && <span className="text-sm text-muted-foreground">{p.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-[var(--neon-cyan)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full mt-7 ${p.highlight ? "bg-brand-gradient text-white border-0 shadow-glow" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                {p.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
