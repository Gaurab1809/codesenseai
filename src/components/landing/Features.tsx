import { BookOpen, Bug, Wand2, Languages, Code2, ShieldCheck } from "lucide-react";
import { Tilt } from "@/components/fx/Tilt";

const features = [
  { icon: BookOpen, title: "Code, but explained", desc: "Line-by-line breakdowns that beginners actually understand.", c: "var(--lime)" },
  { icon: Bug, title: "Bug bounty hunter", desc: "Catches off-by-ones, infinite loops, and sneaky logic bugs.", c: "var(--coral)" },
  { icon: Wand2, title: "Make it faster", desc: "Suggests cleaner, snappier alternatives — with the *why*.", c: "var(--sky)" },
  { icon: Languages, title: "বাংলা mode", desc: "প্রোগ্রামিং কনসেপ্ট সহজ বাংলায় — ইংরেজি টার্ম unchanged.", c: "var(--violet)" },
  { icon: Code2, title: "8 languages", desc: "Python, JS, TS, Java, C, C++, C#, Go, PHP. One workspace.", c: "var(--amber)" },
  { icon: ShieldCheck, title: "Safety net", desc: "Spots unsafe inputs, leaked secrets, and injection risks.", c: "var(--lime)" },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/features</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
            Six superpowers in one
            <span className="ml-2 inline-block bg-[var(--coral)] px-2 -rotate-1 border-2 border-foreground rounded-lg">tiny</span> tab.
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Tilt key={f.title} max={8}>
              <div data-cursor="hover" className="sticker p-6 h-full">
                <div
                  className="h-12 w-12 rounded-xl border-2 border-foreground grid place-items-center mb-4"
                  style={{ background: f.c, transform: `rotate(${(i % 2 ? -1 : 1) * 4}deg)` }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-[17px] font-display font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
