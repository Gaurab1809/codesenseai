import { motion } from "framer-motion";

const items = [
  { name: "Ayesha R.", role: "CSE Student, BUET", quote: "The Bangla mode finally made recursion click for me. It's like having a senior who actually has time." },
  { name: "Marcus L.", role: "Bootcamp Grad", quote: "I paste, I learn. The line-by-line breakdowns are better than half my course videos." },
  { name: "Tanvir H.", role: "Junior Dev", quote: "Bug detection caught an off-by-one in my prod PR. Saved me a real bad Monday." },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--neon-cyan)]">Loved by learners</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">From first <span className="text-gradient">"aha"</span> to first job</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-6 shadow-card"
            >
              <blockquote className="text-sm text-foreground/90 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
