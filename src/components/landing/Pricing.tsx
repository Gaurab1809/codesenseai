import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "$0", desc: "Get started with AI explanations.", features: ["5 analyses / day", "Bug detection", "Bangla mode", "Community support"], cta: "Start free", highlight: false },
  { name: "Pro", price: "$12", suffix: "/mo", desc: "For serious learners and devs.", features: ["Unlimited analyses", "Optimization engine", "Security analysis", "PDF exports", "Quiz generator"], cta: "Go Pro", highlight: true },
  { name: "Team", price: "$29", suffix: "/mo", desc: "Collaborate and learn together.", features: ["Everything in Pro", "Shared workspaces", "Team leaderboards", "API access", "Priority support"], cta: "Start trial", highlight: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 border-t border-border bg-subtle">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium text-primary">Pricing</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Simple plans. Real value.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className={`relative rounded-xl border bg-card p-6 ${p.highlight ? "border-primary/40 shadow-glow" : "border-border"}`}
            >
              {p.highlight && (
                <div className="absolute -top-2.5 left-6 bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md">
                  Popular
                </div>
              )}
              <div className="text-[13px] font-medium">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{p.price}</span>
                {p.suffix && <span className="text-[13px] text-muted-foreground">{p.suffix}</span>}
              </div>
              <p className="mt-1.5 text-[13px] text-muted-foreground">{p.desc}</p>
              <Button
                className="w-full mt-5 h-9"
                variant={p.highlight ? "default" : "outline"}
              >
                {p.cta}
              </Button>
              <ul className="mt-5 space-y-2 text-[13px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 mt-0.5 text-primary" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
