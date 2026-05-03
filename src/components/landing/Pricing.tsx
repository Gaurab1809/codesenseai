import { Check } from "lucide-react";
import { Tilt } from "@/components/fx/Tilt";
import { Magnetic } from "@/components/fx/Magnetic";

const plans = [
  { name: "Free", price: "$0", desc: "Get started.", color: "var(--lime)", features: ["5 analyses / day", "Bug detection", "Bangla mode", "Community"], cta: "Start free", highlight: false },
  { name: "Pro", price: "$12", suffix: "/mo", desc: "For serious learners.", color: "var(--coral)", features: ["Unlimited analyses", "Optimization", "Security scan", "PDF exports", "Quiz generator"], cta: "Go Pro", highlight: true },
  { name: "Team", price: "$29", suffix: "/mo", desc: "Learn together.", color: "var(--sky)", features: ["Everything in Pro", "Shared workspaces", "Leaderboards", "API access", "Priority support"], cta: "Start trial", highlight: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/pricing</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
            Pick your <span className="bg-[var(--violet)] px-2 border-2 border-foreground rounded-lg inline-block rotate-1">power-up</span>.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <Tilt key={p.name} max={6}>
              <div className={`sticker p-6 h-full relative ${p.highlight ? "shadow-pop-lg" : ""}`} style={{ background: p.highlight ? p.color : undefined }}>
                {p.highlight && (
                  <div className="absolute -top-3 left-5 bg-foreground text-background text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded -rotate-2">
                    most loved
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-[14px] font-bold">{p.name}</div>
                  <div className="h-8 w-8 rounded-lg border-2 border-foreground" style={{ background: p.color, transform: `rotate(${i % 2 ? -6 : 6}deg)` }} />
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold">{p.price}</span>
                  {p.suffix && <span className="text-[13px] text-muted-foreground">{p.suffix}</span>}
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">{p.desc}</p>
                <Magnetic strength={6}>
                  <a
                    data-cursor="hover"
                    href="#start"
                    className="mt-5 w-full inline-flex justify-center items-center h-10 rounded-xl border-2 border-foreground font-bold text-[13px] shadow-pop hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    style={{ background: p.highlight ? "var(--card)" : p.color }}
                  >
                    {p.cta}
                  </a>
                </Magnetic>
                <ul className="mt-5 space-y-2 text-[13px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
