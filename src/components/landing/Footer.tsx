import { Logo } from "@/components/brand/Logo";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-[13.5px] text-muted-foreground max-w-sm leading-relaxed">
            CodeSense helps beginner developers learn programming faster — with explanations, bug detection, and Bangla support.
          </p>
          <form className="mt-5 flex gap-2 max-w-sm">
            <Input type="email" placeholder="you@dev.com" className="h-9" />
            <Button type="submit" className="h-9">Subscribe</Button>
          </form>
        </div>
        <div>
          <div className="text-[13px] font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-[13px] text-muted-foreground">
            <li><a href="#features" className="hover:text-foreground">Features</a></li>
            <li><a href="#playground" className="hover:text-foreground">Playground</a></li>
            <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
            <li><a href="#docs" className="hover:text-foreground">Docs</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[13px] font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-[13px] text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground">About</a></li>
            <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
            <li><a href="#privacy" className="hover:text-foreground">Privacy</a></li>
            <li><a href="#terms" className="hover:text-foreground">Terms</a></li>
          </ul>
          <div className="flex items-center gap-3 mt-5 text-muted-foreground">
            <a href="#"><Github className="h-4 w-4 hover:text-foreground" /></a>
            <a href="#"><Linkedin className="h-4 w-4 hover:text-foreground" /></a>
            <a href="#"><Twitter className="h-4 w-4 hover:text-foreground" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-[12px] text-muted-foreground">
        © {new Date().getFullYear()} CodeSense. Built for learners.
      </div>
    </footer>
  );
}
