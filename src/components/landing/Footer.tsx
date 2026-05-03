import { Logo } from "@/components/brand/Logo";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t-2 border-foreground bg-[var(--amber)]/40">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-[13.5px] max-w-sm">
            Your friendly AI mentor for learning to code. Built for beginners, loved by devs.
          </p>
        </div>
        <div>
          <div className="text-[13px] font-bold mb-3">Product</div>
          <ul className="space-y-2 text-[13px]">
            <li><a href="#features" data-cursor="hover" className="hover:underline">Features</a></li>
            <li><a href="#playground" data-cursor="hover" className="hover:underline">Playground</a></li>
            <li><a href="#pricing" data-cursor="hover" className="hover:underline">Pricing</a></li>
            <li><a href="#faq" data-cursor="hover" className="hover:underline">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[13px] font-bold mb-3">Company</div>
          <ul className="space-y-2 text-[13px]">
            <li><a href="#" data-cursor="hover" className="hover:underline">About</a></li>
            <li><a href="#" data-cursor="hover" className="hover:underline">Contact</a></li>
            <li><a href="#" data-cursor="hover" className="hover:underline">Privacy</a></li>
          </ul>
          <div className="flex items-center gap-2 mt-4">
            {[Github, Linkedin, Twitter].map((Icon, i) => (
              <a key={i} href="#" data-cursor="hover" className="h-8 w-8 grid place-items-center rounded-lg border-2 border-foreground bg-card hover:bg-subtle">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t-2 border-foreground py-4 text-center text-[12px] font-mono">
        © {new Date().getFullYear()} CodeSense AI · made with ☕ + ⚡
      </div>
    </footer>
  );
}
