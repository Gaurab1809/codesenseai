import { useEffect, useRef, useState } from "react";

const TRAIL = 10;

export function FunCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "code" | "drag">("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const trail = Array.from({ length: TRAIL }, () => ({ x: mx, y: my }));

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target as HTMLElement;
      const interactive = t.closest("[data-cursor]");
      if (interactive) {
        const v = (interactive.getAttribute("data-cursor") || "hover") as typeof variant;
        setVariant(v);
        setLabel(interactive.getAttribute("data-cursor-label") || "");
      } else if (t.closest("button, a, [role='button']")) {
        setVariant("hover"); setLabel("");
      } else if (t.closest("pre, code, .font-mono")) {
        setVariant("code"); setLabel("scan");
      } else {
        setVariant("default"); setLabel("");
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      // dot follows instantly
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      // ring eases
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx - 22}px, ${ry - 22}px, 0)`;
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${rx + 18}px, ${ry + 14}px, 0)`;
      // trail
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
      }
      trail[0].x = mx; trail[0].y = my;
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate3d(${trail[i].x - 3}px, ${trail[i].y - 3}px, 0) scale(${1 - i / (TRAIL + 2)})`;
        el.style.opacity = String(1 - i / TRAIL);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (!enabled) return null;

  const ringSize = variant === "hover" ? 64 : variant === "code" ? 56 : variant === "drag" ? 72 : 44;
  const ringColor =
    variant === "hover" ? "var(--coral)"
    : variant === "code" ? "var(--lime)"
    : variant === "drag" ? "var(--violet)"
    : "var(--foreground)";

  return (
    <>
      {/* Trail */}
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="pointer-events-none fixed top-0 left-0 z-[9990] h-1.5 w-1.5 rounded-full"
          style={{
            background: i % 3 === 0 ? "var(--coral)" : i % 3 === 1 ? "var(--sky)" : "var(--violet)",
            mixBlendMode: "multiply",
          }}
        />
      ))}
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-2 w-2 rounded-full bg-foreground"
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border-2 transition-[width,height,border-color,background] duration-200"
        style={{
          width: ringSize,
          height: ringSize,
          borderColor: ringColor,
          background: variant === "hover" ? "color-mix(in oklab, var(--coral) 18%, transparent)" : "transparent",
        }}
      />
      {/* Label */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[9997] text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-foreground text-background"
        style={{ opacity: label ? 1 : 0, transition: "opacity 0.15s" }}
      >
        {label}
      </div>
    </>
  );
}
