import { motion } from "framer-motion";

const items = [
  { name: "Ayesha R.", role: "CSE Student, BUET", quote: "The Bangla mode finally made recursion click. Like having a senior who actually has time." },
  { name: "Marcus L.", role: "Bootcamp grad", quote: "I paste, I learn. The line-by-line breakdowns beat half my course videos." },
  { name: "Tanvir H.", role: "Junior dev", quote: "Caught an off-by-one in my prod PR. Saved me a real bad Monday." },
];

export function Testimonials() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[12px] font-medium text-primary">Loved by learners</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            From first "aha" to first job.
          </h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="text-[14px] leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center text-[11px] font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-[13px] font-medium">{t.name}</div>
                  <div className="text-[12px] text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
