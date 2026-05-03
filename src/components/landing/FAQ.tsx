import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is CodeSense AI really free to start?", a: "Yes. The Free plan gives you 5 analyses per day, bug detection, and Bangla mode — no credit card required." },
  { q: "Which programming languages are supported?", a: "Python, JavaScript, TypeScript, Java, C, C++, C#, Go, and PHP. More are being added based on user requests." },
  { q: "How accurate is the bug detection?", a: "We combine static analysis with LLM reasoning. It's not a replacement for testing, but it consistently catches off-by-one errors, infinite loops, unsafe inputs, and common logic mistakes." },
  { q: "How does Bangla mode work?", a: "Explanations are generated natively in Bangla while keeping technical terms (variables, functions, loops) in English so they map to real-world docs and code." },
  { q: "Do you store my code?", a: "Snippets are private by default. You choose what to save to your library or share publicly to the community." },
];

export function FAQ() {
  return (
    <section className="relative py-28 border-t border-border">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <div className="text-[12px] font-medium text-primary">FAQ</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Questions, answered.
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-[14.5px] font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-[13.5px] text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
