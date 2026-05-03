import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "border-b border-border/80 bg-background/80 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#playground" className="hover:text-foreground transition-colors">Playground</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#changelog" className="hover:text-foreground transition-colors">Changelog</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
          </nav>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="text-[13px]">Sign in</Button>
          <Button size="sm" className="text-[13px] h-8 px-3 rounded-md">
            Try free →
          </Button>
        </div>
      </div>
    </header>
  );
}
