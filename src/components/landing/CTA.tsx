import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/fx/Magnetic";

export function CTA() {
  return (
    <section id="start" className="relative py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative sticker-lg p-10 sm:p-14 text-center overflow-hidden bg-[var(--lime)]">
          <div className="absolute inset-0 dot-paper opacity-30" aria-hidden />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-balance">
              Stop guessing.<br />Start <span className="bg-[var(--coral)] px-2 border-2 border-foreground rounded-lg inline-block -rotate-1">understanding</span>.
            </h2>
            <p className="mt-4 text-[15px] text-pretty max-w-xl mx-auto">
              Free forever. No card. Just paste and go.
            </p>
            <div className="mt-7 flex items-center justify-center">
              <Magnetic>
                <a
                  data-cursor="hover"
                  data-cursor-label="yes!"
                  href="#"
                  className="inline-flex items-center gap-2 h-14 px-7 rounded-2xl bg-card border-2 border-foreground font-display font-bold text-[18px] shadow-pop-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Try CodeSense free <ArrowRight className="h-5 w-5" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
