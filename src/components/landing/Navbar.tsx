import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Magnetic } from "@/components/fx/Magnetic";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-3 inset-x-3 z-50">
      <div className={`mx-auto max-w-6xl rounded-2xl border-2 border-foreground bg-card px-4 sm:px-5 h-14 flex items-center justify-between transition-shadow ${scrolled ? "shadow-pop" : ""}`}>
        <Link to="/" data-cursor="hover"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px]">
          {[
            ["Features", "#features"],
            ["Playground", "#playground"],
            ["Pricing", "#pricing"],
            ["FAQ", "#faq"],
          ].map(([l, h]) => (
            <a key={l} href={h} data-cursor="hover" className="px-3 py-1.5 rounded-lg hover:bg-subtle transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic strength={6}>
            <a
              href="#start"
              data-cursor="hover"
              data-cursor-label="go!"
              className="inline-flex items-center h-9 px-3.5 rounded-xl bg-[var(--coral)] border-2 border-foreground text-foreground font-semibold text-[13px] shadow-pop hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Try Free →
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
