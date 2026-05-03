import { motion } from "framer-motion";
import { BookOpen, Bug, Wand2, Languages, Code2, ShieldCheck } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Code Explanation", desc: "Overall purpose, logic flow, and a clean line-by-line breakdown." },
  { icon: Bug, title: "Bug Detection", desc: "Catches syntax issues, runtime risks, logical errors, and infinite loops." },
  { icon: Wand2, title: "Optimization", desc: "Better naming, cleaner structure, and faster algorithms." },
  { icon: Languages, title: "Bangla Mode", desc: "প্রোগ্রামিং কনসেপ্ট সহজ বাংলায় — technical terms stay native." },
  { icon: Code2, title: "8 Languages", desc: "Python, JavaScript, TypeScript, Java, C++, C, C#, Go, PHP." },
  { icon: ShieldCheck, title: "Security Scan", desc: "Spot unsafe input handling, hardcoded secrets, and injection risks." },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium text-primary">Capabilities</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Everything an AI mentor should do.
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Six tightly integrated systems that work together to explain, debug, optimize, and teach.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group bg-card p-7 hover:bg-subtle transition-colors"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground/80 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                <f.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
