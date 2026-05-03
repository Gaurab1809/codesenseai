import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "code">("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    setEnabled(true);
    document.documentElement.style.cursor = "none";

    let rx = 0, ry = 0, dx = 0, dy = 0;
    const move = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      const t = e.target as HTMLElement;
      if (t.closest("button, a, [role='button']")) setVariant("hover");
      else if (t.closest("pre, code, .font-mono")) setVariant("code");
      else setVariant("default");
    };
    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.documentElement.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;
  const size = variant === "hover" ? 56 : variant === "code" ? 44 : 36;
  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border transition-[width,height,border-color,background] duration-200 ease-out"
        style={{
          width: size,
          height: size,
          borderColor: variant === "hover" ? "var(--neon-violet)" : "var(--neon-blue)",
          background:
            variant === "hover"
              ? "radial-gradient(circle, oklch(0.7 0.26 295 / 0.25), transparent 70%)"
              : variant === "code"
              ? "radial-gradient(circle, oklch(0.85 0.18 200 / 0.18), transparent 70%)"
              : "transparent",
          boxShadow:
            variant === "hover"
              ? "0 0 32px oklch(0.7 0.26 295 / 0.6)"
              : "0 0 18px oklch(0.72 0.22 250 / 0.4)",
        }}
      />
    </>
  );
}
