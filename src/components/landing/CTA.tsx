import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden p-10 sm:p-14 text-center">
          <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Stop guessing what your code does.
            </h2>
            <p className="mt-3 text-muted-foreground text-pretty max-w-xl mx-auto">
              Start understanding it. Free forever plan, no credit card.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <Button size="lg" className="h-10 px-4 shadow-glow group">
                Start for free
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" className="h-10 px-4">Talk to us</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
