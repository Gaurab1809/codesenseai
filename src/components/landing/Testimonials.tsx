import { Tilt } from "@/components/fx/Tilt";

const items = [
  { name: "Ayesha R.", role: "CSE, BUET", quote: "বাংলা mode finally made recursion click. Felt like a senior who actually had time.", c: "var(--lime)" },
  { name: "Marcus L.", role: "Bootcamp grad", quote: "I paste, I learn. The line-by-line beats half my course videos.", c: "var(--sky)" },
  { name: "Tanvir H.", role: "Junior dev", quote: "Caught an off-by-one in my prod PR. Saved my Monday.", c: "var(--coral)" },
];

export function Testimonials() {
  return (
    <section className="relative py-24 bg-subtle border-y-2 border-foreground">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/loved</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
            People won't shut up about it.
          </h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <Tilt key={t.name}>
              <figure className="sticker p-6 h-full" style={{ transform: `rotate(${(i - 1) * 1.2}deg)` }}>
                <blockquote className="text-[15px] leading-relaxed font-medium">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl border-2 border-foreground grid place-items-center font-bold" style={{ background: t.c }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{t.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
