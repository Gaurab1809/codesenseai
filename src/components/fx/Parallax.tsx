import { useEffect, useRef } from "react";

/** Wraps children; child elements with [data-depth="N"] move based on cursor (-1..1 range). */
export function ParallaxScene({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      cx = (e.clientX - (r.left + r.width / 2)) / r.width;
      cy = (e.clientY - (r.top + r.height / 2)) / r.height;
    };
    const tick = () => {
      tx += (cx - tx) * 0.08;
      ty += (cy - ty) * 0.08;
      el.querySelectorAll<HTMLElement>("[data-depth]").forEach((node) => {
        const d = parseFloat(node.dataset.depth || "0");
        const rot = parseFloat(node.dataset.rot || "0");
        node.style.transform = `translate3d(${-tx * d * 40}px, ${-ty * d * 40}px, 0) rotate(${tx * rot}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
