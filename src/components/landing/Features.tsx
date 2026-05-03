import { motion } from "framer-motion";
import { BookOpen, Bug, Wand2, Languages, Code2, ShieldCheck } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Code Explanation", desc: "Overall purpose, logic flow, and line-by-line breakdown — in plain language.", accent: "var(--neon-blue)" },
  { icon: Bug, title: "Bug Detection", desc: "Catch syntax issues, runtime risks, logical errors, and infinite loops.", accent: "var(--neon-violet)" },
  { icon: Wand2, title: "Optimization Engine", desc: "Better naming, cleaner structure, and faster logic suggestions.", accent: "var(--neon-cyan)" },
  { icon: Languages, title: "Bangla Learning Mode", desc: "প্রোগ্রামিং কনসেপ্ট সহজ বাংলায় — technical terms stay developer-friendly.", accent: "var(--neon-violet)" },
  { icon: Code2, title: "Multi-language Support", desc: "Python, JavaScript, Java, C++, C, C#, Go, PHP — one workspace.", accent: "var(--neon-blue)" },
  { icon: ShieldCheck, title: "Security Analysis", desc: "Spot unsafe input handling, hardcoded secrets, and injection risks.", accent: "var(--neon-cyan)" },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Capabilities</div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
            Everything an AI mentor should do — <span className="text-gradient">at a senior level</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six tightly integrated systems work together to explain, debug, optimize, and teach.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative glass rounded-2xl p-6 shadow-card overflow-hidden"
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-2xl"
                style={{ background: `radial-gradient(circle, ${f.accent}, transparent 70%)` }}
              />
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border"
                style={{ borderColor: `${f.accent}`, color: f.accent, background: `color-mix(in oklab, ${f.accent} 12%, transparent)` }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
