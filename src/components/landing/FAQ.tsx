import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is it actually free?", a: "Yep — 5 analyses/day forever, no card. Pro unlocks unlimited + export + quizzes." },
  { q: "Which languages work?", a: "Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP. More on the way." },
  { q: "How accurate is bug detection?", a: "Static analysis + LLM reasoning. Not a test suite, but it consistently catches off-by-ones, infinite loops, unsafe inputs, and common logic mistakes." },
  { q: "How does Bangla mode work?", a: "Explanations are written natively in Bangla, while keeping technical terms (loop, function, array) in English so they map to real docs and code." },
  { q: "Do you store my code?", a: "Private by default. You decide what to save to your library or share with the community." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <span className="font-mono text-[12px] uppercase tracking-widest px-2 py-1 bg-foreground text-background rounded">/faq</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold tracking-tight">
            Common questions.
          </h2>
        </div>
        <div className="mt-10 sticker p-2">
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-b-2 border-foreground/10 last:border-b-0 px-3">
                <AccordionTrigger data-cursor="hover" className="text-[15px] font-display font-bold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[13.5px] text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
